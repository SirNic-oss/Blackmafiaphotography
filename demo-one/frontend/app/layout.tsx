import "./globals.css";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SmokeBackground from "@/components/background/SmokeBackground";
import CartToast from "@/components/cart/CartToast";
import Toast from "@/components/ui/Toast";

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
         <Footer />
         <CartToast />
         <Toast />
         </div>
      </body>
    </html>
  );
}
