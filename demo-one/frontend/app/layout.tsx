import "./globals.css";

import Navbar from "@/components/navigation/Navbar";
import SmokeBackground from "@/components/background/SmokeBackground";
import CartToast from "@/components/cart/CartToast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SmokeBackground />

       <div className="relative z-10">
        <Navbar />
         {children}
         <CartToast />
         </div>
      </body>
    </html>
  );
}
