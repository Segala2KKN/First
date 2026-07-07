"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiHeartPulseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiUserLine,
  RiScales3Line,
  RiRulerLine,
  RiCalendarLine,
  RiHospitalLine,
  RiHomeLine,
  RiRefreshLine,
  RiDropLine,
  RiSunLine,
  RiMedicineBottleLine,
  RiParentLine,
  RiHeartLine,
  RiFirstAidKitLine,
} from "react-icons/ri";

// ─── Z-SCORE DATA (WHO) ─────────────────────────────────────────────────────
// BB/U boys/girls 0-2 months: [month, -3SD, -2SD, median, +2SD, +3SD]
const bbUBoys = [
  [0, 2.1, 2.5, 3.3, 4.4, 5.0],
  [1, 2.9, 3.4, 4.5, 5.8, 6.6],
  [2, 3.8, 4.3, 5.6, 7.1, 8.0],
];
const bbUGirls = [
  [0, 2.0, 2.4, 3.2, 4.2, 4.8],
  [1, 2.7, 3.2, 4.2, 5.5, 6.2],
  [2, 3.4, 3.9, 5.1, 6.6, 7.5],
];

function getZScoreCategory(weight, tableRow) {
  const [, sd3neg, sd2neg, , sd2pos, sd3pos] = tableRow;
  if (weight < sd3neg) return { label: "Gizi Buruk", color: "red", level: -3 };
  if (weight < sd2neg) return { label: "Gizi Kurang", color: "orange", level: -2 };
  if (weight <= sd2pos) return { label: "Gizi Baik", color: "green", level: 0 };
  if (weight <= sd3pos) return { label: "Berisiko Gizi Lebih", color: "yellow", level: 2 };
  return { label: "Gizi Lebih / Obesitas", color: "red", level: 3 };
}

function calcStatusGizi(gender, ageMonths, weight) {
  const table = gender === "L" ? bbUBoys : bbUGirls;
  const month = Math.min(Math.floor(ageMonths), 2);
  const row = table.find((r) => r[0] === month) || table[table.length - 1];
  return getZScoreCategory(weight, row);
}

// ─── QUESTION DATA ───────────────────────────────────────────────────────────
const C1A_QUESTIONS = [
  { id: "c1a1", text: "Apakah bayi tidak bisa menyusu atau minum?" },
  { id: "c1a2", text: "Apakah bayi kejang?" },
  { id: "c1a3", text: "Apakah bayi bernapas cepat (≥60x/menit)?" },
  { id: "c1a4", text: "Apakah dada bayi tampak tertarik ke dalam saat bernapas?" },
  { id: "c1a5", text: "Apakah tali pusat bernanah atau kemerahan sampai kulit perut?" },
  { id: "c1a6", text: "Apakah terdapat pustul kulit (bintik bernanah di kulit)?" },
  { id: "c1a7", text: "Apakah mata bayi bernanah?" },
  { id: "c1a8", text: "Apakah tubuh bayi demam (suhu ≥37.5°C)?" },
  { id: "c1a9", text: "Apakah tubuh bayi terasa sangat dingin / hipotermia (suhu <35.5°C)?" },
  { id: "c1a10", text: "Apakah gerakan bayi tidak aktif / terlihat sangat lemah?" },
];

const C1B_QUESTIONS = [
  { id: "c1b1", text: "Apakah mata bayi cekung?", level: "red" },
  { id: "c1b2", text: "Apakah kulit bayi kembali sangat lambat saat dicubit (>2 detik)?", level: "red" },
  { id: "c1b3", text: "Apakah bayi tampak gelisah dan rewel terus-menerus?", level: "red" },
  { id: "c1b4", text: "Apakah mulut bayi terlihat kering?", level: "yellow" },
  { id: "c1b5", text: "Apakah kulit bayi kembali lambat saat dicubit (1-2 detik)?", level: "yellow" },
];

const C1C_QUESTIONS = [
  { id: "c1c1", text: "Apakah kuning muncul dalam 24 jam pertama setelah lahir?" },
  { id: "c1c2", text: "Apakah kuning terlihat sampai di tangan dan kaki bayi?" },
  { id: "c1c3", text: "Apakah tinja bayi berwarna pucat / putih?" },
];

