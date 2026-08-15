"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  RiStoreLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCloseLine,
  RiSearchLine,
  RiFilterLine,
  RiMapPin2Line,
  RiInstagramLine,
  RiGlobalLine,
  RiWhatsappLine,
  RiMoneyDollarCircleLine,
  RiQrCodeLine,
  RiBankCardLine,
} from "react-icons/ri";

// ===== PHOTO FADER (auto-slideshow) =====
function PhotoFader({ photos, alt }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    const t = setInterval(() => setCurrent((i) => (i + 1) % photos.length), 2000);
    return () => clearInterval(t);
  }, [photos]);
  if (!photos || photos.length === 0) return null;
  return (
    <>
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === current ? 1 : 0, transition: "opacity 0.7s ease-in-out" }}
        />
      ))}
    </>
  );
}

function getPhotos(umkm) {
  const arr = Array.isArray(umkm.fotos) ? umkm.fotos : [];
  if (arr.length > 0) return arr;
  if (umkm.foto_url) return [umkm.foto_url];
  return [];
}

// ===== FALLBACK DATA (kalau Supabase belum diisi) =====
const umkmFallback = [
  {
    id: "1",
    nama_usaha: "Tenun Ikat Sengkol",
    pemilik: "Ibu Fatimah",
    kategori: ["Kerajinan"],
    produk: "Kain tenun ikat motif Sasak, sarung, selendang",
    deskripsi:
      "Usaha tenun ikat tradisional yang telah diwariskan turun-temurun. Menggunakan teknik pewarnaan alami dari tumbuhan sekitar desa.",
    foto_url: null,
    telepon: "0812-3456-7890",
    alamat: "Dusun Sengkol Utara",
    pembayaran: ["Tunai", "QRIS"],
  },
  {
    id: "2",
    nama_usaha: "Olahan Kelor Sengkol",
    pemilik: "Kelompok Ibu PKK",
    kategori: ["Kuliner"],
    produk: "Keripik kelor, tepung kelor, teh kelor",
    deskripsi:
      "Produk olahan daun kelor bernilai gizi tinggi untuk mendukung program penanggulangan stunting di Desa Sengkol.",
    foto_url: null,
    telepon: "0813-5678-9012",
    alamat: "Balai Desa Sengkol",
    pembayaran: ["Tunai"],
  },
  {
    id: "3",
    nama_usaha: "Warung Makan Bu Sari",
    pemilik: "Ibu Sari",
    kategori: ["Kuliner", "Jasa Wisata"],
    produk: "Plecing kangkung, ayam taliwang, nasi balap puyung",
    deskripsi:
      "Warung makan yang menyajikan masakan khas Lombok dengan cita rasa autentik dan bahan-bahan segar dari petani lokal desa.",
    foto_url: null,
    telepon: "0857-1234-5678",
    alamat: "Jl. Raya Sengkol No. 12",
    pembayaran: ["Tunai", "QRIS", "EDC"],
  },
];

const KATEGORI_WARNA = {
  "Jasa Wisata":     "bg-cyan-100 text-cyan-700",
  Kuliner:           "bg-orange-100 text-orange-700",
  Kerajinan:         "bg-purple-100 text-purple-700",
  "Toko/Perdagangan":"bg-amber-100 text-amber-700",
  Laundry:           "bg-sky-100 text-sky-700",
  default:           "bg-gray-100 text-gray-700",
};

const KATEGORI_GRADIENT = {
  "Jasa Wisata":     "from-cyan-500 to-teal-400",
  Kuliner:           "from-orange-500 to-amber-400",
  Kerajinan:         "from-purple-600 to-pink-400",
  "Toko/Perdagangan":"from-amber-600 to-yellow-400",
  Laundry:           "from-sky-500 to-blue-400",
  default:           "from-gray-500 to-gray-400",
};

const PEMBAYARAN_INFO = {
  Tunai: { icon: RiMoneyDollarCircleLine, color: "bg-green-100 text-green-700" },
  QRIS:  { icon: RiQrCodeLine,           color: "bg-purple-100 text-purple-700" },
  EDC:   { icon: RiBankCardLine,         color: "bg-blue-100 text-blue-700" },
};

// Normalisasi kategori → selalu array
function toArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

function badgeKelas(k) {
  return KATEGORI_WARNA[k] || KATEGORI_WARNA.default;
}
function gradientKelas(kategori) {
  const arr = toArr(kategori);
  return KATEGORI_GRADIENT[arr[0]] || KATEGORI_GRADIENT.default;
}

