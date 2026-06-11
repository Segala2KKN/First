"use client";
import { useRef } from "react";
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
  RiExternalLinkLine,
  RiRecycleLine,
  RiRoadMapLine,
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
    deskripsi:
      "Pengalaman imersif kehidupan tradisional Suku Sasak. Temukan rumah adat berlantai tanah liat, kerajinan tenun ikat, dan keramahan warga lokal.",
    highlights: [
      "Rumah adat alang-alang",
      "Tenun ikat tradisional",
      "Interaksi budaya",
    ],
    mapsUrl: "https://maps.app.goo.gl/65GNgiUrd9oGfhb38",
    foto: "/images/sasak-ende.jpg",
    warna: "from-amber-800 to-amber-600",
  },
  {
    id: 2,
    nama: "Masjid Kuno Gunung Pujut",
    kategori: "Wisata Sejarah & Religi",
    deskripsi:
      "Peninggalan Kerajaan Pujut sejak abad ke-16. Berdiri megah di atas bukit 500 mdpl dengan pemandangan bentang alam Lombok Tengah yang memukau.",
    highlights: [
      "Cagar budaya abad ke-16",
      "Ketinggian 500 mdpl",
      "Panorama Lombok Tengah",
    ],
    mapsUrl: "https://maps.app.goo.gl/dms5m7Tyw7kMvJ2Q8",
    foto: "/images/masjid-pujut.jpg",
    warna: "from-green-900 to-green-700",
  },
];

// === Data Potensi Desa ===
const potensiData = [
  {
    icon: <RiGroupLine />,
    judul: "Budaya Sasak",
    deskripsi:
      "Tradisi dan kearifan lokal Suku Sasak yang masih terjaga kelestariannya hingga kini.",
  },
  {
    icon: <RiLeafLine />,
    judul: "Pertanian Kuat",
    deskripsi:
      "Mayoritas warga hidup dari sektor agraris. Lanskap persawahan yang hijau menjadi daya tarik tersendiri.",
  },
  {
    icon: <RiRecycleLine />,
    judul: "Desa Peduli Lingkungan",
    deskripsi:
      "Program pengolahan sampah menjadi pupuk kompos organik (POC & Bokashi) untuk pariwisata berkelanjutan.",
  },
  {
    icon: <RiRoadMapLine />,
    judul: "Akses Strategis",
    deskripsi:
      "Di jalur wisata menuju Pantai Kuta Mandalika (KEK Mandalika), sering menjadi titik singgah wisatawan.",
  },
];

