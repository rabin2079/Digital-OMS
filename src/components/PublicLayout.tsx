import Header from "./Header";
import Footer from "./Footer";
import StickyMobileCta from "./StickyMobileCta";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pb-24 sm:pb-0">{children}</main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
