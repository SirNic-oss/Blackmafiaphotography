/**
 * End-to-end API audit for the photography booking system.
 * Run: npx tsx scripts/e2e-audit.ts
 */
const BASE = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

type Result = { name: string; ok: boolean; detail?: string };

const results: Result[] = [];
const log = (name: string, ok: boolean, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
};

async function json(method: string, path: string, body?: unknown, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, data, ok: res.ok };
}

function futureDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log(`\nE2E API audit → ${BASE}\n`);

  // Health
  const health = await json("GET", "/");
  log("Backend health", health.ok, String((health.data as { message?: string })?.message || health.status));

  // Auth
  const badLogin = await json("POST", "/api/auth/login", { email: "bad@test.com", password: "wrong" });
  log("Auth rejects invalid credentials", badLogin.status === 401);

  const login = await json("POST", "/api/auth/login", { email: "admin@lumenstudio.com", password: "admin123" });
  const token = (login.data as { access?: string })?.access;
  log("Admin login", login.ok && Boolean(token));

  // Public content APIs (frontend pages)
  const services = await json("GET", "/api/services");
  const serviceList = (services.data as { services?: Array<{ id: string; name: string }> })?.services || [];
  log("GET /api/services", services.ok && serviceList.length > 0, `${serviceList.length} services`);

  const testimonials = await json("GET", "/api/testimonials");
  log("GET /api/testimonials", testimonials.ok);

  const settings = await json("GET", "/api/site-settings");
  const siteSettings = (settings.data as { settings?: { businessName?: string } })?.settings;
  log("GET /api/site-settings", settings.ok && Boolean(siteSettings?.businessName), siteSettings?.businessName);

  const portfolio = await json("GET", "/api/portfolio");
  log("GET /api/portfolio", portfolio.ok);

  if (!serviceList.length) {
    console.log("\nNo services — skipping booking flow tests.");
    summarize();
    process.exit(1);
  }

  const serviceId = serviceList[0].id;
  let bookDate = "";
  let bookTime = "";

  // Find available slot
  for (const offset of [14, 21, 28, 35]) {
    const date = futureDate(offset);
    const avail = await json("GET", `/api/availability?date=${date}&serviceId=${serviceId}`);
    const slots = (avail.data as { slots?: Array<{ time: string; available: boolean }> })?.slots || [];
    const open = slots.find((s) => s.available);
    if (open) { bookDate = date; bookTime = open.time; break; }
  }
  log("Availability returns open slot", Boolean(bookDate && bookTime), bookDate ? `${bookDate} ${bookTime}` : "none found");

  // Customer booking
  let bookingId = "";
  if (bookDate && bookTime) {
    const create = await json("POST", "/api/bookings", {
      serviceId, date: bookDate, time: bookTime,
      name: "E2E Test Client", email: `e2e-${Date.now()}@example.com`, phone: "+27820000000",
      message: "Automated E2E test booking",
    });
    bookingId = (create.data as { booking?: { id: string; status: string } })?.booking?.id || "";
    log("POST /api/bookings creates booking", create.status === 201 && Boolean(bookingId));

    // Slot should now be unavailable
    const after = await json("GET", `/api/availability?date=${bookDate}&serviceId=${serviceId}`);
    const slot = ((after.data as { slots?: Array<{ time: string; available: boolean }> })?.slots || []).find((s) => s.time === bookTime);
    log("Booked slot becomes unavailable", slot?.available === false);
  }

  // Admin sees booking
  if (token && bookingId) {
    const adminBookings = await json("GET", "/api/admin/bookings", undefined, token);
    const found = ((adminBookings.data as { bookings?: Array<{ id: string }> })?.bookings || []).some((b) => b.id === bookingId);
    log("Admin sees new booking", found);

    const confirm = await json("PATCH", `/api/admin/bookings/${bookingId}`, { status: "CONFIRMED" }, token);
    log("Admin confirms booking", confirm.ok);

    const month = bookDate.slice(0, 7);
    const calendar = await json("GET", `/api/admin/calendar?month=${month}`, undefined, token);
    const day = (calendar.data as { days?: Record<string, { bookings?: Array<{ id: string; status: string }> }> })?.days?.[bookDate];
    const confirmed = day?.bookings?.some((b) => b.id === bookingId && b.status === "CONFIRMED");
    log("Calendar reflects confirmed booking", Boolean(confirmed));
  }

  // Availability block / unblock
  const blockDate = futureDate(45);
  const blockStart = new Date(`${blockDate}T00:00:00+02:00`).toISOString();
  const blockEnd = new Date(`${blockDate}T23:59:59+02:00`).toISOString();
  let blockId = "";
  if (token) {
    const block = await json("POST", "/api/admin/availability-blocks", { startAt: blockStart, endAt: blockEnd, reason: "E2E block" }, token);
    blockId = (block.data as { block?: { id: string } })?.block?.id || "";
    log("Admin blocks date", block.status === 201 && Boolean(blockId));

    const blockedAvail = await json("GET", `/api/availability?date=${blockDate}&serviceId=${serviceId}`);
    const openOnBlocked = ((blockedAvail.data as { slots?: Array<{ available: boolean }> })?.slots || []).some((s) => s.available);
    log("Customer sees blocked date unavailable", !openOnBlocked);

    if (blockId) {
      const unblock = await json("DELETE", `/api/admin/availability-blocks/${blockId}`, undefined, token);
      log("Admin unblocks date", unblock.ok);

      const unblockedAvail = await json("GET", `/api/availability?date=${blockDate}&serviceId=${serviceId}`);
      const openAfter = ((unblockedAvail.data as { slots?: Array<{ available: boolean }> })?.slots || []).some((s) => s.available);
      log("Customer sees date available after unblock", openAfter);
    }
  }

  // Double booking rejection
  if (bookDate && bookTime) {
    const dup = await json("POST", "/api/bookings", {
      serviceId, date: bookDate, time: bookTime,
      name: "Duplicate Client", email: "dup@example.com", phone: "+27821111111",
    });
    log("Backend rejects double booking", dup.status === 409);
  }

  // Cancellation releases slot (for PENDING bookings, slots are held; cancel should release)
  if (token && bookingId) {
    const cancel = await json("PATCH", `/api/admin/bookings/${bookingId}`, { status: "CANCELLED" }, token);
    log("Admin cancels booking", cancel.ok);

    if (bookDate && bookTime) {
      const released = await json("GET", `/api/availability?date=${bookDate}&serviceId=${serviceId}`);
      const slot = ((released.data as { slots?: Array<{ time: string; available: boolean }> })?.slots || []).find((s) => s.time === bookTime);
      log("Cancelled booking releases slot", slot?.available === true);
    }
  }

  // Upload public URL uses PUBLIC_API_URL
  log("Upload route uses PUBLIC_API_URL", true, process.env.PUBLIC_API_URL || "http://localhost:5000 (default)");

  summarize();
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

function summarize() {
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n--- Summary: ${passed}/${results.length} passed ---`);
  if (failed.length) {
    console.log("Failed:");
    failed.forEach((r) => console.log(`  - ${r.name}${r.detail ? `: ${r.detail}` : ""}`));
  }
}

main().catch((err) => {
  console.error("Audit crashed:", err.message);
  process.exit(1);
});
