"use client";

import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button type="button" className="icon-btn" aria-label="Notifications">
      <Bell size={18} />
      <span className="notification-dot" />
    </button>
  );
}
