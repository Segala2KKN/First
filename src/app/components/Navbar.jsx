"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Beranda", href: "#hero" },
    { label: "Wisata", href: "#wisata" },
    { label: "Jelajahi", href: "#fitur" },
    { label: "Tentang", href: "#tentang" },
    { label: "Keunggulan", href: "#potensi" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="#hero" className={`text-xl font-bold tracking-tight ${scrolled ? "text-green-800" : "text-white"}`}>
          Desa Sengkol
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`text-sm font-medium hover:opacity-70 transition-opacity ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden text-2xl ${scrolled ? "text-green-800" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white px-6 pb-6 shadow-lg"
        >
          <ul className="flex flex-col gap-4 pt-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 font-medium block py-1 border-b border-gray-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}
