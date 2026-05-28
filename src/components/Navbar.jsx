import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Service", href: "#service" },
  { label: "Our Work", href: "#our-works" },
  { label: "The Artist", href: "#the-artist" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center h-16 px-4 bg-neutral" ref={menuRef}>
        <div>
          <h1 className="font-bebasNeue text-3xl text-white">B a r b e r . i d</h1>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-inter text-sm text-white hover:text-secondary transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/booking"
            className="bg-white text-tertiary px-4 py-2 rounded-sm font-inter text-sm hover:bg-secondary hover:text-neutral transition-colors duration-200 cursor-pointer"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-neutral ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col px-4 pb-4 pt-2 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-inter text-sm text-white py-3 px-2 hover:bg-white/10 rounded transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-white/20 mt-2 pt-3">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="block text-center bg-white text-tertiary px-4 py-2.5 rounded-sm font-inter text-sm font-medium hover:bg-secondary hover:text-neutral transition-colors duration-200 cursor-pointer"
            >
              BOOK NOW
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
