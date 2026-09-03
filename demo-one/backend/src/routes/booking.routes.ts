import { Router } from "express";
import { adminMiddleware } from "../middleware/admin.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { createBlock, createBooking, deleteBlock, getAvailability, getCalendarOverview, listBlocks, listBookings, listServices, updateBooking } from "../controllers/booking.controller";

const router = Router();
router.get("/services", listServices);
router.get("/availability", getAvailability);
router.post("/bookings", createBooking);
router.get("/admin/calendar", authMiddleware, adminMiddleware, getCalendarOverview);
router.get("/admin/bookings", authMiddleware, adminMiddleware, listBookings);
router.patch("/admin/bookings/:id", authMiddleware, adminMiddleware, updateBooking);
router.get("/admin/availability-blocks", authMiddleware, adminMiddleware, listBlocks);
router.post("/admin/availability-blocks", authMiddleware, adminMiddleware, createBlock);
router.delete("/admin/availability-blocks/:id", authMiddleware, adminMiddleware, deleteBlock);
export default router;
