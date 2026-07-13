"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  RiLeafLine,
  RiTreeLine,
  RiCloseLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiTrophyLine,
  RiRestartLine,
  RiStarFill,
  RiQuestionLine,
} from "react-icons/ri";

// ===== FALLBACK DATA POHON (dipakai jika Supabase belum dikonfigurasi) =====
const pohonFallback = [
  {
    id: 1,
    nama: "Cemara Kipas",
    namaIlmiah: "Thuja orientalis",
    famili: "Cupressaceae",
    warna: "from-emerald-600 to-green-400",
    badge: "bg-emerald-100 text-emerald-800",
    fotos: [], // Contoh: ["/images/pohon/cemara-kipas-1.jpg", "/images/pohon/cemara-kipas-2.jpg"]
    deskripsiSingkat: "Pagar hidup & tanaman hias dengan daun seperti kipas yang rapat",
    ciri: [
      "Daunnya kecil-kecil seperti sisik, tersusun rapat membentuk bidang pipih menyerupai kipas",
      "Tumbuh subur di dataran rendah dan tinggi, menyukai cahaya matahari yang cukup",
    ],
    manfaat:
      "Sering ditanam sebagai pagar hidup dan tanaman hias di halaman sekolah, juga sebagai peneduh.",
  },
  {
    id: 2,
    nama: "Glodokan Tiang",
    namaIlmiah: "Polyalthia longifolia",
    famili: "Annonaceae",
    warna: "from-teal-600 to-cyan-400",
    badge: "bg-teal-100 text-teal-800",
    fotos: [], // Contoh: ["/images/pohon/glodokan-tiang-1.jpg", "/images/pohon/glodokan-tiang-2.jpg"]
    deskripsiSingkat: "Pohon tinggi ramping seperti tiang, peneduh jalan yang rapi",
    ciri: [
      "Pohonnya tinggi dan ramping, bentuknya seperti tiang atau pilar",
      "Daunnya panjang, tepinya bergelombang, dan menjuntai lemas apabila tertiup angin",
      "Buahnya kecil, tumbuh bergerombol, berubah dari hijau jadi ungu kehitaman saat matang",
    ],
    manfaat:
      "Jadi pohon peneduh jalan yang rapi dan membantu udara di sekitarnya menjadi lebih bersih.",
  },
  {
    id: 3,
    nama: "Beringin",
    namaIlmiah: "Ficus benjamina",
    famili: "Moraceae",
    warna: "from-green-800 to-green-500",
    badge: "bg-green-100 text-green-900",
    fotos: [], // Contoh: ["/images/pohon/beringin-1.jpg", "/images/pohon/beringin-2.jpg"]
    deskripsiSingkat: "Pohon besar rimbun dengan akar gantung yang turun dari dahannya",
    ciri: [
      "Pohonnya besar dengan daun yang sangat rimbun",
      "Punya akar yang menggantung turun dari dahan-dahannya (akar gantung)",
    ],
    manfaat: "Menjadi peneduh dan rumah bagi banyak satwa.",
  },
  {
    id: 4,
    nama: "Asam Jawa",
    namaIlmiah: "Tamarindus indica",
    famili: "Fabaceae",
    warna: "from-amber-700 to-yellow-500",
    badge: "bg-amber-100 text-amber-800",
    fotos: [], // Contoh: ["/images/pohon/asam-jawa-1.jpg", "/images/pohon/asam-jawa-2.jpg"]
    deskripsiSingkat: "Pohon buah asam untuk bumbu masakan dan minuman segar",
    ciri: [
      "Daunnya kecil-kecil dan banyak, tersusun dalam satu tangkai",
      "Bunganya kecil, berwarna kuning kemerahan",
      "Buahnya berbentuk polong panjang berwarna coklat, berisi daging buah rasa asam",
    ],
    manfaat: "Buahnya sering dipakai untuk bumbu masakan dan bahan minuman segar.",
  },
  {
    id: 5,
    nama: "Pakis Haji",
    namaIlmiah: "Cycas rumphii",
    famili: "Cycadaceae",
    warna: "from-teal-800 to-cyan-600",
    badge: "bg-teal-100 text-teal-900",
    fotos: [], // Contoh: ["/images/pohon/pakis-haji-1.jpg", "/images/pohon/pakis-haji-2.jpg"]
    deskripsiSingkat: '"Fosil hidup" — sudah ada sejak zaman dinosaurus!',
    ciri: [
      "Daunnya kaku dan tumbuh melingkar di pucuk batang",
      "Batangnya kasar dan bersisik",
    ],
    manfaat: "Jadi tanaman hias unik yang bernilai tinggi dan sering dikoleksi.",
  },
  {
    id: 6,
    nama: "Mangga",
    namaIlmiah: "Mangifera indica",
    famili: "Anacardiaceae",
    warna: "from-yellow-500 to-lime-400",
    badge: "bg-yellow-100 text-yellow-800",
    fotos: [], // Contoh: ["/images/pohon/mangga-1.jpg", "/images/pohon/mangga-2.jpg"]
    deskripsiSingkat: "Pohon buah lezat dengan tajuk lebar dan daun hijau mengkilap",
    ciri: [
      "Pohonnya besar dengan tajuk yang lebar dan rimbun",
      "Daunnya memanjang, hijau tua mengkilap, dan daun mudanya berwarna kemerahan",
      "Buahnya bulat lonjong, berubah dari hijau jadi kuning atau kemerahan saat matang",
    ],
    manfaat:
      "Buahnya enak dimakan langsung atau diolah menjadi jus dan makanan lain, pohonnya juga berfungsi sebagai peneduh.",
  },
  {
    id: 7,
    nama: "Kelor",
    namaIlmiah: "Moringa oleifera",
    famili: "Moringaceae",
    warna: "from-lime-600 to-green-400",
    badge: "bg-lime-100 text-lime-800",
    fotos: [], // Contoh: ["/images/pohon/kelor-1.jpg", "/images/pohon/kelor-2.jpg"]
    deskripsiSingkat: "Tanaman super bergizi dengan daun kecil tersusun rapi menyirip",
    ciri: [
      "Pohonnya kecil sampai sedang, tumbuh cepat dan mudah bercabang",
      "Daunnya kecil-kecil dan tersusun rapi menyirip",
      'Buahnya panjang berbentuk segitiga, biasa disebut "kelentang"',
    ],
    manfaat:
      "Daunnya dapat dijadikan sayur bening dan olahan lain yang memiliki kandungan gizi yang baik.",
  },
  {
    id: 8,
    nama: "Turi",
    namaIlmiah: "Sesbania grandiflora",
    famili: "Fabaceae",
    warna: "from-purple-600 to-pink-400",
    badge: "bg-purple-100 text-purple-800",
    fotos: [], // Contoh: ["/images/pohon/turi-1.jpg", "/images/pohon/turi-2.jpg"]
    deskripsiSingkat: "Pohon cepat tumbuh dengan bunga cantik seperti kupu-kupu",
    ciri: [
      "Pohonnya kecil dan tumbuh sangat cepat",
      "Bunganya besar, berbentuk seperti kupu-kupu, warnanya putih atau merah",
      "Buahnya berbentuk polong panjang dan pipih",
    ],
    manfaat:
      "Bunga dan daun mudanya enak dijadikan sayur. Akarnya membantu menyuburkan tanah dan daunnya sering dijadikan pakan ternak.",
  },
];

