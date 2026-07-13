"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiExternalLinkLine,
  RiStarFill,
  RiTimeLine,
  RiMapPin2Line,
  RiCheckLine,
} from "react-icons/ri";

// ─── Fade-in helper ───────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Teal label ───────────────────────────────────────────────
function Label({ children }) {
  return (
    <p className="text-cyan-600 font-bold uppercase tracking-widest text-xs mb-3">
      {children}
    </p>
  );
}

// ─── Data wisata ──────────────────────────────────────────────
const wisataFallback = [
  { id: 1, nama: "Desa Wisata Sasak Ende", kategori: "Wisata Budaya", rating: "4.7", tipe: "Penginapan", jam: "Buka · Tutup 20.00", deskripsi: "Berlokasi strategis di jalur pariwisata, menjadi titik utama bagi wisatawan untuk mengamati rumah adat tradisional serta melihat langsung keahlian kaum wanita menenun kain tenun ikat.", mapsUrl: "https://maps.app.goo.gl/ytx9YVuJXXBnXks57", warna: "from-amber-800 to-amber-500" },
  { id: 2, nama: "Pantai Bloam Gerupuk", kategori: "Wisata Pantai", rating: "5.0", tipe: "Tujuan Wisata", jam: "Buka 24 Jam", deskripsi: "Perairan pesisir eksotis dengan kontur tebing dan perbukitan yang mempesona. Sangat populer bagi peselancar pemula hingga profesional yang ingin menikmati gulungan ombak.", mapsUrl: "https://maps.app.goo.gl/SK7mPZDFqL4BKnpo8", warna: "from-blue-700 to-cyan-400" },
  { id: 3, nama: "Pantai Tanjung Aan", kategori: "Wisata Pantai", rating: "4.5", tipe: "Pantai", jam: "Buka 24 Jam", deskripsi: "Pantai legendaris dengan garis pantai melengkung, pasir unik seperti butiran merica, dan perairan pirus yang jernih. Cocok untuk berenang santai atau menyewa perahu kayu.", mapsUrl: "https://maps.app.goo.gl/aDEqivLHR42KKYEv6", warna: "from-cyan-600 to-teal-400" },
  { id: 4, nama: "Bukit Merese", kategori: "Wisata Alam", rating: "4.7", tipe: "Tujuan Wisata", jam: "Buka 24 Jam", deskripsi: "Spot ikonik yang menghadirkan kontras indah antara padang rumput hijau dan birunya Samudra Hindia. Favorit wisatawan untuk menikmati momen sunset dari ketinggian.", mapsUrl: "https://maps.app.goo.gl/HnLdxQDQqreXHMzS8", warna: "from-green-700 to-emerald-400" },
  { id: 5, nama: "Masjid Kuno Gunung Pujut", kategori: "Wisata Sejarah & Religi", rating: "4.5", tipe: "Museum", jam: "Buka · Tutup 06.00 (Minggu)", deskripsi: "Situs cagar budaya peninggalan Kerajaan Pujut sejak abad ke-16. Berdiri di perbukitan 500 mdpl dengan panorama lanskap hijau Lombok Tengah yang memukau.", mapsUrl: "https://maps.app.goo.gl/fRZkB88kkXmfgBss5", warna: "from-green-900 to-green-600" },
  { id: 6, nama: "Goa Kotak Lombok", kategori: "Wisata Petualangan", rating: "4.6", tipe: "Tujuan Wisata", jam: "Buka 07.00 – 18.00 WITA", deskripsi: "Lorong berbentuk kotak unik di perbukitan Jalan Pantai Mawi. Dari mulut goa terlihat panorama Pantai Batu Payung, Tanjung Aan, dan Bukit Merese. Populer untuk trekking ringan.", mapsUrl: "https://maps.app.goo.gl/e3ZknoMukiWaRtzK7", warna: "from-stone-700 to-amber-700" },
];

