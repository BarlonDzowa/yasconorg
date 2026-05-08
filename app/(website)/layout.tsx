import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/NavBar";
import ScrollToTop from "@/components/ScrollToTop";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
  
      <ScrollToTop />
      <Footer />
    </>
  );
}
