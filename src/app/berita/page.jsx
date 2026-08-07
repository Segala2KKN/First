"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  RiArticleLine,
  RiFilePdfLine,
  RiDownloadLine,
  RiCalendarLine,
  RiUserLine,
  RiCloseLine,
  RiNewspaperLine,
  RiArrowRightLine,
  RiTimeLine,
  RiEyeLine,
} from "react-icons/ri";

// ─── Helpers ──────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }) {
  return (
    <p className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full mb-4">
      {children}
    </p>
  );
}

function KategoriChip({ label }) {
  const colors = {
    Kesehatan:   "bg-rose-100 text-rose-700",
    Lingkungan:  "bg-emerald-100 text-emerald-700",
    Ekonomi:     "bg-amber-100 text-amber-700",
    Budaya:      "bg-purple-100 text-purple-700",
    Pendidikan:  "bg-blue-100 text-blue-700",
    Laporan:     "bg-gray-100 text-gray-600",
    Pariwisata:  "bg-cyan-100 text-cyan-700",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colors[label] || "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

function formatTanggal(str) {
  return new Date(str).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Data Dummy (ganti/tambah sesuai konten asli) ─────────────
const artikelData = [
  {
    id: 1,
    judul: "Posyandu Sengkol Catat Penurunan Angka Stunting Tahun Ini",
    ringkasan:
      "Kegiatan rutin Posyandu di Desa Sengkol menunjukkan hasil menggembirakan — angka stunting turun signifikan berkat program gizi dan pemantauan tumbuh kembang anak yang konsisten.",
    konten: `Desa Sengkol, Lombok Tengah — Posyandu yang aktif beroperasi setiap bulan di Desa Sengkol mencatat hasil positif pada tahun 2026. Berdasarkan data pemantauan tumbuh kembang anak, angka stunting di desa ini mengalami penurunan yang signifikan dibandingkan tahun sebelumnya.

Kepala Desa Sengkol menyampaikan rasa syukurnya atas capaian ini. "Ini hasil kerja keras kader Posyandu, ibu-ibu, dan dukungan berbagai pihak termasuk tim KKN yang membantu kami memantau gizi anak secara digital," ujarnya.

Program pemantauan gizi berbasis teknologi yang diperkenalkan oleh tim KKN turut berkontribusi dalam pencapaian ini. Melalui aplikasi SengkolCare, data berat dan tinggi badan anak dapat dicatat dan dipantau secara real-time, memudahkan kader Posyandu dalam mengidentifikasi anak-anak yang perlu perhatian lebih.

Upaya ini akan terus dilanjutkan dengan pelatihan kader Posyandu dan sosialisasi kepada orang tua mengenai pentingnya gizi seimbang sejak dini.`,
    kategori: "Kesehatan",
    tanggal: "2026-07-28",
    penulis: "Tim KKN Desa Sengkol",
    foto: null,
  },
  {
    id: 2,
    judul: "Tenun Ikat Sasak Ende Tembus Pasar Online Nasional",
    ringkasan:
      "Pengrajin tenun ikat dari Dusun Ende kini mulai memasarkan produknya secara online. Pendampingan UMKM oleh tim KKN membantu mereka membuka toko di berbagai platform e-commerce.",
    konten: `Dusun Ende, Desa Sengkol — Para pengrajin tenun ikat Sasak di Dusun Ende kini selangkah lebih maju. Berkat pendampingan dari tim KKN Universitas, mereka berhasil membuka lapak di platform e-commerce nasional dan mulai menerima pesanan dari berbagai kota besar di Indonesia.

Tenun ikat Ende dikenal dengan motif khas Sasak yang kaya makna filosofi. Setiap helai kain dikerjakan secara manual menggunakan alat tenun tradisional, menjadikannya produk bernilai seni tinggi yang diminati pasar premium.

"Dulu kami hanya jual ke wisatawan yang lewat. Sekarang ada pesanan dari Jakarta, Surabaya, bahkan Bali," ungkap salah satu pengrajin senior.

Tim KKN membantu proses dokumentasi produk, pembuatan foto katalog, dan pengelolaan media sosial. Ke depan, mereka berencana mendaftarkan produk tenun Ende sebagai produk Indikasi Geografis (IG) untuk melindungi keasliannya.`,
    kategori: "Ekonomi",
    tanggal: "2026-07-20",
    penulis: "Tim KKN Desa Sengkol",
    foto: null,
  },
  {
    id: 3,
    judul: "Penanaman 200 Bibit Pohon di Perbukitan Gunung Pujut",
    ringkasan:
      "Aksi penghijauan dilakukan bersama warga desa dan mahasiswa KKN. Sebanyak 200 bibit pohon ditanam di kawasan perbukitan Gunung Pujut sebagai bagian dari program pelestarian lingkungan.",
    konten: `Gunung Pujut, Desa Sengkol — Aksi penghijauan berskala besar dilaksanakan di kawasan perbukitan Gunung Pujut pada akhir Juli 2026. Kegiatan yang melibatkan ratusan warga desa dan mahasiswa KKN ini berhasil menanam sebanyak 200 bibit pohon berbagai jenis, mulai dari mahoni, jati, hingga pohon buah-buahan lokal.

Kegiatan ini merupakan bagian dari program kerja tim KKN bidang lingkungan yang bertujuan untuk memulihkan tutupan vegetasi di perbukitan yang mulai gundul akibat perubahan iklim dan alih fungsi lahan.

Kepala Desa menekankan pentingnya menjaga kawasan perbukitan ini. "Gunung Pujut bukan hanya situs bersejarah, tapi juga sumber air bagi masyarakat sekitar. Kita harus jaga bersama," katanya.

Bibit pohon yang ditanam akan dipantau perkembangannya secara rutin oleh kader lingkungan desa yang telah dibentuk bersama tim KKN.`,
    kategori: "Lingkungan",
    tanggal: "2026-07-15",
    penulis: "Tim KKN Desa Sengkol",
    foto: null,
  },
  {
    id: 4,
    judul: "Festival Budaya Sasak Meriahkan Hari Jadi Desa Sengkol",
    ringkasan:
      "Desa Sengkol menggelar festival budaya tahunan yang menampilkan pertunjukan seni tradisional Sasak, pameran kerajinan, dan lomba-lomba khas desa yang diikuti ratusan warga.",
    konten: `Desa Sengkol, Lombok Tengah — Suasana meriah menyelimuti Desa Sengkol saat menggelar Festival Budaya Sasak dalam rangka memperingati hari jadi desa. Ratusan warga dari berbagai dusun berkumpul untuk menyaksikan pertunjukan seni tradisional yang memukau.

Penampilan tari Gendang Beleq membuka acara dengan gemuruh, disambut oleh pertunjukan silat Sasak dan pembacaan syair Tembang Sasak oleh para sesepuh desa. Pameran kerajinan tenun, anyaman, dan produk UMKM lokal juga memeriahkan festival ini.

Tim KKN turut berpartisipasi dengan mendokumentasikan kegiatan secara profesional dan membantu promosi festival melalui media sosial. Hasilnya, festival tahun ini berhasil menarik perhatian wisatawan dan media dari luar daerah.

"Festival ini adalah wujud kebanggaan kami sebagai masyarakat Sasak. Kami ingin dunia tahu bahwa budaya kami masih hidup dan berkembang," ujar tokoh adat setempat.`,
    kategori: "Budaya",
    tanggal: "2026-07-10",
    penulis: "Tim KKN Desa Sengkol",
    foto: null,
  },
];

const jurnalData = [
  {
    id: 1,
    judul: "Laporan Akhir KKN: Program Kesehatan & Gizi Anak Desa Sengkol",
    deskripsi:
      "Dokumentasi lengkap pelaksanaan program pemantauan gizi anak, pelatihan kader Posyandu, dan implementasi SengkolCare selama periode KKN.",
    kategori: "Laporan",
    tanggal: "2026-08-01",
    file: "/pdf/laporan-kesehatan-kkn.pdf",
    halaman: 24,
  },
  {
    id: 2,
    judul: "Analisis Potensi UMKM Desa Sengkol: Tenun, Kuliner & Kerajinan",
    deskripsi:
      "Kajian mendalam mengenai potensi ekonomi lokal Desa Sengkol, strategi pengembangan UMKM, serta rekomendasi digitalisasi usaha mikro.",
    kategori: "Ekonomi",
    tanggal: "2026-07-25",
    file: "/pdf/analisis-umkm-sengkol.pdf",
    halaman: 18,
  },
  {
    id: 3,
    judul: "Profil Lingkungan & Keanekaragaman Hayati Perbukitan Gunung Pujut",
    deskripsi:
      "Inventarisasi flora dan fauna di kawasan Gunung Pujut beserta rekomendasi program pelestarian lingkungan berbasis komunitas.",
    kategori: "Lingkungan",
    tanggal: "2026-07-18",
    file: "/pdf/profil-lingkungan-pujut.pdf",
    halaman: 32,
  },
  {
    id: 4,
    judul: "Dokumentasi Etnografi Tradisi & Adat Budaya Sasak Desa Sengkol",
    deskripsi:
      "Catatan etnografis mengenai tradisi, upacara adat, seni pertunjukan, dan kearifan lokal yang masih dipraktikkan masyarakat Desa Sengkol.",
    kategori: "Budaya",
    tanggal: "2026-07-12",
    file: "/pdf/etnografi-budaya-sasak.pdf",
    halaman: 28,
  },
];

// ─── Komponen Artikel Modal ────────────────────────────────────
function ArtikelModal({ artikel, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header modal */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-6 pb-4 flex items-start justify-between gap-4 rounded-t-3xl">
          <div className="flex-1">
            <KategoriChip label={artikel.kategori} />
            <h2 className="font-playfair text-xl font-bold text-gray-900 mt-2 leading-snug">
              {artikel.judul}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><RiCalendarLine /> {formatTanggal(artikel.tanggal)}</span>
              <span className="flex items-center gap-1"><RiUserLine /> {artikel.penulis}</span>
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <RiCloseLine className="text-gray-500" />
          </button>
        </div>

        {/* Konten */}
        <div className="px-6 py-6">
          {artikel.foto && (
            <img src={artikel.foto} alt={artikel.judul} className="w-full h-52 object-cover rounded-2xl mb-6" />
          )}
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {artikel.konten}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Komponen Kartu Artikel ────────────────────────────────────
function ArtikelCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Colored accent top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-green-400 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <KategoriChip label={item.kategori} />
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <RiCalendarLine /> {formatTanggal(item.tanggal)}
          </span>
        </div>

        <h3 className="font-playfair text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-cyan-700 transition-colors">
          {item.judul}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {item.ringkasan}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-cyan-600 font-bold text-xs">
          <RiEyeLine /> Baca Selengkapnya
          <RiArrowRightLine className="group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </button>
  );
}

// ─── Download helper ──────────────────────────────────────────
async function downloadPdf(url, judul) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${judul}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank");
  }
}

// ─── Jurnal Modal (preview + download) ───────────────────────
function JurnalModal({ jurnal, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const fileUrl = jurnal.file_url || jurnal.file || "";

  const handleDownload = async () => {
    if (!fileUrl) return;
    setDownloading(true);
    await downloadPdf(fileUrl, jurnal.judul);
    setDownloading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ height: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <KategoriChip label={jurnal.kategori} />
              {jurnal.halaman > 0 && (
                <span className="text-[11px] text-gray-400">{jurnal.halaman} halaman</span>
              )}
            </div>
            <h2 className="font-playfair text-lg font-bold text-gray-900 leading-snug">
              {jurnal.judul}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <RiCalendarLine /> {formatTanggal(jurnal.tanggal)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              disabled={downloading || !fileUrl}
              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <RiDownloadLine /> {downloading ? "Mengunduh..." : "Unduh PDF"}
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <RiCloseLine className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 bg-gray-100 overflow-hidden">
          {fileUrl ? (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title={jurnal.judul}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <RiFilePdfLine className="text-5xl text-rose-200" />
              <p className="text-sm">File PDF belum tersedia</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Komponen Kartu PDF ───────────────────────────────────────
function JurnalCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex gap-4"
    >
      {/* Icon PDF */}
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
        <RiFilePdfLine className="text-rose-500 text-2xl" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <KategoriChip label={item.kategori} />
          {item.halaman > 0 && (
            <span className="text-[11px] text-gray-400">{item.halaman} halaman</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-rose-600 transition-colors">
          {item.judul}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
          {item.deskripsi}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <RiCalendarLine /> {formatTanggal(item.tanggal)}
          </span>
          <span className="flex items-center gap-1 text-rose-500 text-xs font-bold">
            <RiEyeLine /> Lihat PDF
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function BeritaPage() {
  const [selectedArtikel, setSelectedArtikel] = useState(null);
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [artikel, setArtikel] = useState(artikelData);
  const [jurnal, setJurnal] = useState(jurnalData);

  useEffect(() => {
    supabase.from("artikel").select("*").order("tanggal", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setArtikel(data); });
    supabase.from("jurnal").select("*").order("tanggal", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setJurnal(data); });
  }, []);

  return (
    <main className="bg-white text-gray-900">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-gray-900 to-slate-800">
        {/* Decorative blur */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full mb-6"
          >
            <RiNewspaperLine /> Ruang Informasi Desa
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
          >
            Berita & Jurnal<br />
            <span className="text-cyan-400">Desa Sengkol</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto"
          >
            Informasi terkini, liputan kegiatan, dan laporan ilmiah dari Desa Sengkol
            yang ditulis dan dikurasi oleh Tim KKN.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 mt-10"
          >
            {[
              { label: "Artikel", value: artikel.length, icon: RiArticleLine },
              { label: "Jurnal PDF", value: jurnal.length, icon: RiFilePdfLine },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-white mb-1">
                  <Icon className="text-cyan-400 text-lg" /> {value}
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section Artikel Tulisan ── */}
      <section className="py-20 px-6 bg-sky-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-12">
            <Label>Liputan & Artikel</Label>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 leading-tight max-w-xl">
              Kabar Terkini dari Desa Sengkol
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-lg leading-relaxed">
              Klik kartu artikel untuk membaca berita lengkap.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {artikel.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.08}>
                <ArtikelCard item={item} onClick={() => setSelectedArtikel(item)} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section Jurnal PDF ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-12">
            <Label>Jurnal & Laporan</Label>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 leading-tight max-w-xl">
              Dokumentasi Ilmiah & Laporan Resmi
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-lg leading-relaxed">
              Unduh laporan dan jurnal hasil penelitian serta dokumentasi kegiatan KKN dalam format PDF.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5">
            {jurnal.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.08}>
                <JurnalCard item={item} onClick={() => setSelectedJurnal(item)} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artikel Modal ── */}
      <AnimatePresence>
        {selectedArtikel && (
          <ArtikelModal
            artikel={selectedArtikel}
            onClose={() => setSelectedArtikel(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Jurnal Modal ── */}
      <AnimatePresence>
        {selectedJurnal && (
          <JurnalModal
            jurnal={selectedJurnal}
            onClose={() => setSelectedJurnal(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
