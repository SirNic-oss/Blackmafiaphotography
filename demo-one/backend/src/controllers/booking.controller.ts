import { BookingStatus, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const SLOT_MINUTES = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
// The business operates in South Africa. Stored timestamps remain UTC while
// date/time inputs and displayed booking slots use this business timezone.
const BUSINESS_UTC_OFFSET_HOURS = Number(process.env.BUSINESS_UTC_OFFSET_HOURS || "2");
const ACTIVE: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED];

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const dateAt = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - BUSINESS_UTC_OFFSET_HOURS, minute));
};
const businessTime = (date: Date) => {
  const shifted = new Date(date.getTime() + BUSINESS_UTC_OFFSET_HOURS * 60 * 60_000);
  return shifted.toISOString().slice(11, 16);
};
const overlap = (startA: Date, endA: Date, startB: Date, endB: Date) => startA < endB && endA > startB;
function slotsFor(startAt: Date, durationMinutes: number) {
  return Array.from({ length: durationMinutes / SLOT_MINUTES }, (_, index) => new Date(startAt.getTime() + index * SLOT_MINUTES * 60_000));
}

async function conflicts(startAt: Date, endAt: Date) {
  const [block, booking] = await Promise.all([
    prisma.availabilityBlock.findFirst({ where: { startAt: { lt: endAt }, endAt: { gt: startAt } } }),
    prisma.booking.findFirst({ where: { status: { in: ACTIVE }, startAt: { lt: endAt }, endAt: { gt: startAt } } }),
  ]);
  return Boolean(block || booking);
}

export async function listServices(_req: Request, res: Response) {
  const services = await prisma.photographyService.findMany({ where: { active: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
  res.json({ services });
}

export async function getAvailability(req: Request, res: Response) {
  const date = text(req.query.date);
  const serviceId = text(req.query.serviceId);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !serviceId) return res.status(400).json({ error: "date (YYYY-MM-DD) and serviceId are required" });
  const service = await prisma.photographyService.findFirst({ where: { id: serviceId, active: true } });
  if (!service) return res.status(404).json({ error: "Photography service not found" });

  const dayStart = dateAt(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
  const [blocks, occupied] = await Promise.all([
    prisma.availabilityBlock.findMany({ where: { startAt: { lt: dayEnd }, endAt: { gt: dayStart } } }),
    prisma.bookingSlot.findMany({ where: { startsAt: { gte: dayStart, lt: dayEnd }, booking: { status: { in: ACTIVE } } }, select: { startsAt: true } }),
  ]);
  const occupiedStarts = new Set(occupied.map(({ startsAt }) => startsAt.getTime()));
  const open = dateAt(date, `${String(OPEN_HOUR).padStart(2, "0")}:00`);
  const close = dateAt(date, `${String(CLOSE_HOUR).padStart(2, "0")}:00`);
  const now = new Date();
  const slots = [] as { time: string; available: boolean }[];
  for (let start = open; start.getTime() + service.durationMinutes * 60_000 <= close.getTime(); start = new Date(start.getTime() + SLOT_MINUTES * 60_000)) {
    const end = new Date(start.getTime() + service.durationMinutes * 60_000);
    const taken = slotsFor(start, service.durationMinutes).some((slot) => occupiedStarts.has(slot.getTime()));
    const blocked = blocks.some((block) => overlap(start, end, block.startAt, block.endAt));
    slots.push({ time: businessTime(start), available: start > now && !taken && !blocked });
  }
  res.json({ date, serviceId, durationMinutes: service.durationMinutes, slots });
}

export async function createBooking(req: Request, res: Response) {
  const name = text(req.body.name), email = text(req.body.email).toLowerCase(), phone = text(req.body.phone);
  const serviceId = text(req.body.serviceId), date = text(req.body.date), time = text(req.body.time);
  if (!name || !email || !phone || !serviceId || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return res.status(400).json({ error: "Name, email, phone, service, date and time are required" });
  const startAt = dateAt(date, time);
  if (Number.isNaN(startAt.getTime()) || startAt <= new Date()) return res.status(400).json({ error: "Please choose a future booking time" });
  const service = await prisma.photographyService.findFirst({ where: { id: serviceId, active: true } });
  if (!service) return res.status(404).json({ error: "Photography service not found" });
  const endAt = new Date(startAt.getTime() + service.durationMinutes * 60_000);
  if (Number(time.slice(0, 2)) < OPEN_HOUR || endAt.getTime() > dateAt(date, `${CLOSE_HOUR}:00`).getTime() || startAt.getUTCMinutes() % SLOT_MINUTES !== 0) return res.status(400).json({ error: "Selected time is outside booking hours" });
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const block = await tx.availabilityBlock.findFirst({ where: { startAt: { lt: endAt }, endAt: { gt: startAt } } });
      if (block) throw new Error("UNAVAILABLE");
      const customer = await tx.customer.upsert({ where: { email }, update: { name, phone }, create: { name, email, phone } });
      const booking = await tx.booking.create({
        data: { customerId: customer.id, serviceId: service.id, startAt, endAt, timezone: text(req.body.timezone) || "Africa/Johannesburg", message: text(req.body.message) || null, serviceName: service.name, durationMinutes: service.durationMinutes },
        include: { customer: true, service: true },
      });
      await tx.bookingSlot.createMany({ data: slotsFor(startAt, service.durationMinutes).map((startsAt) => ({ startsAt, bookingId: booking.id })) });
      return booking;
    });
    res.status(201).json({ booking, message: "Your booking request has been received." });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAVAILABLE" || error.message.includes("Unique constraint"))) return res.status(409).json({ error: "That time was just booked or blocked. Please choose another slot." });
    console.error(error); res.status(500).json({ error: "Unable to create booking" });
  }
}

export async function listBookings(_req: Request, res: Response) {
  const bookings = await prisma.booking.findMany({ include: { customer: true, service: true }, orderBy: { startAt: "asc" } });
  res.json({ bookings });
}

export async function updateBooking(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const status = text(req.body.status) as BookingStatus;
  if (!id || !Object.values(BookingStatus).includes(status)) return res.status(400).json({ error: "Invalid booking status" });
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Booking not found" });
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const activeNext = ACTIVE.includes(status), activeBefore = ACTIVE.includes(existing.status);
      if (activeNext && !activeBefore) {
        if (await conflicts(existing.startAt, existing.endAt)) throw new Error("UNAVAILABLE");
        await tx.bookingSlot.createMany({ data: slotsFor(existing.startAt, existing.durationMinutes).map((startsAt) => ({ startsAt, bookingId: id })) });
      }
      if (!activeNext && activeBefore) await tx.bookingSlot.deleteMany({ where: { bookingId: id } });
      return tx.booking.update({ where: { id }, data: { status, ...(typeof req.body.adminNotes === "string" ? { adminNotes: req.body.adminNotes.trim() || null } : {}) }, include: { customer: true, service: true } });
    });
    res.json({ booking });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAVAILABLE") return res.status(409).json({ error: "This time is no longer available" });
    console.error(error); res.status(500).json({ error: "Unable to update booking" });
  }
}