// Helper: map baris DB (snake_case) ke format komponen (camelCase)
function mapPohon(row) {
  return {
    id: row.id,
    nama: row.nama,
    namaIlmiah: row.nama_ilmiah,
    famili: row.famili,
    warna: row.warna,
    badge: row.badge,
    fotos: Array.isArray(row.fotos) ? row.fotos : [],
    deskripsiSingkat: row.deskripsi_singkat,
    ciri: Array.isArray(row.ciri) ? row.ciri : [],
    manfaat: row.manfaat,
  };
}

// ===== DATA BAGIAN POHON =====
const bagianPohon = [
  { num: 1, nama: "Akar", fungsi: "Menyerap air dan makanan dari tanah, serta menahan pohon supaya tidak roboh.", color: "bg-amber-50 border-amber-300 text-amber-900" },
  { num: 2, nama: "Batang", fungsi: "Mengalirkan air dan makanan dari akar ke daun, sekaligus menopang pohon.", color: "bg-orange-50 border-orange-300 text-orange-900" },
  { num: 3, nama: "Daun", fungsi: "Membuat makanan melalui proses fotosintesis dengan bantuan sinar matahari.", color: "bg-green-50 border-green-300 text-green-900" },
  { num: 4, nama: "Bunga", fungsi: "Tempat terjadinya penyerbukan, awal mula terbentuknya buah.", color: "bg-pink-50 border-pink-300 text-pink-900" },
  { num: 5, nama: "Buah", fungsi: "Melindungi biji di dalamnya.", color: "bg-red-50 border-red-300 text-red-900" },
  { num: 6, nama: "Biji", fungsi: "Calon tumbuhan baru.", color: "bg-yellow-50 border-yellow-300 text-yellow-900" },
];