function mapWisata(row) {
  return { id: row.id, nama: row.nama, kategori: row.kategori, rating: row.rating, tipe: row.tipe, jam: row.jam, deskripsi: row.deskripsi, mapsUrl: row.maps_url, warna: row.warna, foto_url: row.foto_url };
}

// ─── Wisata Card ──────────────────────────────────────────────
function WisataCardItem({ item }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl bg-white flex flex-col">
      <div className={`h-44 bg-gradient-to-br ${item.warna} relative flex items-end p-4`}>
        {item.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.foto_url} alt={item.nama} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <span className="relative z-10 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          {item.kategori}
        </span>
      </div>
      <div className="p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <RiStarFill className="text-yellow-400 text-sm" />
          <span className="text-sm font-bold text-gray-800">{item.rating}</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">{item.tipe}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{item.nama}</h3>
        <div className="flex items-center gap-1 mb-2">
          <RiTimeLine className="text-cyan-500 text-xs" />
          <span className="text-xs text-cyan-600 font-medium">{item.jam}</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.deskripsi}</p>
        <a
          href={item.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
        >
          <RiMapPin2Line /> Buka di Google Maps <RiExternalLinkLine />
        </a>
      </div>
    </div>
  );
}

// ─── Wisata Carousel ─────────────────────────────────────────
function WisataCarousel({ data }) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const n = data.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const step = isMobile ? 1 : 2;
  const prev = () => setCurrent((c) => (c - step + n) % n);
  const next = () => setCurrent((c) => (c + step) % n);

  const getDiff = (index) => {
    let d = index - current;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  const getAnimate = (index) => {
    const diff = getDiff(index);
    const abs = Math.abs(diff);
    if (isMobile) {
      if (diff === 0) return { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 };
      if (abs === 1) return { x: diff * 260, scale: 0.82, opacity: 0.45, filter: "blur(4px)", zIndex: 10 };
      return { x: diff * 500, scale: 0.65, opacity: 0, filter: "blur(8px)", zIndex: 0 };
    } else {
      const CARD = 420, GAP = 24;
      if (diff === 0) return { x: -(CARD / 2 + GAP / 2), scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 };
      if (diff === 1) return { x: CARD / 2 + GAP / 2, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 };
      if (diff === -1) return { x: -(CARD + CARD / 2 + GAP * 2), scale: 0.85, opacity: 0.45, filter: "blur(4px)", zIndex: 10 };
      if (diff === 2) return { x: CARD + CARD / 2 + GAP * 2, scale: 0.85, opacity: 0.45, filter: "blur(4px)", zIndex: 10 };
      return { x: diff * CARD * 2, scale: 0.6, opacity: 0, filter: "blur(8px)", zIndex: 0 };
    }
  };

  const cardWidth = isMobile ? "min(280px, 78vw)" : "420px";
  const containerH = isMobile ? 540 : 520;
  const totalPages = isMobile ? n : Math.ceil(n / 2);
  const currentPage = isMobile ? current : Math.floor(current / 2);

  const glassStyle = {
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(24px) saturate(200%)",
    WebkitBackdropFilter: "blur(24px) saturate(200%)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  return (
    <div className="relative select-none">
      <div style={{ overflowX: "clip" }}>
        <div className="relative flex items-start justify-center" style={{ height: containerH }}>
          {data.map((item, i) => {
            const anim = getAnimate(i);
            return (
              <motion.div
                key={item.id}
                className="absolute top-4"
                style={{ width: cardWidth, zIndex: anim.zIndex }}
                animate={{ x: anim.x, scale: anim.scale, opacity: anim.opacity, filter: anim.filter }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
              >
                <WisataCardItem item={item} />
              </motion.div>
            );
          })}
        </div>
      </div>
      <button onClick={prev} className="absolute left-3 top-[130px] z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95" style={glassStyle}>
        <RiArrowLeftLine className="text-gray-700 text-lg" />
      </button>
      <button onClick={next} className="absolute right-3 top-[130px] z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95" style={glassStyle}>
        <RiArrowRightLine className="text-gray-700 text-lg" />
      </button>
      <div className="flex justify-center gap-2 pt-2 relative z-20">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setCurrent(isMobile ? i : i * 2)}
            className={`h-2 rounded-full transition-all duration-300 ${i === currentPage ? "w-6 bg-cyan-600" : "w-2 bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Konten layanan & keunikan ────────────────────────────────
const layananData = [
  { num: "01", judul: "Cek Kesehatan Anak", deskripsi: "Pantau tumbuh kembang anak dengan tools cek gizi berbasis standar WHO secara mudah dan cepat.", href: "/cek-kesehatan" },
  { num: "02", judul: "Edukasi Pohon & Lingkungan", deskripsi: "Kenali jenis-jenis pohon dan ekosistem hutan yang ada di sekitar Desa Sengkol melalui modul interaktif.", href: "/greenedu" },
  { num: "03", judul: "UMKM Desa Sengkol", deskripsi: "Temukan produk unggulan UMKM lokal — tenun ikat, olahan kelor, kuliner khas Lombok — langsung dari pengusaha desa.", href: "/umkm" },
];

const keunikanData = [
  { judul: "Budaya Sasak Autentik", deskripsi: "Tradisi dan kearifan lokal Suku Sasak yang masih terjaga kelestariannya hingga kini." },
  { judul: "Pertanian yang Kuat", deskripsi: "Mayoritas warga hidup dari sektor agraris. Lanskap persawahan hijau menjadi daya tarik tersendiri." },
  { judul: "Produk Lokal Berkualitas", deskripsi: "Menawarkan produk kerajinan tenun dan makanan berbahan alami yang bernilai tinggi." },
  { judul: "Komunitas Sehat", deskripsi: "Fokus pada kesehatan masyarakat, terutama pemantauan gizi anak dan pencegahan stunting." },
];

const testimonialData = [
  { isi: "Desa Sengkol menawarkan pengalaman yang tak terlupakan dengan budaya dan keindahan alamnya. Kami sangat terkesan dengan keramahan penduduknya.", nama: "Rudi Santoso" },
  { isi: "Kami menemukan kain tenun yang indah dan makanan lezat di Desa Sengkol. Sangat direkomendasikan bagi siapa saja yang mencintai budaya.", nama: "Andi Prasetyo" },
  { isi: "Kunjungan ke Desa Sengkol adalah pengalaman yang mengubah hidup. Budaya dan tradisi yang kaya membuat saya ingin kembali lagi.", nama: "Dina Sari" },
];

// ─── Main Page ────────────────────────────────────────────────
export default function Home() {
  const [wisataData, setWisataData] = useState(wisataFallback);

  useEffect(() => {
    supabase
      .from("wisata")
      .select("*")
      .order("urutan", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setWisataData(data.map(mapWisata));
      });
  }, []);

  return (
    <main className="bg-white text-gray-900">

      {/* ══════════════════════════════════════════════
          HERO — bg foto + split layout
      ══════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ProfileSengkol.JPG"
          alt="Desa Sengkol"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 40%" }}
        />
        <div className="absolute inset-0 bg-slate-900/65" />

        {/* Konten */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-28 md:py-0 grid md:grid-cols-2 gap-12 items-center">
          {/* Kiri — teks */}
          <div className="text-white">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-5"
            >
              Selamat Datang
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Temukan Keindahan Budaya Desa Sengkol
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300 text-base md:text-lg max-w-md leading-relaxed mb-10"
            >
              Jelajahi keindahan alam dan budaya Lombok yang kaya, dari tenun ikat Sasak hingga pantai eksotis di ujung selatan pulau.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="#wisata"
                className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-4 rounded-full transition-colors uppercase tracking-wide text-sm"
              >
                Lihat Selengkapnya
              </a>
            </motion.div>
          </div>

          {/* Kanan — floating card gambar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-sm ml-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-card.jpg"
                alt="Keindahan Desa Sengkol"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add("bg-gradient-to-br", "from-cyan-700", "to-teal-500");
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-7 bg-white/30" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          LAYANAN — numbered cards
      ══════════════════════════════════════════════ */}
      <section id="fitur" className="py-24 px-6 bg-sky-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <Label>Layanan Kami</Label>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto">
              Berbagai Layanan Dan Fitur Desa Sengkol
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {layananData.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                  <p className="text-cyan-600 font-bold text-lg mb-4">{item.num}.</p>
                  <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">{item.judul}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.deskripsi}</p>
                  <Link
                    href={item.href}
                    className="mt-6 text-cyan-600 font-bold text-sm hover:text-cyan-700 transition-colors inline-flex items-center gap-1"
                  >
                    Baca Selengkapnya <RiArrowRightLine />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TENTANG — split layout + full image
      ══════════════════════════════════════════════ */}
      <section id="tentang" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Split teks */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-14">
            <FadeIn>
              <Label>Tentang Kami</Label>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Kisah Di Balik Budaya Dan Kerajinan Desa Sengkol
              </h2>
            </FadeIn>
            <FadeIn delay={0.15} className="flex flex-col justify-center gap-5 pt-2 md:pt-12">
              <p className="text-gray-600 leading-relaxed">
                Desa Sengkol adalah tempat yang kaya akan budaya Sasak, serta kerajinan tenun yang unik. Kami berkomitmen untuk mempromosikan warisan lokal dan mendukung pengembangan ekonomi masyarakat.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami adalah desa yang berfokus pada tradisi, keberlanjutan, dan kesejahteraan warga — menjadi penyangga utama KEK Mandalika di Lombok Tengah.
              </p>
              <div>
                <a
                  href="https://maps.app.goo.gl/JFU19roZUsfQWjwW9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-7 py-3.5 rounded-full transition-colors uppercase tracking-wide text-sm"
                >
                  Lihat di Maps
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Full-width rounded image */}
          <FadeIn>
            <div className="rounded-3xl overflow-hidden h-72 md:h-96 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ProfileSengkol.JPG"
                alt="Desa Sengkol"
                className="w-full h-full object-cover"
                style={{ objectPosition: "50% 60%" }}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WISATA — carousel tetap
      ══════════════════════════════════════════════ */}
      <section id="wisata" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <Label>Destinasi Unggulan</Label>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900">
              Wisata Desa Sengkol
            </h2>
            <p className="text-gray-400 mt-3 text-sm">Geser untuk melihat semua destinasi</p>
          </FadeIn>
        </div>
        <div className="max-w-6xl mx-auto">
          <WisataCarousel data={wisataData} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          KEUNIKAN — nilai desa dengan checkmark
      ══════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-sky-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <Label>Nilai Kami</Label>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900">
              Keunikan Desa Sengkol
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {keunikanData.map((item, i) => (
                  <div key={i}>
                    <RiCheckLine className="text-cyan-600 text-xl mb-3" />
                    <h3 className="font-playfair text-lg font-bold text-gray-900 mb-2">{item.judul}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIAL
      ══════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <Label>Kata Mereka</Label>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900">
              Apa Kata Pengunjung Tentang Desa Sengkol
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonialData.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-full flex flex-col">
                  <p className="text-cyan-600 text-4xl font-bold leading-none mb-4">"</p>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">{t.isi}</p>
                  <p className="text-gray-400 text-sm mt-6">{t.nama}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ProfileSengkol.JPG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 70%" }}
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Ayo Bergabung Bersama Kami</h2>
            <p className="text-gray-300 text-sm">Rasakan pengalaman unik dan dukung komunitas lokal Desa Sengkol.</p>
          </div>
          <a
            href="https://maps.app.goo.gl/JFU19roZUsfQWjwW9"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-4 rounded-full transition-colors uppercase tracking-wide text-sm"
          >
            Lihat Selengkapnya
          </a>
        </div>
      </section>

    </main>
  );
}
