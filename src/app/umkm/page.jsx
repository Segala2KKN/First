"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  RiStoreLine,
  RiArrowLeftLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCloseLine,
  RiSearchLine,
  RiFilterLine,
} from "react-icons/ri";

// ===== FALLBACK DATA (kalau Supabase belum diisi) =====
const umkmFallback = [
  {
    id: "1",
    nama_usaha: "Tenun Ikat Sengkol",
    pemilik: "Ibu Fatimah",
    kategori: "Kerajinan",
    produk: "Kain tenun ikat motif Sasak, sarung, selendang",
    deskripsi:
      "Usaha tenun ikat tradisional yang telah diwariskan turun-temurun. Menggunakan teknik pewarnaan alami dari tumbuhan sekitar desa.",
    foto_url: null,
    kontak: "0812-3456-7890",
    alamat: "Dusun Sengkol Utara",
  },
  {
    id: "2",
    nama_usaha: "Olahan Kelor Sengkol",
    pemilik: "Kelompok Ibu PKK",
    kategori: "Kuliner",
    produk: "Keripik kelor, tepung kelor, teh kelor",
    deskripsi:
      "Produk olahan daun kelor bernilai gizi tinggi untuk mendukung program penanggulangan stunting di Desa Sengkol.",
    foto_url: null,
    kontak: "0813-5678-9012",
    alamat: "Balai Desa Sengkol",
  },
  {
    id: "3",
    nama_usaha: "Warung Makan Bu Sari",
    pemilik: "Ibu Sari",
    kategori: "Kuliner",
    produk: "Plecing kangkung, ayam taliwang, nasi balap puyung",
    deskripsi:
      "Warung makan yang menyajikan masakan khas Lombok dengan cita rasa autentik dan bahan-bahan segar dari petani lokal desa.",
    foto_url: null,
    kontak: "0857-1234-5678",
    alamat: "Jl. Raya Sengkol No. 12",
  },
];

const KATEGORI_WARNA = {
  Kuliner: "bg-orange-100 text-orange-700",
  Kerajinan: "bg-purple-100 text-purple-700",
  Jasa: "bg-blue-100 text-blue-700",
  Pertanian: "bg-green-100 text-green-700",
  Perdagangan: "bg-amber-100 text-amber-700",
  default: "bg-gray-100 text-gray-700",
};

const KATEGORI_GRADIENT = {
  Kuliner: "from-orange-500 to-amber-400",
  Kerajinan: "from-purple-600 to-pink-400",
  Jasa: "from-blue-600 to-cyan-400",
  Pertanian: "from-green-600 to-emerald-400",
  Perdagangan: "from-amber-600 to-yellow-400",
  default: "from-gray-500 to-gray-400",
};

function badgeKelas(kategori) {
  return KATEGORI_WARNA[kategori] || KATEGORI_WARNA.default;
}
function gradientKelas(kategori) {
  return KATEGORI_GRADIENT[kategori] || KATEGORI_GRADIENT.default;
}

// ===== MODAL DETAIL UMKM =====
function UmkmModal({ umkm, onClose }) {
  if (!umkm) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 22 }}
          className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Foto / Gradient header */}
          <div className={`relative h-48 bg-gradient-to-br ${gradientKelas(umkm.kategori)} flex items-end p-5`}>
            {umkm.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={umkm.foto_url} alt={umkm.nama_usaha} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <RiStoreLine className="absolute inset-0 m-auto text-white/20 text-9xl" />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            >
              <RiCloseLine className="text-xl" />
            </button>
            <span className={`relative z-10 text-xs font-bold px-3 py-1.5 rounded-full ${badgeKelas(umkm.kategori)}`}>
              {umkm.kategori}
            </span>
          </div>

          {/* Konten */}
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-1">{umkm.nama_usaha}</h2>
            <p className="text-sm text-gray-500 mb-4">Pemilik: {umkm.pemilik}</p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Produk / Layanan</p>
              <p className="text-gray-800 text-sm font-medium">{umkm.produk}</p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">{umkm.deskripsi}</p>

            <div className="space-y-3">
              {umkm.kontak && (
                <a
                  href={`tel:${umkm.kontak}`}
                  className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
                >
                  <RiPhoneLine className="text-lg" />
                  {umkm.kontak}
                </a>
              )}
              {umkm.alamat && (
                <div className="flex items-start gap-3 text-gray-600 text-sm px-1">
                  <RiMapPinLine className="text-lg text-gray-400 mt-0.5 shrink-0" />
                  {umkm.alamat}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ===== CARD UMKM =====
function UmkmCard({ umkm, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick(umkm)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group border border-gray-100"
    >
      {/* Foto / Gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradientKelas(umkm.kategori)}`}>
        {umkm.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={umkm.foto_url} alt={umkm.nama_usaha} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <RiStoreLine className="absolute inset-0 m-auto text-white/20 text-7xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badgeKelas(umkm.kategori)}`}>
          {umkm.kategori}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-0.5">{umkm.nama_usaha}</h3>
        <p className="text-xs text-gray-400 mb-2">{umkm.pemilik}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{umkm.produk}</p>
      </div>
    </motion.div>
  );
}

// ===== SEMUA KATEGORI =====
function getAllKategori(data) {
  const set = new Set(data.map((u) => u.kategori).filter(Boolean));
  return ["Semua", ...Array.from(set)];
}

// ===== MAIN PAGE =====
export default function UmkmPage() {
  const [umkmData, setUmkmData] = useState(umkmFallback);
  const [loading, setLoading] = useState(true);
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  useEffect(() => {
    supabase
      .from("umkm")
      .select("*")
      .order("urutan", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setUmkmData(data);
        setLoading(false);
      });
  }, []);

  const kategoriList = getAllKategori(umkmData);

  const filtered = umkmData.filter((u) => {
    const matchKategori = filterKategori === "Semua" || u.kategori === filterKategori;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.nama_usaha?.toLowerCase().includes(q) ||
      u.pemilik?.toLowerCase().includes(q) ||
      u.produk?.toLowerCase().includes(q);
    return matchKategori && matchSearch;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-amber-700 via-orange-600 to-amber-500 text-white pt-16 pb-16 px-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <RiStoreLine className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 text-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-orange-200 hover:text-white text-sm mb-8 transition-colors"
          >
            <RiArrowLeftLine /> Kembali ke Beranda
          </Link>

          <p className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-3">
            Desa Sengkol
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            UMKM Desa Sengkol
          </h1>
          <p className="text-orange-100 max-w-xl text-sm md:text-base leading-relaxed">
            Kenali dan dukung usaha mikro, kecil, dan menengah milik warga Desa
            Sengkol. Produk lokal berkualitas, langsung dari tangan pengrajin dan
            pengusaha desa.
          </p>
        </div>
      </section>

      {/* ===== SEARCH & FILTER ===== */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama usaha, produk, pemilik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="relative">
            <RiFilterLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none cursor-pointer"
            >
              {kategoriList.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ===== GRID UMKM ===== */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse h-52" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <RiStoreLine className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Tidak ada UMKM yang ditemukan</p>
            <button
              onClick={() => { setSearch(""); setFilterKategori("Semua"); }}
              className="mt-4 text-orange-600 text-sm hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              Menampilkan {filtered.length} dari {umkmData.length} UMKM
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((umkm, i) => (
                <motion.div
                  key={umkm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <UmkmCard umkm={umkm} onClick={setSelectedUmkm} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal */}
      {selectedUmkm && (
        <UmkmModal umkm={selectedUmkm} onClose={() => setSelectedUmkm(null)} />
      )}
    </main>
  );
}
