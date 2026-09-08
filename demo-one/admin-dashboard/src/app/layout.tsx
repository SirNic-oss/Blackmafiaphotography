import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Black-Mafia Admin",
  description: "Admin dashboard for Black-Mafia store management",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
