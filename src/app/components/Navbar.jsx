"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  RiMenuLine,
  RiCloseLine,
  RiHome4Line,
  RiTreeLine,
  RiStoreLine,
  RiHeartPulseLine,
  RiMapPin2Line,
} from "react-icons/ri";

const navLinks = [
  { label: "Beranda",       href: "/",               icon: <RiHome4Line /> },
  { label: "Green Edu",     href: "/greenedu",        icon: <RiTreeLine /> },
  { label: "UMKM",          href: "/umkm",            icon: <RiStoreLine /> },
  { label: "Cek Kesehatan", href: "/cek-kesehatan",   icon: <RiHeartPulseLine /> },
];

// Halaman yg gak perlu navbar publik
const HIDDEN_PATHS = ["/dashboard", "/login"];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu kalau pindah halaman
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Sembunyikan di dashboard & login
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  // Di homepage: transparent saat atas, putih saat scroll
  // Di halaman lain: selalu putih/solid
  const solid = !isHome || scrolled;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-lg font-black tracking-tight transition-colors ${
            solid ? "text-green-800" : "text-white"
          }`}
        >
          Desa Sengkol
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all ${
                    active
                      ? solid
                        ? "bg-green-100 text-green-700"
                        : "bg-white/20 text-white"
                      : solid
                      ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      : "text-white/80 hover:text-white hover:bg-white/15"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden text-2xl p-1 rounded-lg transition-colors ${
            solid ? "text-green-800 hover:bg-gray-100" : "text-white hover:bg-white/15"
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <ul className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