// ===== DATA KUIS =====
const quizData = [
  {
    soal: "Apa nama ilmiah dari Cemara Kipas?",
    pilihan: ["Thuja orientalis", "Ficus benjamina", "Cycas rumphii", "Morinda citrifolia"],
    jawaban: 0,
  },
  {
    soal: "Glodokan Tiang dulu batangnya sering digunakan sebagai...",
    pilihan: ["Atap rumah", "Tiang layar kapal", "Alat musik", "Jembatan"],
    jawaban: 1,
  },
  {
    soal: "Ciri khas pohon Beringin yang tumbuh turun dari dahannya disebut...",
    pilihan: ["Akar tunjang", "Akar gantung", "Akar serabut", "Akar tunggang"],
    jawaban: 1,
  },
  {
    soal: 'Pakis Haji disebut "fosil hidup" karena...',
    pilihan: [
      "Berwarna abu-abu seperti batu",
      "Sudah ada sejak zaman dinosaurus",
      "Tidak bisa tumbuh lagi",
      "Ditemukan di dalam fosil",
    ],
    jawaban: 1,
  },
  {
    soal: "Bagian pohon yang berfungsi menyerap air dan zat hara dari tanah adalah...",
    pilihan: ["Daun", "Akar", "Bunga", "Buah"],
    jawaban: 1,
  },
  {
    soal: "Proses tumbuhan menghasilkan oksigen terjadi terutama pada bagian...",
    pilihan: ["Akar", "Batang", "Daun", "Biji"],
    jawaban: 2,
  },
  {
    soal: "Manfaat utama pohon bagi lingkungan sekolah adalah...",
    pilihan: [
      "Membuat udara lebih panas",
      "Menghasilkan oksigen dan udara sejuk",
      "Membuat tanah menjadi gersang",
      "Mengundang polusi",
    ],
    jawaban: 1,
  },
];

const LETTERS = ["A", "B", "C", "D"];

