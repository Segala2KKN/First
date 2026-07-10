"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Navbar from "./components/Navbar";
import {
  RiMapPin2Line,
  RiLeafLine,
  RiGroupLine,
  RiHeartPulseLine,
  RiStoreLine,
  RiTreeLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiExternalLinkLine,
  RiRecycleLine,
  RiRoadMapLine,
  RiStarFill,
  RiTimeLine,
} from "react-icons/ri";

// === Helper: animasi section saat muncul di layar ===
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// === Data Wisata ===
const wisataData = [
  {
    id: 1,
    nama: "Desa Wisata Sasak Ende",
    kategori: "Wisata Budaya",
    rating: "4.7",
    tipe: "Penginapan",
    jam: "Buka · Tutup 20.00",
    deskripsi:
      "Berlokasi strategis di jalur pariwisata, menjadi titik utama bagi wisatawan untuk mengamati rumah adat tradisional serta melihat langsung keahlian kaum wanita menenun kain tenun ikat.",
    mapsUrl: "https://maps.app.goo.gl/ytx9YVuJXXBnXks57",
    foto: "/images/sasak-ende.jpg",
    warna: "from-amber-800 to-amber-500",
  },
  {
    id: 2,
    nama: "Pantai Bloam Gerupuk",
    kategori: "Wisata Pantai",
    rating: "5.0",
    tipe: "Tujuan Wisata",
    jam: "Buka 24 Jam",
    deskripsi:
      "Perairan pesisir eksotis dengan kontur tebing dan perbukitan yang mempesona. Sangat populer bagi peselancar pemula hingga profesional yang ingin menikmati gulungan ombak.",
    mapsUrl: "https://maps.app.goo.gl/SK7mPZDFqL4BKnpo8",
    foto: "/images/gerupuk.jpg",
    warna: "from-blue-700 to-cyan-400",
  },
  {
    id: 3,
    nama: "Pantai Tanjung Aan",
    kategori: "Wisata Pantai",
    rating: "4.5",
    tipe: "Pantai",
    jam: "Buka 24 Jam",
    deskripsi:
      "Pantai legendaris dengan garis pantai melengkung, pasir unik seperti butiran merica, dan perairan pirus yang jernih. Cocok untuk berenang santai atau menyewa perahu kayu.",
    mapsUrl: "https://maps.app.goo.gl/aDEqivLHR42KKYEv6",
    foto: "/images/tanjung-aan.jpg",
    warna: "from-cyan-600 to-teal-400",
  },
  {
    id: 4,
    nama: "Bukit Merese",
    kategori: "Wisata Alam",
    rating: "4.7",
    tipe: "Tujuan Wisata",
    jam: "Buka 24 Jam",
    deskripsi:
      "Spot ikonik yang menghadirkan kontras indah antara padang rumput hijau dan birunya Samudra Hindia. Favorit wisatawan untuk menikmati momen sunset dari ketinggian.",
    mapsUrl: "https://maps.app.goo.gl/HnLdxQDQqreXHMzS8",
    foto: "/images/bukit-merese.jpg",
    warna: "from-green-700 to-emerald-400",
  },
  {
    id: 5,
    nama: "Masjid Kuno Gunung Pujut",
    kategori: "Wisata Sejarah & Religi",
    rating: "4.5",
    tipe: "Museum",
    jam: "Buka · Tutup 06.00 (Minggu)",
    deskripsi:
      "Situs cagar budaya peninggalan Kerajaan Pujut sejak abad ke-16. Berdiri di perbukitan 500 mdpl dengan panorama lanskap hijau Lombok Tengah yang memukau.",
    mapsUrl: "https://maps.app.goo.gl/fRZkB88kkXmfgBss5",
    foto: "/images/masjid-pujut.jpg",
    warna: "from-green-900 to-green-600",
  },
  {
    id: 6,
    nama: "Goa Kotak Lombok",
    kategori: "Wisata Petualangan",
    rating: "4.6",
    tipe: "Tujuan Wisata",
    jam: "Buka 07.00 – 18.00 WITA",
    deskripsi:
      "Lorong berbentuk kotak unik di perbukitan Jalan Pantai Mawi. Dari mulut goa terlihat panorama Pantai Batu Payung, Tanjung Aan, dan Bukit Merese. Populer untuk trekking ringan.",
    mapsUrl: "https://maps.app.goo.gl/e3ZknoMukiWaRtzK7",
    foto: "/images/goa-kotak.jpg",
    warna: "from-stone-700 to-amber-700",
  },
];