// === Data Fitur Web ===
const fiturData = [
  {
    icon: <RiHeartPulseLine />,
    judul: "Cek Kesehatan",
    deskripsi:
      "Periksa tingkat urgensi kesehatanmu dan dapatkan rekomendasi ke fasilitas kesehatan.",
    href: "/kesehatan",
    warna: "bg-red-50 border-red-200 hover:bg-red-100",
    ikonWarna: "text-red-500",
  },
  {
    icon: <RiTreeLine />,
    judul: "Edukasi Pohon & Hutan",
    deskripsi:
      "Kenali jenis-jenis pohon dan ekosistem hutan yang ada di sekitar Desa Sengkol.",
    href: "/pohon",
    warna: "bg-green-50 border-green-200 hover:bg-green-100",
    ikonWarna: "text-green-600",
  },
  {
    icon: <RiStoreLine />,
    judul: "UMKM Desa",
    deskripsi:
      "Temukan produk-produk unggulan UMKM lokal dan dukung perekonomian warga desa.",
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
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background foto — ganti src kalau sudah ada foto */}
        <div className="absolute inset-0 bg-green-900">
          {/* Uncomment baris di bawah setelah foto tersedia: */}
          {/* <Image src="/images/hero-desa.jpg" alt="Desa Sengkol" fill className="object-cover opacity-50" /> */}

          {/* Placeholder gradient (hapus ini kalau sudah ada foto) */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-800 to-emerald-700" />
        </div>

        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Konten Hero */}
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
            Desa strategis penyangga KEK Mandalika — tempat budaya Sasak, alam
            asri, dan masyarakat berdaya berpadu dalam harmoni.
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
              href="https://maps.app.goo.gl/GZ2PpTiA3x9Yrwfk6"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 justify-center"
            >
              <RiMapPin2Line /> Lihat di Maps
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm flex flex-col items-center gap-1"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/40" />
        </motion.div>
      </section>

      {/* ===== 2. TENTANG DESA ===== */}
      <section id="tentang" className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Teks */}
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
                Desa Sengkol adalah salah satu desa penyangga utama Kawasan
                Ekonomi Khusus (KEK) Mandalika. Bentang alamnya bervariasi dari
                perbukitan hingga pesisir selatan, menjadikannya unik di antara
                desa-desa di Lombok Tengah.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Dengan budaya Sasak yang masih sangat kental dan masyarakat yang
                ramah, Sengkol menawarkan pengalaman otentik yang tak terlupakan
                bagi setiap pengunjung.
              </p>
            </FadeIn>

            {/* Stats / Fakta Desa */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    angka: "KEK",
                    label: "Penyangga Mandalika",
                    icon: <RiRoadMapLine />,
                  },
                  {
                    angka: "500m",
                    label: "Ketinggian Gunung Pujut",
                    icon: <RiLeafLine />,
                  },
                  {
                    angka: "Abad 16",
                    label: "Sejarah Masjid Kuno",
                    icon: <RiMapPin2Line />,
                  },
                  {
                    angka: "100%",
                    label: "Warga Ramah & Berdaya",
                    icon: <RiGroupLine />,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="text-green-600 text-2xl mb-3">
                      {item.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {item.angka}
                    </div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== 3. WISATA — dengan tombol Google Maps ===== */}
      <section id="wisata" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
              Destinasi Unggulan
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Wisata Desa Sengkol
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {wisataData.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white flex flex-col"
                >
                  {/* Foto placeholder — ganti dengan Image setelah foto ada */}
                  <div
                    className={`h-52 bg-gradient-to-br ${item.warna} relative flex items-end p-6`}
                  >
                    {/* Uncomment setelah foto ada: */}
                    {/* <Image src={item.foto} alt={item.nama} fill className="object-cover" /> */}
                    <span className="relative z-10 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {item.kategori}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.nama}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {item.deskripsi}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Tombol Google Maps */}
                    <a
                      href={item.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
                    >
                      <RiMapPin2Line className="text-lg" />
                      Buka di Google Maps
                      <RiExternalLinkLine />
                    </a>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. POTENSI DESA ===== */}
      <section id="potensi" className="py-24 px-6 bg-green-950 text-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-green-400 font-semibold uppercase tracking-widest text-sm mb-3">
              Keunggulan
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Potensi Desa Sengkol
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {potensiData.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    y: -6,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-colors cursor-default"
                >
                  <div className="text-4xl text-green-400 mb-4 flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.judul}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. FITUR WEB ===== */}
      <section id="fitur" className="py-24 px-6 bg-stone-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header kiri-rata, bold, editorial */}
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

          {/* List style — inspired by basestructures.com */}
          <div className="divide-y divide-gray-200">
            {fiturData.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.a
                  href={item.href}
                  className="group flex items-center justify-between py-8 md:py-10 cursor-pointer"
                  whileHover="hover"
                >
                  {/* Kiri: nomor + ikon + judul + deskripsi */}
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="text-xs font-mono text-gray-300 group-hover:text-gray-400 transition-colors w-6 shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xl ${item.ikonWarna}`}>
                          {item.icon}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                          {item.judul}
                        </h3>
                      </div>
                      <p className="text-gray-500 text-sm md:text-base max-w-md hidden md:block">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Kanan: lingkaran arrow */}
                  <motion.div
                    variants={{ hover: { x: 6 } }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${item.ikonWarna} border-current opacity-50 group-hover:opacity-100 transition-opacity`}
                  >
                    <RiArrowRightLine className="text-lg" />
                  </motion.div>
                </motion.a>

                {/* Deskripsi mobile */}
                <p className="text-gray-500 text-sm pb-6 pl-12 md:hidden">
                  {item.deskripsi}
                </p>
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
              <h3 className="text-white font-bold text-lg mb-3">
                Desa Sengkol
              </h3>
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
                {[
                  "Beranda",
                  "Wisata",
                  "Kesehatan",
                  "Pohon & Hutan",
                  "UMKM",
                ].map((n) => (
                  <li key={n}>
                    <a href="#" className="hover:text-white transition-colors">
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">KKN</h3>
              <p className="text-sm leading-relaxed">
                Website ini dibuat sebagai bagian dari program Kuliah Kerja
                Nyata (KKN) untuk mendukung digitalisasi Desa Sengkol.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            © 2025 Desa Sengkol · Dibuat dengan ❤️ oleh Tim KKN PPM UGM Mahitala
            Mandalika
          </div>
        </div>
      </footer>
    </main>
  );
}
