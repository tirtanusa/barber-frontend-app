import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan navbar setelah scroll 100px (ubah sesuai kebutuhan)
      setShowNavbar(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Navbar - always visible on mobile, scroll-triggered on desktop */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {/* Mobile: always show */}
        <div className="md:hidden pointer-events-auto">
          <Navbar />
        </div>
        {/* Desktop: show on scroll */}
        <div
          className={`hidden md:block transition-all duration-300 ${showNavbar
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-full"
            }`}
        >
          <Navbar />
        </div>
      </div>

      <main style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