// === Card tunggal untuk carousel ===
function WisataCardItem({ item }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl bg-white flex flex-col">
      <div
        className={`h-44 bg-gradient-to-br ${item.warna} relative flex items-end p-4`}
      >
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
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
          {item.nama}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <RiTimeLine className="text-green-500 text-xs" />
          <span className="text-xs text-green-600 font-medium">{item.jam}</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {item.deskripsi}
        </p>
        <a
          href={item.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
        >
          <RiMapPin2Line />
          Buka di Google Maps
          <RiExternalLinkLine />
        </a>
      </div>
    </div>
  );
}

// === Komponen Carousel 3D ===
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
      if (diff === 0)
        return { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 };
      if (abs === 1)
        return { x: diff * 260, scale: 0.82, opacity: 0.45, filter: "blur(4px)", zIndex: 10 };
      return { x: diff * 500, scale: 0.65, opacity: 0, filter: "blur(8px)", zIndex: 0 };
    } else {
      const CARD = 420;
      const GAP = 24;
      if (diff === 0)
        return { x: -(CARD / 2 + GAP / 2), scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 };
      if (diff === 1)
        return { x: CARD / 2 + GAP / 2, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 };
      if (diff === -1)
        return { x: -(CARD + CARD / 2 + GAP * 2), scale: 0.85, opacity: 0.45, filter: "blur(4px)", zIndex: 10 };
      if (diff === 2)
        return { x: CARD + CARD / 2 + GAP * 2, scale: 0.85, opacity: 0.45, filter: "blur(4px)", zIndex: 10 };
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

      <button
        onClick={prev}
        className="absolute left-3 top-[130px] z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={glassStyle}
      >
        <RiArrowLeftLine className="text-gray-700 text-lg" />
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-[130px] z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={glassStyle}
      >
        <RiArrowRightLine className="text-gray-700 text-lg" />
      </button>

      <div className="flex justify-center gap-2 pt-2 relative z-20">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(isMobile ? i : i * 2)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentPage ? "w-6 bg-green-600" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// === Data Potensi Desa ===
const potensiData = [
  {
    icon: <RiGroupLine />,
    judul: "Budaya Sasak",
    deskripsi: "Tradisi dan kearifan lokal Suku Sasak yang masih terjaga kelestariannya hingga kini.",
  },
  {
    icon: <RiLeafLine />,
    judul: "Pertanian Kuat",
    deskripsi: "Mayoritas warga hidup dari sektor agraris. Lanskap persawahan yang hijau menjadi daya tarik tersendiri.",
  },
  {
    icon: <RiRecycleLine />,
    judul: "Desa Peduli Lingkungan",
    deskripsi: "Program pengolahan sampah menjadi pupuk kompos organik (POC & Bokashi) untuk pariwisata berkelanjutan.",
  },
  {
    icon: <RiRoadMapLine />,
    judul: "Akses Strategis",
    deskripsi: "Di jalur wisata menuju Pantai Kuta Mandalika (KEK Mandalika), sering menjadi titik singgah wisatawan.",
  },
];

// === Data Fitur Web ===
const fiturData = [
  {
    icon: <RiHeartPulseLine />,
    judul: "Cek Kesehatan",
    deskripsi: "Periksa tingkat urgensi kesehatanmu dan dapatkan rekomendasi ke fasilitas kesehatan.",
    href: "/cek-kesehatan",
    warna: "bg-red-50 border-red-200 hover:bg-red-100",
    ikonWarna: "text-red-500",
  },
  {
    icon: <RiTreeLine />,
    judul: "Edukasi Pohon & Hutan",
    deskripsi: "Kenali jenis-jenis pohon dan ekosistem hutan yang ada di sekitar Desa Sengkol.",
    href: "/greenedu",
    warna: "bg-green-50 border-green-200 hover:bg-green-100",
    ikonWarna: "text-green-600",
  },
  {
    icon: <RiStoreLine />,
    judul: "UMKM Desa",
    deskripsi: "Temukan produk-produk unggulan UMKM lokal dan dukung perekonomian warga desa.",
    href: "/umkm",
    warna: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    ikonWarna: "text-amber-600",
  },
];

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* ===== 1. HERO ===== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-green-900">
          <Image
            src="/images/ProfileSengkol.JPG"
            alt="Desa Sengkol"
            fill
            className="object-cover opacity-60 hidden md:block"
            style={{ objectPosition: "50% 40%" }}
            priority
          />
          <Image
            src="/images/ProfileSengkol.JPG"
            alt="Desa Sengkol"
            fill
            className="object-cover opacity-60 block md:hidden"
            style={{ objectPosition: "90% 50%" }}
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base uppercase tracking-widest mb-4 text-green-200 font-medium"
          >
            Kecamatan Pujut · Lombok Tengah · NTB
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            Selamat Datang
            <br />
            <span className="text-green-300">di Sengkol</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Desa strategis penyangga KEK Mandalika — tempat budaya Sasak, alam asri, dan masyarakat berdaya berpadu dalam harmoni.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#wisata"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 justify-center"
            >
              Jelajahi Desa <RiArrowRightLine />
            </a>
            <a
              href="https://maps.app.goo.gl/JFU19roZUsfQWjwW9"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 justify-center"
            >
              <RiMapPin2Line /> Lihat di Maps
            </a>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm flex flex-col items-center gap-1"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/40" />
        </motion.div>
      </section>

      {/* ===== 2. WISATA — Carousel ===== */}
      <section id="wisata" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
              Destinasi Unggulan
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Wisata Desa Sengkol
            </h2>
            <p className="text-gray-500 mt-3 text-sm">Geser untuk melihat semua destinasi</p>
          </FadeIn>
        </div>
        <div className="max-w-6xl mx-auto">
          <WisataCarousel data={wisataData} />
        </div>
      </section>

      {/* ===== 3. FITUR WEB ===== */}
      <section id="fitur" className="py-24 px-6 bg-stone-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-20">
            <p className="text-green-600 font-semibold uppercase tracking-widest text-xs mb-4">
              Layanan Digital
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-none">
              Explore
              <br />
              <span className="text-gray-300">Sengkol.</span>
            </h2>
          </FadeIn>

          <div className="divide-y divide-gray-200">
            {fiturData.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.a
                  href={item.href}
                  className="group flex items-center justify-between py-8 md:py-10 cursor-pointer"
                  whileHover="hover"
                >
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="text-xs font-mono text-gray-300 group-hover:text-gray-400 transition-colors w-6 shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xl ${item.ikonWarna}`}>{item.icon}</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                          {item.judul}
                        </h3>
                      </div>
                      <p className="text-gray-500 text-sm md:text-base max-w-md hidden md:block">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    variants={{ hover: { x: 6 } }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${item.ikonWarna} border-current opacity-50 group-hover:opacity-100 transition-opacity`}
                  >
                    <RiArrowRightLine className="text-lg" />
                  </motion.div>
                </motion.a>
                <p className="text-gray-500 text-sm pb-6 pl-12 md:hidden">{item.deskripsi}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. TENTANG DESA ===== */}
      <section id="tentang" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-4">
                Tentang Desa
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Desa yang
                <br />
                <span className="text-green-700">Strategis & Menawan</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Desa Sengkol adalah salah satu desa penyangga utama Kawasan Ekonomi Khusus (KEK) Mandalika.
                Bentang alamnya bervariasi dari perbukitan hingga pesisir selatan, menjadikannya unik di antara
                desa-desa di Lombok Tengah.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Dengan budaya Sasak yang masih sangat kental dan masyarakat yang ramah, Sengkol menawarkan
                pengalaman otentik yang tak terlupakan bagi setiap pengunjung.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { angka: "KEK", label: "Penyangga Mandalika", icon: <RiRoadMapLine /> },
                  { angka: "500m", label: "Ketinggian Gunung Pujut", icon: <RiLeafLine /> },
                  { angka: "Abad 16", label: "Sejarah Masjid Kuno", icon: <RiMapPin2Line /> },
                  { angka: "100%", label: "Warga Ramah & Berdaya", icon: <RiGroupLine /> },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="bg-stone-50 rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="text-green-600 text-2xl mb-3">{item.icon}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{item.angka}</div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== 5. KEUNGGULAN / POTENSI DESA ===== */}
      <section id="potensi" className="py-24 px-6 bg-green-950 text-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-green-400 font-semibold uppercase tracking-widest text-sm mb-3">
              Keunggulan
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Potensi Desa Sengkol</h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {potensiData.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-colors cursor-default"
                >
                  <div className="text-4xl text-green-400 mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.judul}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.deskripsi}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">Desa Sengkol</h3>
              <p className="text-sm leading-relaxed">
                Jl. Raya Sengkol, Kecamatan Pujut,
                <br />
                Kabupaten Lombok Tengah,
                <br />
                Nusa Tenggara Barat · 83573
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Navigasi</h3>
              <ul className="space-y-2 text-sm">
                {["Beranda", "Wisata", "Kesehatan", "Pohon & Hutan", "UMKM"].map((n) => (
                  <li key={n}>
                    <a href="#" className="hover:text-white transition-colors">{n}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">KKN</h3>
              <p className="text-sm leading-relaxed">
                Website ini dibuat sebagai bagian dari program Kuliah Kerja Nyata (KKN) untuk mendukung
                digitalisasi Desa Sengkol.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            © 2025 Desa Sengkol · Dibuat dengan oleh Tim KKN PPM UGM Mahitala Mandalika
          </div>
        </div>
      </footer>
    </main>
  );
}