const C1D_QUESTIONS = [
  { id: "c1d1", text: "Apakah ada luka atau retakan di puting susu ibu?", level: "yellow" },
  { id: "c1d2", text: "Apakah bayi tampak tidak menempel dengan benar ke payudara?", level: "yellow" },
  { id: "c1d3", text: "Apakah bayi diberi minum selain ASI (susu formula, air putih, dll)?", level: "yellow" },
  { id: "c1d4", text: "Apakah berat badan bayi saat ini jauh lebih rendah dari berat lahir?", level: "red" },
  { id: "c1d5", text: "Apakah bayi terlihat tidak puas setelah menyusu / menangis terus?", level: "yellow" },
];

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

function ProgressBar({ current, total }) {
  return (
    <div className="w-full bg-green-100 rounded-full h-2 mb-6">
      <motion.div
        className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(current / total) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

function StepChip({ label, active, done }) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
        done
          ? "bg-green-500 text-white border-green-500"
          : active
          ? "bg-white text-green-700 border-green-400 shadow-sm"
          : "bg-transparent text-gray-400 border-gray-200"
      }`}
    >
      {done ? <RiCheckLine className="inline w-3 h-3" /> : null} {label}
    </div>
  );
}

function YesNoCard({ question, value, onChange, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3"
    >
      <p className="text-sm text-gray-700 font-medium leading-relaxed">{question.text}</p>
      <div className="flex gap-3">
        <button
          onClick={() => onChange(question.id, true)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            value === true
              ? "bg-red-500 text-white border-red-500 shadow-md"
              : "bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500"
          }`}
        >
          <RiCheckLine className="w-4 h-4" /> Ya
        </button>
        <button
          onClick={() => onChange(question.id, false)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            value === false
              ? "bg-green-500 text-white border-green-500 shadow-md"
              : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-500"
          }`}
        >
          <RiCloseLine className="w-4 h-4" /> Tidak
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CekKesehatan() {
  const [step, setStep] = useState(0); // 0=front, 1=input, 2=c1a, 3=c1b, 4=c1c, 5=c1d, 6=result, 7=2m5y-soon
  const [direction, setDirection] = useState(1);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("lt2m"); // "lt2m" | "2m5y"
  const [ageRedirectAlert, setAgeRedirectAlert] = useState(null); // null | { type, message }

  // Input data
  const [gender, setGender] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [bbLahir, setBbLahir] = useState("");
  const [bbSekarang, setBbSekarang] = useState("");
  const [tbSekarang, setTbSekarang] = useState("");
  const [ageResult, setAgeResult] = useState(null); // { days, months }
  const [statusGizi, setStatusGizi] = useState(null);
  const [hasDiare, setHasDiare] = useState(null);
  const [hasKuning, setHasKuning] = useState(null);

  // Answers
  const [c1aAnswers, setC1aAnswers] = useState({});
  const [c1bAnswers, setC1bAnswers] = useState({});
  const [c1cAnswers, setC1cAnswers] = useState({});
  const [c1dAnswers, setC1dAnswers] = useState({});

  const topRef = useRef(null);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const goTo = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    setTimeout(scrollToTop, 80);
  };

  // Auto-calc age + age group validation
  const calcAge = (currentGroup) => {
    if (!tglLahir) return;
    const [d, m, y] = tglLahir.split("/").map(Number);
    if (!d || !m || !y || y < 2000) return;
    const birth = new Date(y, m - 1, d);
    const now = new Date();
    const diffMs = now - birth;
    if (diffMs < 0) return;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = days / 30.44;
    setAgeResult({ days, months });

    // Age group mismatch detection
    const isLt2m = days < 60;          // 0 – 59 hari
    const isGt5y = days >= 1825;       // > 5 tahun

    if (isGt5y) {
      setSelectedAgeGroup("2m5y");
      setAgeRedirectAlert({
        type: "outOfRange",
        message: `Usia anak ${days} hari (±${(months / 12).toFixed(1)} tahun). Sistem ini dirancang untuk anak usia 2 bulan – 5 tahun. Anda dapat melanjutkan pemeriksaan ini, namun tingkat relevansinya mungkin kurang optimal.`,
      });
    } else if (currentGroup === "lt2m" && !isLt2m) {
      setSelectedAgeGroup("2m5y");
      setAgeRedirectAlert({
        type: "switched",
        message: `Usia anak ${days} hari (${months.toFixed(1)} bulan), termasuk kelompok 2 bulan – 5 tahun. Alur pemeriksaan otomatis disesuaikan.`,
      });
    } else if (currentGroup === "2m5y" && isLt2m) {
      setSelectedAgeGroup("lt2m");
      setAgeRedirectAlert({
        type: "switched",
        message: `Usia anak ${days} hari (${months.toFixed(1)} bulan), termasuk kelompok kurang dari 2 bulan. Alur pemeriksaan otomatis disesuaikan.`,
      });
    } else {
      setAgeRedirectAlert(null);
    }

    if (bbSekarang && gender) {
      const sg = calcStatusGizi(gender, months, parseFloat(bbSekarang));
      setStatusGizi(sg);
    }
  };

  useEffect(() => {
    if (tglLahir && bbSekarang && gender && tglLahir.length === 10) {
      calcAge(selectedAgeGroup);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tglLahir, bbSekarang, gender]);

  const updateAnswer = (setter) => (id, val) => setter((prev) => ({ ...prev, [id]: val }));

  // ─── RESULT LOGIC ───────────────────────────────────────────────────────
  const computeResult = () => {
    const c1aRed = C1A_QUESTIONS.some((q) => c1aAnswers[q.id] === true);
    const c1bRedQs = C1B_QUESTIONS.filter((q) => q.level === "red");
    const c1bRed = hasDiare && c1bRedQs.some((q) => c1bAnswers[q.id] === true);
    const c1bYellow =
      hasDiare &&
      !c1bRed &&
      C1B_QUESTIONS.filter((q) => q.level === "yellow").some((q) => c1bAnswers[q.id] === true);
    const c1cRed = hasKuning && C1C_QUESTIONS.some((q) => c1cAnswers[q.id] === true);
    const c1dRed = c1dAnswers["c1d4"] === true;
    const c1dYellow =
      !c1dRed &&
      ["c1d1", "c1d2", "c1d3", "c1d5"].some((id) => c1dAnswers[id] === true);
    const giziRed = statusGizi && (statusGizi.level === -3 || statusGizi.level === 3);

    const urgent = c1aRed || c1bRed || c1cRed || c1dRed || giziRed;

    const reasons = [];
    if (c1aRed) {
      const positive = C1A_QUESTIONS.filter((q) => c1aAnswers[q.id] === true);
      reasons.push({
        section: "Tanda Bahaya / Infeksi Bakteri",
        items: positive.map((q) => q.text),
        level: "red",
      });
    }
    if (c1bRed) {
      const positive = c1bRedQs.filter((q) => c1bAnswers[q.id] === true);
      reasons.push({
        section: "Diare dengan Dehidrasi Berat",
        items: positive.map((q) => q.text),
        level: "red",
      });
    }
    if (c1bYellow) {
      const positive = C1B_QUESTIONS.filter(
        (q) => q.level === "yellow" && c1bAnswers[q.id] === true
      );
      reasons.push({
        section: "Diare dengan Dehidrasi Ringan",
        items: positive.map((q) => q.text),
        level: "yellow",
      });
    }
    if (c1cRed) {
      const positive = C1C_QUESTIONS.filter((q) => c1cAnswers[q.id] === true);
      reasons.push({
        section: "Bayi Kuning (Perlu Evaluasi)",
        items: positive.map((q) => q.text),
        level: "red",
      });
    }
    if (c1dRed) {
      reasons.push({
        section: "Berat Badan Rendah",
        items: ["Berat badan bayi jauh lebih rendah dari berat lahir"],
        level: "red",
      });
    }
    if (c1dYellow) {
      const positive = ["c1d1", "c1d2", "c1d3", "c1d5"].filter(
        (id) => c1dAnswers[id] === true
      );
      reasons.push({
        section: "Masalah Pemberian ASI",
        items: C1D_QUESTIONS.filter((q) => positive.includes(q.id)).map((q) => q.text),
        level: "yellow",
      });
    }
    if (giziRed) {
      reasons.push({
        section: "Status Gizi",
        items: [`Status gizi: ${statusGizi.label}`],
        level: "red",
      });
    }

    return { urgent, reasons };
  };

  const STEPS = ["Front", "Data", "C1a", "C1b", "C1c", "C1d", "Hasil"];
  const STEP_LABELS = ["Mulai", "Data Anak", "Tanda Bahaya", "Diare", "Kuning", "ASI & BB", "Hasil"];

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={topRef}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/" className="text-green-700 hover:text-green-500 transition-colors">
            <RiHomeLine className="w-5 h-5" />
          </a>
          <div className="h-4 w-px bg-green-200" />
          <div className="flex items-center gap-2">
            <RiHeartPulseLine className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800 text-sm">SengkolCare</span>
          </div>
          <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
            {STEP_LABELS.map((label, i) => (
              <StepChip key={label} label={label} active={step === i} done={step > i} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <ProgressBar current={step} total={STEPS.length - 1} />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══════ STEP 0: FRONT PAGE ═══════════════════════════════════ */}
          {step === 0 && (
            <motion.div
              key="front"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {/* Hero card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-700 to-emerald-500 p-8 mt-2 shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    <RiShieldCheckLine className="w-3.5 h-3.5" />
                    Berbasis MTBS Kemenkes RI
                  </div>
                  <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                    SengkolCare
                  </h1>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Alat bantu skrining kesehatan anak berdasarkan panduan Manajemen Terpadu
                    Balita Sakit (MTBS) Kementerian Kesehatan RI.
                  </p>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { icon: RiScales3Line, title: "Status Gizi", desc: "Evaluasi BB/U otomatis" },
                  { icon: RiFirstAidKitLine, title: "Deteksi Dini", desc: "Tanda bahaya & penyakit" },
                  { icon: RiMedicineBottleLine, title: "Rekomendasi", desc: "Perlu rujukan atau tidak" },
                  { icon: RiParentLine, title: "Edukasi", desc: "Tips perawatan di rumah" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-green-50"
                  >
                    <item.icon className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <RiAlertLine className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Penting:</strong> Alat ini hanya sebagai panduan awal, bukan
                  pengganti diagnosis dokter. Segera konsultasikan ke tenaga kesehatan untuk
                  penanganan lebih lanjut.
                </p>
              </div>

              {/* Age selector */}
              <p className="text-xs text-gray-400 text-center mt-6 mb-3 font-medium uppercase tracking-wider">
                Pilih kelompok usia anak
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setSelectedAgeGroup("lt2m"); setAgeRedirectAlert(null); goTo(1); }}
                  className="bg-gradient-to-br from-green-600 to-emerald-500 text-white rounded-2xl p-5 text-left shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <RiHeartLine className="w-7 h-7 mb-3 opacity-90" />
                  <p className="font-bold text-base">Kurang dari</p>
                  <p className="font-bold text-lg">2 Bulan</p>
                  <p className="text-xs text-green-100 mt-1">0 – 59 hari</p>
                </button>
                <button
                  onClick={() => { setSelectedAgeGroup("2m5y"); setAgeRedirectAlert(null); goTo(1); }}
                  className="bg-gradient-to-br from-teal-600 to-cyan-500 text-white rounded-2xl p-5 text-left shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Beta
                  </div>
                  <RiUserLine className="w-7 h-7 mb-3 opacity-90" />
                  <p className="font-bold text-base">2 Bulan –</p>
                  <p className="font-bold text-lg">5 Tahun</p>
                  <p className="text-xs text-teal-100 mt-1">2 – 60 bulan</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 1: INPUT DATA ANAK ═══════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="input"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-2"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-1">Data Anak</h2>
              <p className="text-sm text-gray-400 mb-4">
                Masukkan data bayi untuk menghitung usia dan status gizi secara otomatis.
              </p>

              {/* Redirect / Out-of-range alert */}
              <AnimatePresence>
                {ageRedirectAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 rounded-2xl p-4 flex gap-3 items-start border ${
                      ageRedirectAlert.type === "outOfRange"
                        ? "bg-amber-50 border-amber-300"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <RiInformationLine
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        ageRedirectAlert.type === "outOfRange"
                          ? "text-amber-500"
                          : "text-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                          ageRedirectAlert.type === "outOfRange"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      >
                        {ageRedirectAlert.type === "switched"
                          ? "Alur Disesuaikan Otomatis"
                          : "Di Luar Rentang Usia Optimal"}
                      </p>
                      <p
                        className={`text-xs leading-relaxed ${
                          ageRedirectAlert.type === "outOfRange"
                            ? "text-amber-700"
                            : "text-blue-700"
                        }`}
                      >
                        {ageRedirectAlert.message}
                      </p>
                    </div>
                    <button
                      onClick={() => setAgeRedirectAlert(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gender */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Jenis Kelamin
                </label>
                <div className="flex gap-3">
                  {[
                    { val: "L", label: "Laki-laki" },
                    { val: "P", label: "Perempuan" },
                  ].map((g) => (
                    <button
                      key={g.val}
                      onClick={() => setGender(g.val)}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-sm border-2 transition-all duration-200 ${
                        gender === g.val
                          ? "bg-green-600 text-white border-green-600 shadow-md"
                          : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal Lahir */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiCalendarLine className="inline w-3.5 h-3.5 mr-1" />
                  Tanggal Lahir (DD/MM/YYYY)
                </label>
                <input
                  type="text"
                  placeholder="cth: 15/05/2026"
                  value={tglLahir}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^\d/]/g, "");
                    if (v.length === 2 && tglLahir.length === 1) v += "/";
                    if (v.length === 5 && tglLahir.length === 4) v += "/";
                    if (v.length <= 10) setTglLahir(v);
                  }}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                />
                {ageResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2"
                  >
                    <RiCheckLine className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700 font-medium">
                      Usia: <strong>{ageResult.days} hari</strong> (
                      {ageResult.months.toFixed(1)} bulan)
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Berat Badan Lahir */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiScales3Line className="inline w-3.5 h-3.5 mr-1" />
                  Berat Badan Lahir (kg) — opsional
                </label>
                <input
                  type="number"
                  placeholder="cth: 3.2"
                  value={bbLahir}
                  onChange={(e) => setBbLahir(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                />
              </div>

              {/* Berat Badan Sekarang */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiScales3Line className="inline w-3.5 h-3.5 mr-1" />
                  Berat Badan Sekarang (kg) *
                </label>
                <input
                  type="number"
                  placeholder="cth: 4.5"
                  value={bbSekarang}
                  onChange={(e) => setBbSekarang(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                />
              </div>

              {/* Tinggi Badan */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiRulerLine className="inline w-3.5 h-3.5 mr-1" />
                  Panjang Badan Sekarang (cm) *
                </label>
                <input
                  type="number"
                  placeholder="cth: 54"
                  value={tbSekarang}
                  onChange={(e) => setTbSekarang(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                />
              </div>

              {/* Status Gizi Card */}
              <AnimatePresence>
                {statusGizi && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`mb-5 rounded-2xl p-4 border-2 ${
                      statusGizi.color === "green"
                        ? "bg-green-50 border-green-300"
                        : statusGizi.color === "orange"
                        ? "bg-orange-50 border-orange-300"
                        : statusGizi.color === "yellow"
                        ? "bg-yellow-50 border-yellow-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          statusGizi.color === "green"
                            ? "bg-green-500"
                            : statusGizi.color === "orange"
                            ? "bg-orange-500"
                            : statusGizi.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        <RiScales3Line className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Status Gizi (BB/U)</p>
                        <p
                          className={`text-sm font-bold ${
                            statusGizi.color === "green"
                              ? "text-green-700"
                              : statusGizi.color === "orange"
                              ? "text-orange-700"
                              : statusGizi.color === "yellow"
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        >
                          {statusGizi.label}
                        </p>
                      </div>
                    </div>
                    {/* Simple visual bar */}
                    <div className="mt-3 relative">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="flex-1 bg-red-400" />
                        <div className="flex-1 bg-orange-400" />
                        <div className="flex-1 bg-green-400" />
                        <div className="flex-1 bg-yellow-400" />
                        <div className="flex-1 bg-red-500" />
                      </div>
                      <div
                        className="absolute -top-1 w-3 h-4 bg-gray-800 rounded-sm transform -translate-x-1/2 transition-all duration-500"
                        style={{
                          left: `${
                            statusGizi.level === -3
                              ? 10
                              : statusGizi.level === -2
                              ? 30
                              : statusGizi.level === 0
                              ? 50
                              : statusGizi.level === 2
                              ? 70
                              : 90
                          }%`,
                        }}
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                        <span>Buruk</span>
                        <span>Kurang</span>
                        <span>Baik</span>
                        <span>Lebih</span>
                        <span>Obesitas</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Diare & Kuning screening */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <RiInformationLine className="w-4 h-4 text-green-500" />
                  Kondisi Tambahan
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Apakah bayi mengalami diare?</p>
                    <div className="flex gap-2">
                      {[{ val: true, label: "Ya" }, { val: false, label: "Tidak" }].map((opt) => (
                        <button
                          key={String(opt.val)}
                          onClick={() => setHasDiare(opt.val)}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                            hasDiare === opt.val
                              ? opt.val
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-green-500 text-white border-green-500"
                              : "bg-white text-gray-500 border-gray-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Apakah kulit/mata bayi terlihat kuning?
                    </p>
                    <div className="flex gap-2">
                      {[{ val: true, label: "Ya" }, { val: false, label: "Tidak" }].map((opt) => (
                        <button
                          key={String(opt.val)}
                          onClick={() => setHasKuning(opt.val)}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                            hasKuning === opt.val
                              ? opt.val
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-green-500 text-white border-green-500"
                              : "bg-white text-gray-500 border-gray-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goTo(0)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(selectedAgeGroup === "lt2m" ? 2 : 7)}
                  disabled={!gender || !tglLahir || !bbSekarang || !tbSekarang || hasDiare === null || hasKuning === null}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200"
                >
                  Lanjut ke Pemeriksaan <RiArrowRightLine className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 2: C1a ════════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="c1a"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-2"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <RiAlertLine className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                    Modul C1a
                  </p>
                  <h2 className="text-xl font-bold text-gray-800">Tanda Bahaya &amp; Infeksi</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Jawab Ya atau Tidak untuk setiap pertanyaan di bawah.
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {C1A_QUESTIONS.map((q, i) => (
                  <YesNoCard
                    key={q.id}
                    question={q}
                    value={c1aAnswers[q.id]}
                    onChange={updateAnswer(setC1aAnswers)}
                    index={i}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => goTo(1)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(hasDiare ? 3 : hasKuning ? 4 : 5)}
                  disabled={C1A_QUESTIONS.some((q) => c1aAnswers[q.id] === undefined)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  Lanjutkan <RiArrowRightLine className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 3: C1b ════════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="c1b"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-2"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <RiDropLine className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                    Modul C1b
                  </p>
                  <h2 className="text-xl font-bold text-gray-800">Diare &amp; Dehidrasi</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Bayi Anda tercatat mengalami diare. Jawab pertanyaan berikut.
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {C1B_QUESTIONS.map((q, i) => (
                  <div key={q.id} className="relative">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                        q.level === "red" ? "bg-red-400" : "bg-yellow-400"
                      }`}
                    />
                    <div className="pl-3">
                      <YesNoCard
                        question={q}
                        value={c1bAnswers[q.id]}
                        onChange={updateAnswer(setC1bAnswers)}
                        index={i}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => goTo(2)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(hasKuning ? 4 : 5)}
                  disabled={C1B_QUESTIONS.some((q) => c1bAnswers[q.id] === undefined)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  Lanjutkan <RiArrowRightLine className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 4: C1c ════════════════════════════════════════════ */}
          {step === 4 && (
            <motion.div
              key="c1c"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-2"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <RiSunLine className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                    Modul C1c
                  </p>
                  <h2 className="text-xl font-bold text-gray-800">Bayi Kuning</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Bayi Anda tercatat memiliki tanda kuning. Jawab pertanyaan berikut.
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {C1C_QUESTIONS.map((q, i) => (
                  <YesNoCard
                    key={q.id}
                    question={q}
                    value={c1cAnswers[q.id]}
                    onChange={updateAnswer(setC1cAnswers)}
                    index={i}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => goTo(hasDiare ? 3 : 2)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(5)}
                  disabled={C1C_QUESTIONS.some((q) => c1cAnswers[q.id] === undefined)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  Lanjutkan <RiArrowRightLine className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 5: C1d ════════════════════════════════════════════ */}
          {step === 5 && (
            <motion.div
              key="c1d"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-2"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <RiParentLine className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Modul C1d
                  </p>
                  <h2 className="text-xl font-bold text-gray-800">Pemberian ASI &amp; BB</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Pertanyaan seputar pemberian ASI dan berat badan bayi.
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {C1D_QUESTIONS.map((q, i) => (
                  <div key={q.id} className="relative">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                        q.level === "red" ? "bg-red-400" : "bg-yellow-400"
                      }`}
                    />
                    <div className="pl-3">
                      <YesNoCard
                        question={q}
                        value={c1dAnswers[q.id]}
                        onChange={updateAnswer(setC1dAnswers)}
                        index={i}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => goTo(hasKuning ? 4 : hasDiare ? 3 : 2)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(6)}
                  disabled={C1D_QUESTIONS.some((q) => c1dAnswers[q.id] === undefined)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  Lihat Hasil <RiArrowRightLine className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 7: 2m5y COMING SOON ══════════════════════════════ */}
          {step === 7 && (
            <motion.div
              key="2m5y-soon"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-2"
            >
              <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-500 p-8 shadow-xl relative overflow-hidden mb-5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <RiUserLine className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider mb-1">
                    Alur 2 Bulan – 5 Tahun
                  </p>
                  <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                    Segera Hadir
                  </h2>
                  <p className="text-teal-100 text-sm leading-relaxed">
                    Modul pemeriksaan untuk kelompok usia ini sedang dalam pengembangan dan akan segera tersedia.
                  </p>
                </div>
              </div>

              {ageRedirectAlert && (
                <div className={`mb-4 rounded-2xl p-4 flex gap-3 items-start border ${
                  ageRedirectAlert.type === "outOfRange"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-blue-50 border-blue-200"
                }`}>
                  <RiInformationLine className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    ageRedirectAlert.type === "outOfRange" ? "text-amber-500" : "text-blue-500"
                  }`} />
                  <p className={`text-xs leading-relaxed ${
                    ageRedirectAlert.type === "outOfRange" ? "text-amber-700" : "text-blue-700"
                  }`}>
                    {ageRedirectAlert.message}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Sambil menunggu, kamu bisa:
                </p>
                <div className="space-y-3">
                  {[
                    { icon: RiHospitalLine, text: "Kunjungi Puskesmas atau Posyandu terdekat untuk pemeriksaan langsung oleh tenaga kesehatan." },
                    { icon: RiFirstAidKitLine, text: "Pantau tanda bahaya umum seperti demam tinggi, sesak napas, atau anak tidak mau makan/minum." },
                    { icon: RiParentLine, text: "Konsultasikan kekhawatiran Anda ke dokter atau bidan desa." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goTo(1)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setStep(0);
                    setGender(""); setTglLahir(""); setBbLahir(""); setBbSekarang(""); setTbSekarang("");
                    setAgeResult(null); setStatusGizi(null); setHasDiare(null); setHasKuning(null);
                    setC1aAnswers({}); setC1bAnswers({}); setC1cAnswers({}); setC1dAnswers({});
                    setAgeRedirectAlert(null);
                    scrollToTop();
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <RiRefreshLine className="w-4 h-4" /> Mulai Ulang
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 6: RESULT ═════════════════════════════════════════ */}
          {step === 6 && (
            <ResultPage
              result={computeResult()}
              onReset={() => {
                setStep(0);
                setGender(""); setTglLahir(""); setBbLahir(""); setBbSekarang(""); setTbSekarang("");
                setAgeResult(null); setStatusGizi(null); setHasDiare(null); setHasKuning(null);
                setC1aAnswers({}); setC1bAnswers({}); setC1cAnswers({}); setC1dAnswers({});
                setAgeRedirectAlert(null);
                scrollToTop();
              }}
              onBack={() => goTo(5)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── RESULT PAGE ─────────────────────────────────────────────────────────────
function ResultPage({ result, onReset, onBack }) {
  const { urgent, reasons } = result;

  const edukasiList = [
    "Pastikan bayi mendapat ASI eksklusif setiap 2–3 jam sekali.",
    "Pantau berat badan bayi secara rutin di Posyandu setiap bulan.",
    "Jaga kebersihan tali pusat dengan kain kering yang bersih.",
    "Pastikan bayi tidur telentang untuk mencegah risiko SIDS.",
    "Segera bawa ke Puskesmas jika bayi demam, sesak, atau tidak mau menyusu.",
    "Cuci tangan sebelum menyentuh atau menyusui bayi.",
  ];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-2"
    >
      {/* Main verdict */}
      <div
        className={`rounded-3xl p-6 mb-4 ${
          urgent
            ? "bg-gradient-to-br from-red-600 to-rose-500"
            : "bg-gradient-to-br from-green-600 to-emerald-500"
        } shadow-xl relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            {urgent ? (
              <RiHospitalLine className="w-7 h-7 text-white" />
            ) : (
              <RiShieldCheckLine className="w-7 h-7 text-white" />
            )}
          </div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
            {urgent ? "Opsi 2 — Perlu Tindakan" : "Opsi 1 — Aman"}
          </p>
          <h2 className="text-2xl font-bold text-white leading-tight mb-2">
            {urgent
              ? "Segera Bawa ke Fasilitas Kesehatan"
              : "Bayi Dapat Dirawat di Rumah"}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            {urgent
              ? "Berdasarkan jawaban Anda, bayi memerlukan penanganan medis segera. Jangan tunda."
              : "Tidak ditemukan tanda bahaya serius. Tetap pantau kondisi bayi dan lakukan perawatan di rumah."}
          </p>
        </div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Ringkasan Temuan
          </p>
          <div className="space-y-2">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className={`bg-white rounded-2xl border-l-4 ${
                  r.level === "red" ? "border-red-400" : "border-yellow-400"
                } p-4 shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      r.level === "red" ? "bg-red-100" : "bg-yellow-100"
                    }`}
                  >
                    <RiAlertLine
                      className={`w-3 h-3 ${
                        r.level === "red" ? "text-red-500" : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      r.level === "red" ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {r.section}
                  </p>
                </div>
                <ul className="space-y-1">
                  {r.items.map((item, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                      <RiCheckLine className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No findings */}
      {reasons.length === 0 && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <RiShieldCheckLine className="w-6 h-6 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">
            Tidak ditemukan tanda bahaya atau masalah serius pada pemeriksaan ini.
          </p>
        </div>
      )}

      {/* Edukasi */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Edukasi &amp; Tips Perawatan
        </p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          {edukasiList.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-green-700">{i + 1}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <RiAlertLine className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Hasil ini bukan diagnosis medis. Selalu konsultasikan kondisi bayi kepada dokter
          atau tenaga kesehatan terdekat untuk penanganan yang tepat.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
        >
          <RiArrowLeftLine className="w-5 h-5" />
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <RiRefreshLine className="w-4 h-4" /> Mulai Pemeriksaan Baru
        </button>
      </div>
    </motion.div>
  );
}