// ===== MODAL DETAIL UMKM =====
function UmkmModal({ umkm, onClose }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!umkm) return null;
  const photos = getPhotos(umkm);

  const prev = (e) => { e.stopPropagation(); setCurrent((i) => (i - 1 + photos.length) % photos.length); };
  const next = (e) => { e.stopPropagation(); setCurrent((i) => (i + 1) % photos.length); };

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
            {photos.length > 0 ? (
              <>
                {/* Foto — klik untuk lightbox */}
                <div className="absolute inset-0 cursor-zoom-in" onClick={() => setLightbox(true)}>
                  {photos.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt={umkm.nama_usaha}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: i === current ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
                    />
                  ))}
                </div>
                {/* Prev / Next */}
                {photos.length > 1 && (
                  <>
                    <button onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/65 text-white rounded-full p-2 transition-colors">
                      <RiArrowLeftLine />
                    </button>
                    <button onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/65 text-white rounded-full p-2 transition-colors">
                      <RiArrowRightLine />
                    </button>
                    {/* Counter */}
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/40 text-white text-xs px-2.5 py-0.5 rounded-full">
                      {current + 1} / {photos.length}
                    </span>
                  </>
                )}
              </>
            ) : (
              <RiStoreLine className="absolute inset-0 m-auto text-white/20 text-9xl" />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            >
              <RiCloseLine className="text-xl" />
            </button>
            <div className="relative z-20 flex flex-wrap gap-1.5">
              {toArr(umkm.kategori).map((k, i) => (
                <span key={`${k}-${i}`} className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeKelas(k)}`}>{k}</span>
              ))}
            </div>
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightbox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/92 flex flex-col items-center justify-center p-4"
                onClick={() => setLightbox(false)}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ type: "spring", damping: 24 }}
                  className="relative max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photos[current]} alt={umkm.nama_usaha}
                    className="w-full rounded-2xl object-contain max-h-[65vh]" />
                  {photos.length > 1 && (
                    <>
                      <button onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 transition-colors">
                        <RiArrowLeftLine />
                      </button>
                      <button onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 transition-colors">
                        <RiArrowRightLine />
                      </button>
                    </>
                  )}
                  <div className="text-center mt-3">
                    <p className="text-white font-bold">{umkm.nama_usaha}</p>
                    {photos.length > 1 && (
                      <p className="text-white/50 text-sm">{current + 1} / {photos.length}</p>
                    )}
                  </div>
                </motion.div>
                <button
                  onClick={() => setLightbox(false)}
                  className="mt-5 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
                >
                  <RiArrowLeftLine /> Kembali ke Detail
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Konten */}
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-1">{umkm.nama_usaha}</h2>
            <p className="text-sm text-gray-500 mb-4">Pemilik: {umkm.pemilik}</p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Produk / Layanan</p>
              <p className="text-gray-800 text-sm font-medium">{umkm.produk}</p>
            </div>

            {umkm.deskripsi && umkm.deskripsi !== umkm.produk && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{umkm.deskripsi}</p>
            )}

            {/* Pembayaran */}
            {toArr(umkm.pembayaran).length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pembayaran</p>
                <div className="flex flex-wrap gap-2">
                  {toArr(umkm.pembayaran).map((p) => {
                    const info = PEMBAYARAN_INFO[p];
                    const Icon = info?.icon;
                    return (
                      <span key={p} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${info?.color || "bg-gray-100 text-gray-700"}`}>
                        {Icon && <Icon className="text-sm" />}
                        {p}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {/* Maps */}
              {umkm.maps_url && (
                <a
                  href={umkm.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
                >
                  <RiMapPin2Line className="text-lg shrink-0" />
                  Lihat di Google Maps
                </a>
              )}
              {/* Alamat teks */}
              {umkm.alamat && (
                <div className="flex items-start gap-3 text-gray-600 text-sm px-1">
                  <RiMapPinLine className="text-lg text-gray-400 mt-0.5 shrink-0" />
                  {umkm.alamat}
                </div>
              )}
              {/* Instagram */}
              {umkm.instagram && (
                <a
                  href={umkm.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
                >
                  <RiInstagramLine className="text-lg shrink-0" />
                  Instagram
                </a>
              )}
              {/* Website */}
              {umkm.website && (
                <a
                  href={umkm.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
                >
                  <RiGlobalLine className="text-lg shrink-0" />
                  Website
                </a>
              )}
              {/* WhatsApp */}
              {umkm.whatsapp && (
                <a
                  href={umkm.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
                >
                  <RiWhatsappLine className="text-lg shrink-0" />
                  WhatsApp
                </a>
              )}
              {/* Telepon */}
              {umkm.telepon && (
                <a
                  href={`tel:${umkm.telepon}`}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl px-4 py-3 transition-colors text-sm font-medium"
                >
                  <RiPhoneLine className="text-lg shrink-0" />
                  {umkm.telepon}
                </a>
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
      {/* Foto / Gradient — auto slideshow */}
      <div className={`relative h-40 bg-gradient-to-br ${gradientKelas(umkm.kategori)}`}>
        {(() => {
          const photos = getPhotos(umkm);
          return photos.length > 0
            ? <PhotoFader photos={photos} alt={umkm.nama_usaha} />
            : <RiStoreLine className="absolute inset-0 m-auto text-white/20 text-7xl" />;
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 pointer-events-none">
          {toArr(umkm.kategori).map((k, i) => (
            <span key={`${k}-${i}`} className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeKelas(k)}`}>{k}</span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-0.5">{umkm.nama_usaha}</h3>
        <p className="text-xs text-gray-400 mb-2">{umkm.pemilik}</p>
        <p className="text-xs text-gray-500 line-clamp-3">{umkm.deskripsi || umkm.produk}</p>
      </div>
    </motion.div>
  );
}

// ===== SEMUA KATEGORI =====
function getAllKategori(data) {
  const set = new Set(data.flatMap((u) => toArr(u.kategori)).filter(Boolean));
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
    const matchKategori = filterKategori === "Semua" || toArr(u.kategori).includes(filterKategori);
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
      <section className="relative text-white pt-16 pb-16 px-6 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/Image UMKM.JPG" alt="UMKM Desa Sengkol"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />

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