export async function listBlocks(_req: Request, res: Response) {
  res.json({ blocks: await prisma.availabilityBlock.findMany({ orderBy: { startAt: "asc" } }) });
}

export async function createBlock(req: Request, res: Response) {
  const startAt = new Date(text(req.body.startAt)), endAt = new Date(text(req.body.endAt));
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || startAt >= endAt) return res.status(400).json({ error: "A valid start and end time are required" });
  if (await conflicts(startAt, endAt)) return res.status(409).json({ error: "This period conflicts with an existing booking or block" });
  const block = await prisma.availabilityBlock.create({ data: { startAt, endAt, reason: text(req.body.reason) || null } });
  res.status(201).json({ block });
}

export async function deleteBlock(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  try { await prisma.availabilityBlock.delete({ where: { id } }); res.json({ success: true }); }
  catch { res.status(404).json({ error: "Block not found" }); }
}

async function dayAvailability(date: string, service: { id: string; durationMinutes: number }) {
  const dayStart = dateAt(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
  const [blocks, occupied] = await Promise.all([
    prisma.availabilityBlock.findMany({ where: { startAt: { lt: dayEnd }, endAt: { gt: dayStart } } }),
    prisma.bookingSlot.findMany({ where: { startsAt: { gte: dayStart, lt: dayEnd }, booking: { status: { in: ACTIVE } } }, select: { startsAt: true } }),
  ]);
  const occupiedStarts = new Set(occupied.map(({ startsAt }) => startsAt.getTime()));
  const open = dateAt(date, `${String(OPEN_HOUR).padStart(2, "0")}:00`);
  const close = dateAt(date, `${String(CLOSE_HOUR).padStart(2, "0")}:00`);
  const now = new Date();
  for (let start = open; start.getTime() + service.durationMinutes * 60_000 <= close.getTime(); start = new Date(start.getTime() + SLOT_MINUTES * 60_000)) {
    const end = new Date(start.getTime() + service.durationMinutes * 60_000);
    const taken = slotsFor(start, service.durationMinutes).some((slot) => occupiedStarts.has(slot.getTime()));
    const blocked = blocks.some((block) => overlap(start, end, block.startAt, block.endAt));
    if (start > now && !taken && !blocked) return true;
  }
  return false;
}

export async function getCalendarOverview(req: Request, res: Response) {
  const month = text(req.query.month);
  if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: "month (YYYY-MM) is required" });
  const [year, mon] = month.split("-").map(Number);
  const monthStart = dateAt(`${month}-01`, "00:00");
  const daysInMonth = new Date(year, mon, 0).getDate();
  const monthEnd = new Date(monthStart.getTime() + daysInMonth * 24 * 60 * 60_000);
  const [bookings, blocks, defaultService] = await Promise.all([
    prisma.booking.findMany({
      where: { startAt: { gte: monthStart, lt: monthEnd } },
      include: { customer: true, service: true },
      orderBy: { startAt: "asc" },
    }),
    prisma.availabilityBlock.findMany({
      where: { startAt: { lt: monthEnd }, endAt: { gt: monthStart } },
      orderBy: { startAt: "asc" },
    }),
    prisma.photographyService.findFirst({ where: { active: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
  ]);

  const days: Record<string, { bookings: typeof bookings; blocks: typeof blocks; hasAvailability: boolean }> = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${month}-${String(day).padStart(2, "0")}`;
    const dayStart = dateAt(date, "00:00");
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
    const dayBookings = bookings.filter((booking) => booking.startAt >= dayStart && booking.startAt < dayEnd);
    const dayBlocks = blocks.filter((block) => block.startAt < dayEnd && block.endAt > dayStart);
    const hasAvailability = defaultService ? await dayAvailability(date, defaultService) : false;
    days[date] = { bookings: dayBookings, blocks: dayBlocks, hasAvailability };
  }
  res.json({ month, days, defaultServiceId: defaultService?.id ?? null });
}