// ===== LIGHTBOX =====
function Lightbox({ fotos, startIdx, nama, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const touchStartX = useRef(null);

  // Tutup dengan Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const prev = (e) => { e?.stopPropagation(); setIdx((i) => (i - 1 + fotos.length) % fotos.length); };
  const next = (e) => { e?.stopPropagation(); setIdx((i) => (i + 1) % fotos.length); };

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    else if (delta < -50) prev();
    touchStartX.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Tombol tutup */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
      >
        <RiCloseLine className="text-xl" />
      </button>

      {/* Counter */}
      {fotos.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs px-3 py-1 rounded-full">
          {idx + 1} / {fotos.length}
        </div>
      )}

      {/* Gambar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full flex items-center justify-center px-12 py-16"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotos[idx]}
            alt={`${nama} foto ${idx + 1}`}
            className="max-w-full max-h-full object-contain rounded-xl select-none"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigasi panah */}
      {fotos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors"
          >
            <RiArrowLeftLine className="text-lg" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors"
          >
            <RiArrowRightLine className="text-lg" />
          </button>

          {/* Dot indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ===== KOMPONEN FOTO CAROUSEL (dipakai di modal) =====
function PhotoCarousel({ fotos, warna, nama }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef(null);
  const hasFoto = fotos && fotos.length > 0;

  if (!hasFoto) {
    return (
      <div className={`h-52 bg-gradient-to-br ${warna} flex items-center justify-center`}>
        <RiTreeLine className="text-white/30 text-9xl" />
      </div>
    );
  }

  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + fotos.length) % fotos.length); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % fotos.length); };

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) setIdx((i) => (i + 1) % fotos.length);
    else if (delta < -50) setIdx((i) => (i - 1 + fotos.length) % fotos.length);
    touchStartX.current = null;
  };

  return (
    <>
      <div
        className="relative h-52 bg-gray-900 overflow-hidden cursor-zoom-in"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            onClick={() => setLightbox(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fotos[idx]} alt={`${nama} foto ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Hint ketuk */}
        <div className="absolute bottom-2 left-2 z-10 bg-black/30 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none">
          Ketuk untuk perbesar
        </div>

        {fotos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/35 backdrop-blur-sm rounded-full p-1.5 text-white">
              <RiArrowLeftLine className="text-sm" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/35 backdrop-blur-sm rounded-full p-1.5 text-white">
              <RiArrowRightLine className="text-sm" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
            <div className="absolute top-2 right-2 z-10 bg-black/35 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
              {idx + 1}/{fotos.length}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox fotos={fotos} startIdx={idx} nama={nama} onClose={() => setLightbox(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ===== KOMPONEN KARTU POHON =====
function PohonCard({ pohon, onClick }) {
  const hasFoto = pohon.fotos && pohon.fotos.length > 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(pohon)}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex flex-col"
    >
      {hasFoto ? (
        <div className="h-28 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pohon.fotos[0]} alt={pohon.nama} className="absolute inset-0 w-full h-full object-cover" />
          {pohon.fotos.length > 1 && (
            <div className="absolute bottom-1.5 right-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <RiArrowRightLine className="text-xs" /> {pohon.fotos.length} foto
            </div>
          )}
        </div>
      ) : (
        <div className={`h-28 bg-gradient-to-br ${pohon.warna} flex items-center justify-center relative`}>
          <RiTreeLine className="text-white/40 text-6xl" />
          <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{pohon.id}</span>
          </div>
        </div>
      )}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight">{pohon.nama}</h3>
        <p className="text-xs text-gray-400 italic mb-2">{pohon.namaIlmiah}</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-2 ${pohon.badge}`}>
          {pohon.famili}
        </span>
        <p className="text-gray-500 text-xs leading-relaxed flex-1">{pohon.deskripsiSingkat}</p>
        <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-semibold">
          Lihat Detail <RiArrowRightLine className="text-sm" />
        </div>
      </div>
    </motion.div>
  );
}

// ===== MODAL DETAIL POHON =====
function PohonModal({ pohon, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Foto carousel atau gradient */}
        <div className="relative rounded-t-3xl overflow-hidden">
          <PhotoCarousel fotos={pohon.fotos} warna={pohon.warna} nama={pohon.nama} />
          {/* Gradient overlay bawah agar teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white"
          >
            <RiCloseLine className="text-xl" />
          </button>
          {/* Info pohon */}
          <div className="absolute bottom-4 left-5 text-white z-10">
            <p className="text-white/60 text-xs font-mono mb-0.5">Pohon #{pohon.id}</p>
            <h2 className="text-2xl font-black drop-shadow">{pohon.nama}</h2>
            <p className="text-white/80 text-sm italic drop-shadow">{pohon.namaIlmiah}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${pohon.badge} mb-5 inline-block`}>
            Famili: {pohon.famili}
          </span>

          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <RiLeafLine className="text-green-500" /> Ciri-Cirinya
          </h3>
          <ul className="space-y-2 mb-5">
            {pohon.ciri.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <RiStarFill className="text-yellow-500" /> Manfaatnya
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            {pohon.manfaat}
          </p>

          <button
            onClick={onClose}
            className="mt-5 w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold text-sm"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== KUIS INTERAKTIF =====
function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizData[currentQ];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.jawaban) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= quizData.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const getResult = () => {
    if (score === 7) return { pesan: "Sempurna! Kamu Ahli Pohon!", warna: "text-green-600" };
    if (score >= 5) return { pesan: "Hebat! Terus semangat belajar ya!", warna: "text-blue-600" };
    if (score >= 3) return { pesan: "Lumayan! Yuk coba lagi!", warna: "text-amber-600" };
    return { pesan: "Jangan menyerah! Baca lagi dan coba!", warna: "text-red-500" };
  };

  if (finished) {
    const result = getResult();
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-6"
      >
        <RiTrophyLine className="text-yellow-400 text-7xl mx-auto mb-3" />
        <h3 className="text-2xl font-black text-gray-900 mb-1">Kuis Selesai!</h3>
        <div className="text-5xl font-black text-gray-900 mb-1">
          {score}
          <span className="text-2xl text-gray-400 font-bold">/{quizData.length}</span>
        </div>
        <p className={`font-bold text-base mb-5 ${result.warna}`}>{result.pesan}</p>

        <div className="flex justify-center gap-2 mb-6">
          {quizData.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`w-3 h-3 rounded-full ${i < score ? "bg-green-500" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition-colors"
        >
          <RiRestartLine /> Coba Lagi
        </button>
      </motion.div>
    );
  }

  const getButtonStyle = (i) => {
    if (!answered) return "border-2 border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50 active:scale-95";
    if (i === q.jawaban) return "border-2 border-green-500 bg-green-50 text-green-800";
    if (i === selected) return "border-2 border-red-400 bg-red-50 text-red-700";
    return "border-2 border-gray-100 bg-gray-50 text-gray-400";
  };

  return (
    <div>
      {/* Progress bar */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400 font-medium">Soal {currentQ + 1}/{quizData.length}</span>
        <span className="text-xs font-bold text-green-600">Skor: {score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
        <motion.div
          className="bg-green-500 h-2 rounded-full"
          animate={{ width: `${(currentQ / quizData.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-gray-900 font-bold text-base leading-snug mb-4">{q.soal}</p>

          <div className="grid grid-cols-1 gap-2.5 mb-4">
            {q.pilihan.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-3 ${getButtonStyle(i)}`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500">
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{p}</span>
                {answered && i === q.jawaban && (
                  <RiCheckLine className="text-green-600 text-lg shrink-0" />
                )}
              </button>
            ))}
          </div>

          {answered && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div
                className={`rounded-xl px-4 py-3 mb-3 text-sm font-semibold ${
                  selected === q.jawaban
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {selected === q.jawaban
                  ? "Benar! Jawaban kamu tepat!"
                  : `Oops! Jawaban yang benar: ${LETTERS[q.jawaban]}. ${q.pilihan[q.jawaban]}`}
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {currentQ + 1 >= quizData.length ? "Lihat Hasil" : "Soal Berikutnya"}
                <RiArrowRightLine />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ===== MAIN PAGE =====
export default function GreenEdu() {
  const [selectedPohon, setSelectedPohon] = useState(null);
  const [pohonData, setPohonData] = useState(pohonFallback);
  const [loadingPohon, setLoadingPohon] = useState(true);

  useEffect(() => {
    supabase
      .from("pohon")
      .select("*")
      .order("urutan", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPohonData(data.map(mapPohon));
        }
        setLoadingPohon(false);
      });
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white pt-14 pb-20 px-6 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 opacity-10 pointer-events-none">
          <RiTreeLine className="text-[160px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-green-300 hover:text-white text-sm mb-8 transition-colors"
          >
            <RiArrowLeftLine /> Kembali ke Beranda
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-white/15 rounded-2xl p-3">
                <RiLeafLine className="text-2xl" />
              </div>
              <span className="bg-white/15 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Green Edu
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Kenalan dengan
              <br />
              <span className="text-green-300">Pohon di Desa Sengkol</span>
            </h1>
            <p className="text-green-200 text-base md:text-lg max-w-xl leading-relaxed">
              Yuk belajar mengenal pohon-pohon yang ada di sekitar kita! Ketuk kartu pohon untuk tahu lebih banyak, lalu coba kuis seru di bagian bawah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== APA ITU POHON ===== */}
      <section className="py-16 px-6 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-2">Apa Itu Pohon?</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              Pohon adalah tumbuhan yang punya batang berkayu dan tumbuh tinggi ke atas. Pohon sangat penting di Bumi karena memberikan banyak manfaat!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <RiLeafLine />, teks: "Menghasilkan oksigen yang kita hirup setiap hari", bg: "bg-green-100 text-green-700" },
              { icon: <RiTreeLine />, teks: "Menyerap air hujan supaya tidak banjir", bg: "bg-blue-100 text-blue-700" },
              { icon: <RiLeafLine />, teks: "Membuat udara di sekitar kita jadi sejuk", bg: "bg-cyan-100 text-cyan-700" },
              { icon: <RiTreeLine />, teks: "Jadi rumah buat burung dan hewan kecil lainnya", bg: "bg-amber-100 text-amber-700" },
              { icon: <RiLeafLine />, teks: "Menjaga tanah supaya tidak longsor", bg: "bg-orange-100 text-orange-700" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3"
              >
                <div className={`rounded-xl p-2 shrink-0 text-xl ${item.bg}`}>{item.icon}</div>
                <p className="text-gray-700 text-sm font-medium leading-snug">{item.teks}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BAGIAN-BAGIAN POHON ===== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Bagian-Bagian Pohon</h2>
            <p className="text-gray-400 text-sm">Setiap bagian pohon punya fungsi yang berbeda-beda</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bagianPohon.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className={`rounded-2xl p-5 border-2 ${b.color}`}
              >
                <div className="text-4xl font-black mb-2 opacity-20">{b.num}</div>
                <h3 className="font-black text-base mb-1">{b.nama}</h3>
                <p className="text-xs leading-relaxed opacity-70">{b.fungsi}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KOLEKSI POHON ===== */}
      <section className="py-16 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-600 font-bold uppercase tracking-widest text-xs mb-3">Jenis Pohon</p>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Pohon di Sekitar Kita</h2>
            <p className="text-gray-400 text-sm">Ketuk kartu untuk melihat info lengkapnya!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingPohon
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-48" />
                ))
              : pohonData.map((pohon, i) => (
              <motion.div
                key={pohon.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <PohonCard pohon={pohon} onClick={setSelectedPohon} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KUIS ===== */}
      <section className="py-16 px-6 bg-gradient-to-br from-green-900 to-emerald-800">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-200 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              <RiQuestionLine /> Kuis Seru
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Yuk Bermain Kuis!</h2>
            <p className="text-green-200 text-sm">Seberapa jauh kamu mengenal pohon-pohon di sekitar kita?</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <QuizSection />
          </div>
        </div>
      </section>

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selectedPohon && (
          <PohonModal pohon={selectedPohon} onClose={() => setSelectedPohon(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
