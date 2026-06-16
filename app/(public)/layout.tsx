import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat, MobileCTADock } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Spacer so the mobile dock never covers footer content (blends with footer) */}
      <div aria-hidden className="h-20 bg-forest-950 lg:hidden" />
      <WhatsAppFloat message={WA.home} />
      <MobileCTADock message={WA.home} />
    </div>
  );
}
