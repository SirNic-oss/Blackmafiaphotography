"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Navbar />
        <main className="admin-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
