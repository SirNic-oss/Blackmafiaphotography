import "./globals.css";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import ShadersBackground from "@/components/background/ShadersBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ShadersBackground />

       <div className="relative z-10">
        <Navbar />
         {children}
         <Footer />
         </div>
      </body>
    </html>
  );
}
