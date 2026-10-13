import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
