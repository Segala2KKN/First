"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiHeartPulseLine, RiArrowRightLine, RiArrowLeftLine, RiCheckLine, RiCloseLine,
  RiAlertLine, RiInformationLine, RiShieldCheckLine, RiUserLine, RiScales3Line,
  RiRulerLine, RiCalendarLine, RiHospitalLine, RiHomeLine, RiRefreshLine,
  RiDropLine, RiSunLine, RiMedicineBottleLine, RiParentLine, RiHeartLine,
  RiFirstAidKitLine, RiThermometerLine, RiMusicLine, RiSeedlingLine, RiNurseLine,
} from "react-icons/ri";

// ─── WHO BB/U REFERENCE TABLES ───────────────────────────────────────────────
// [ageMonths, -3SD, -2SD, median, +2SD, +3SD]
const WHO_BBU_BOYS = [
  [0,2.1,2.5,3.3,4.4,5.0],[1,2.9,3.4,4.5,5.8,6.6],[2,3.8,4.3,5.6,7.1,8.0],
  [3,4.4,5.0,6.4,8.0,9.0],[4,4.9,5.6,7.0,8.7,9.7],[5,5.3,6.0,7.5,9.3,10.4],
  [6,5.7,6.4,7.9,9.8,10.9],[9,6.6,7.4,9.2,11.4,12.7],[12,7.1,7.8,9.6,11.8,13.0],
  [18,8.1,9.1,11.3,14.0,15.6],[24,9.0,10.2,12.2,14.4,15.9],[30,9.8,11.0,13.3,15.8,17.5],
  [36,10.2,11.6,14.3,17.9,20.1],[42,10.9,12.4,15.3,19.3,21.9],[48,11.5,13.0,16.3,20.7,23.5],
  [54,12.0,13.6,17.3,22.2,25.3],[60,12.5,14.2,18.3,23.6,27.1],
];
const WHO_BBU_GIRLS = [
  [0,2.0,2.4,3.2,4.2,4.8],[1,2.7,3.2,4.2,5.5,6.2],[2,3.4,3.9,5.1,6.6,7.5],
  [3,4.0,4.5,5.8,7.4,8.4],[4,4.4,5.0,6.4,8.2,9.3],[5,4.8,5.4,6.9,8.8,9.9],
  [6,5.3,5.9,7.3,9.3,10.4],[9,6.1,6.8,8.5,10.9,12.2],[12,6.8,7.5,9.2,11.8,13.2],
  [18,7.8,8.7,10.9,14.1,15.9],[24,8.7,9.7,11.5,14.2,15.8],[30,9.5,10.7,12.7,15.7,17.5],
  [36,9.9,11.2,14.1,18.2,20.8],[42,10.6,12.0,15.1,19.6,22.6],[48,11.2,12.6,16.1,21.5,25.0],
  [54,11.7,13.2,17.1,23.0,27.3],[60,12.0,13.7,18.2,25.6,30.4],
];

function interpolateRow(table, ageMonths) {
  const m = Math.min(Math.max(Math.round(ageMonths), 0), 60);
  let lower = table[0], upper = table[table.length - 1];
  for (let i = 0; i < table.length; i++) {
    if (table[i][0] <= m) lower = table[i];
    if (table[i][0] >= m) { upper = table[i]; break; }
  }
  if (lower[0] === upper[0]) return lower;
  const t = (m - lower[0]) / (upper[0] - lower[0]);
  return lower.map((v, i) => (i === 0 ? m : v + t * (upper[i] - v)));
}

function getZScoreCategory(weight, row) {
  const [, sd3neg, sd2neg, , sd2pos, sd3pos] = row;
  if (weight < sd3neg) return { label: "Gizi Buruk", color: "red", level: -3 };
  if (weight < sd2neg) return { label: "Gizi Kurang", color: "orange", level: -2 };
  if (weight <= sd2pos) return { label: "Gizi Baik", color: "green", level: 0 };
  if (weight <= sd3pos) return { label: "Berisiko Gizi Lebih", color: "yellow", level: 2 };
  return { label: "Gizi Lebih / Obesitas", color: "red", level: 3 };
}

function calcStatusGizi(gender, ageMonths, weight) {
  const table = gender === "L" ? WHO_BBU_BOYS : WHO_BBU_GIRLS;
  const row = interpolateRow(table, ageMonths);
  return getZScoreCategory(weight, row);
}

// ─── QUESTION DATA: lt2m ─────────────────────────────────────────────────────
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

// ─── QUESTION DATA: 2m5y ─────────────────────────────────────────────────────
const C2A_QUESTIONS = [
  { id: "c2a1", text: "Apakah anak tidak bisa minum/menyusu sama sekali?", level: "red" },
  { id: "c2a2", text: "Apakah anak memuntahkan semua yang diminum/dimakan?", level: "red" },
  { id: "c2a3", text: "Apakah anak kejang selama sakit ini?", level: "red" },
  { id: "c2a4", text: "Apakah anak tidak sadar, tidak merespons, atau sangat sulit dibangunkan?", level: "red" },
  { id: "c2a5", text: "Apakah anak sangat gelisah/rewel dan tidak bisa ditenangkan sama sekali?", level: "red" },
  { id: "c2a6", text: "Apakah anak tampak sangat sesak, menolak berbaring, atau mencari posisi napas tertentu?", level: "red" },
  { id: "c2a7", text: "Apakah bibir/kulit anak tampak kebiruan atau sangat pucat?", level: "red" },
  { id: "c2a8", text: "Apakah kulit anak terlihat seperti pola marmer/bercak-bercak?", level: "red" },
];
const C2B_QUESTIONS = [
  { id: "c2b1", text: "Apakah batuk disertai dengan demam >37,5°C?", level: "red" },
  { id: "c2b2", text: "Apakah napas anak terlihat cepat?", level: "red" },
  { id: "c2b3", text: "Apakah terlihat tarikan kuat di sela iga/bawah dada saat bernapas?", level: "red" },
  { id: "c2b4", text: "Apakah terdengar bunyi \"ngik-ngik\" (wheezing) saat bernapas?", level: "red" },
  { id: "c2b5", text: "Apakah anak batuk sudah ≥2 minggu?", level: "red" },
];
const C2C_QUESTIONS = [
  { id: "c2c1", text: "Apakah diare >24 jam?", level: "red" },
  { id: "c2c2", text: "Apakah ada darah dalam tinja?", level: "red" },
  { id: "c2c3", text: "Apakah diare disertai dengan demam >37,5°C?", level: "red" },
  { id: "c2c4", text: "Apakah anak tampak tidak sadar atau sangat lemah dibandingkan biasanya?", level: "red" },
  { id: "c2c5", text: "Apakah mata anak terlihat cekung?", level: "red" },
  { id: "c2c6", text: "Saat dicoba diberi minum/ASI, apakah anak menolak sama sekali?", level: "red" },
  { id: "c2c7", text: "Apakah disertai dengan nyeri perut hebat?", level: "red" },
  { id: "c2c8", text: "Apakah anak menjadi terlalu rewel dan sulit ditenangkan?", level: "yellow" },
  { id: "c2c9", text: "Apakah anak menjadi terlalu haus dan minum dengan lahap?", level: "yellow" },
];
const C2D_QUESTIONS = [
  { id: "c2d1", text: "Apakah demam sudah >7 hari?", level: "red" },
  { id: "c2d2", text: "Apakah demam melebihi 39°C?", level: "red" },
  { id: "c2d3", text: "Apakah leher anak terasa kaku (menolak menunduk/nyeri saat leher ditekuk)?", level: "red" },
  { id: "c2d4", text: "Apakah ada riwayat bepergian ke daerah endemis malaria dalam 2 minggu terakhir? (Bilelando, Mertak, Kidang, Prabu, Kuta, Mekar Sari, Selong Belanak)", level: "red" },
  { id: "c2d5", text: "Apakah muncul ruam kemerahan menyeluruh disertai batuk/pilek/mata merah (curiga campak)?", level: "red" },
  { id: "c2d6", text: "Apakah terdapat tanda DBD? (tangan/kaki dingin & pucat, nadi lemah/cepat, sesak, muntah/BAB darah, nyeri perut hebat, gelisah, muncul bercak)", level: "red" },
  { id: "c2d7", text: "Apakah demam tidak turun dengan pemberian anti-demam?", level: "yellow" },
];
const C2E_QUESTIONS = [
  { id: "c2e1", text: "Apakah ada nyeri telinga atau anak sering menarik-narik telinganya?", level: "red" },
  { id: "c2e2", text: "Apakah keluar cairan/nanah dari telinga?", level: "red" },
  { id: "c2e3", text: "Apakah ada bengkak nyeri di belakang telinga?", level: "red" },
];
const C2F_QUESTIONS = [
  { id: "c2f1", text: "Apakah ada bengkak di kedua kaki/tangan?", level: "red" },
  { id: "c2f2", text: "Apakah anak terlihat sangat kurus, tulang terlihat jelas?", level: "red" },
  { id: "c2f3", text: "Apakah anak sangat lemah, tidak mau makan sama sekali?", level: "red" },
  { id: "c2f4", text: "Apakah anak terlihat jauh lebih pendek dibanding anak seusianya?", level: "red" },
  { id: "c2f5", text: "Apakah perkembangan anak (bicara, gerak, sosial) tertinggal jauh dibanding anak seusianya?", level: "red" },
];

// ─── EDUKASI DATA ────────────────────────────────────────────────────────────
const EDUKASI_LT2M = [
  "Pastikan bayi mendapat ASI eksklusif setiap 2–3 jam sekali.",
  "Pantau berat badan bayi secara rutin di Posyandu setiap bulan.",
  "Jaga kebersihan tali pusat dengan kain kering yang bersih.",
  "Pastikan bayi tidur telentang untuk mencegah risiko SIDS.",
  "Segera bawa ke Puskesmas jika bayi demam, sesak, atau tidak mau menyusu.",
  "Cuci tangan sebelum menyentuh atau menyusui bayi.",
];
const EDUKASI_2M5Y_BATUK = [
  "Hitung napas anak hanya saat anak dalam keadaan tenang.",
  "Beri pelega tenggorokan alami yang aman (misalnya ASI untuk bayi <6 bulan).",
  "Segera kembali ke fasilitas kesehatan bila napas tampak makin cepat/berat, atau anak sulit minum.",
];
const EDUKASI_2M5Y_DIARE = [
  "Berikan cairan tambahan (oralit, ASI, air matang) sebanyak yang anak mau.",
  "Berikan tablet/syrup zinc selama 10 hari berturut-turut meskipun diare sudah berhenti.",
  "Segera kembali bila tinja bercampur darah, anak malas minum, atau muncul tanda bahaya umum.",
];
const EDUKASI_2M5Y_DEMAM = [
  "Berikan parasetamol bila demam ≥38°C sesuai anjuran, dan pastikan anak tetap minum cukup.",
  "Gunakan kelambu (terutama di daerah endemis malaria) untuk mencegah gigitan nyamuk.",
  "Segera kembali bila demam menetap lebih dari yang dijadwalkan kontrol ulang, atau bertambah parah.",
];
const EDUKASI_2M5Y_TELINGA = [
  "Keringkan telinga dengan kain/tisu bersih yang digulung menjadi sumbu — jangan gunakan cotton bud (lidi kapas).",
  "Kontrol ulang 5 hari bila diberikan pengobatan untuk infeksi telinga.",
  "Segera kembali bila muncul benjolan nyeri di belakang telinga atau demam tinggi.",
];
const EDUKASI_2M5Y_GIZI = [
  "Timbang dan ukur (BB/panjang-tinggi badan) anak secara rutin setiap bulan di Posyandu/Puskesmas.",
  "Berikan makanan sesuai kelompok usia anak, dengan porsi cukup dan gizi seimbang.",
  "Segera periksakan bila berat badan anak tidak naik, turun, atau muncul bengkak di kaki/tangan.",
];
const EDUKASI_2M5Y_UMUM = [
  "Pastikan anak mendapat imunisasi lengkap sesuai jadwal.",
  "Biasakan mencuci tangan sebelum makan dan setelah bermain.",
  "Segera bawa ke Puskesmas jika kondisi anak tidak membaik dalam 24 jam.",
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
        animate={{ width: `${Math.min((current / total) * 100, 100)}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

function StepChip({ label, active, done }) {
  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
      done ? "bg-green-500 text-white border-green-500"
      : active ? "bg-white text-green-700 border-green-400 shadow-sm"
      : "bg-transparent text-gray-400 border-gray-200"
    }`}>
      {done && <RiCheckLine className="inline w-3 h-3 mr-0.5" />}{label}
    </div>
  );
}

function YesNoCard({ question, value, onChange, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3"
    >
      <p className="text-sm text-gray-700 font-medium leading-relaxed">{question.text}</p>
      <div className="flex gap-3">
        <button onClick={() => onChange(question.id, true)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            value === true ? "bg-red-500 text-white border-red-500 shadow-md"
            : "bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500"
          }`}>
          <RiCheckLine className="w-4 h-4" /> Ya
        </button>
        <button onClick={() => onChange(question.id, false)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            value === false ? "bg-green-500 text-white border-green-500 shadow-md"
            : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-500"
          }`}>
          <RiCloseLine className="w-4 h-4" /> Tidak
        </button>
      </div>
    </motion.div>
  );
}

function ConditionalModule({ mainQ, mainVal, onMainChange, subQuestions, subAnswers, onSubChange, icon: Icon, label, accent }) {
  const allSubAnswered = mainVal !== true || subQuestions.every(q => subAnswers[q.id] !== undefined);
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${accent}`} />{mainQ}
        </p>
        <div className="flex gap-3">
          {[{ val: true, label: "Ya" }, { val: false, label: "Tidak" }].map(opt => (
            <button key={String(opt.val)} onClick={() => onMainChange(opt.val)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                mainVal === opt.val
                  ? opt.val ? "bg-red-500 text-white border-red-500" : "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-500 border-gray-200"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {mainVal === true && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2 ml-1">Pertanyaan lanjutan</p>
            <div className="space-y-3">
              {subQuestions.map((q, i) => (
                <div key={q.id} className="relative">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                    q.level === "red" ? "bg-red-400" : "bg-yellow-400"}`} />
                  <div className="pl-3">
                    <YesNoCard question={q} value={subAnswers[q.id]} onChange={onSubChange} index={i} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = "Lanjutkan" }) {
  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onBack}
        className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all">
        <RiArrowLeftLine className="w-5 h-5" />
      </button>
      <button onClick={onNext} disabled={nextDisabled}
        className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all">
        {nextLabel} <RiArrowRightLine className="w-4 h-4" />
      </button>
    </div>
  );
}

function SectionHeader({ icon: Icon, moduleLabel, title, desc, accent = "bg-red-100", iconColor = "text-red-500", labelColor = "text-red-500" }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-10 h-10 ${accent} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className={`text-xs font-semibold ${labelColor} uppercase tracking-wider`}>{moduleLabel}</p>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// Steps: 0=front, 1=input
// lt2m:  2=C1a, 3=C1b, 4=C1c, 5=C1d, 6=result-lt2m
// 2m5y:  10=C2a, 11=C2b, 12=C2c, 13=C2d, 14=C2e, 15=C2f, 16=result-2m5y
export default function CekKesehatan() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("lt2m");
  const [ageRedirectAlert, setAgeRedirectAlert] = useState(null);

  // Shared
  const [gender, setGender] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [bbLahir, setBbLahir] = useState("");
  const [bbSekarang, setBbSekarang] = useState("");
  const [tbSekarang, setTbSekarang] = useState("");
  const [ageResult, setAgeResult] = useState(null);
  const [statusGizi, setStatusGizi] = useState(null);

  // lt2m specific
  const [hasDiare, setHasDiare] = useState(null);
  const [hasKuning, setHasKuning] = useState(null);
  const [c1aAnswers, setC1aAnswers] = useState({});
  const [c1bAnswers, setC1bAnswers] = useState({});
  const [c1cAnswers, setC1cAnswers] = useState({});
  const [c1dAnswers, setC1dAnswers] = useState({});

  // 2m5y specific
  const [hasBatuk, setHasBatuk] = useState(null);
  const [hasDiare2, setHasDiare2] = useState(null);
  const [hasDemam, setHasDemam] = useState(null);
  const [hasTelinga, setHasTelinga] = useState(null);
  const [hasGiziMasalah, setHasGiziMasalah] = useState(null);
  const [c2aAnswers, setC2aAnswers] = useState({});
  const [c2bAnswers, setC2bAnswers] = useState({});
  const [c2cAnswers, setC2cAnswers] = useState({});
  const [c2dAnswers, setC2dAnswers] = useState({});
  const [c2eAnswers, setC2eAnswers] = useState({});
  const [c2fAnswers, setC2fAnswers] = useState({});

  const topRef = useRef(null);
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const goTo = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    setTimeout(scrollToTop, 80);
  };

  const resetAll = () => {
    setStep(0); setDirection(1); setAgeRedirectAlert(null);
    setGender(""); setTglLahir(""); setBbLahir(""); setBbSekarang(""); setTbSekarang("");
    setAgeResult(null); setStatusGizi(null);
    setHasDiare(null); setHasKuning(null);
    setC1aAnswers({}); setC1bAnswers({}); setC1cAnswers({}); setC1dAnswers({});
    setHasBatuk(null); setHasDiare2(null); setHasDemam(null); setHasTelinga(null); setHasGiziMasalah(null);
    setC2aAnswers({}); setC2bAnswers({}); setC2cAnswers({}); setC2dAnswers({}); setC2eAnswers({}); setC2fAnswers({});
    scrollToTop();
  };

  const calcAge = (currentGroup) => {
    if (!tglLahir || tglLahir.length < 10) return;
    const [d, m, y] = tglLahir.split("/").map(Number);
    if (!d || !m || !y || y < 2000) return;
    const birth = new Date(y, m - 1, d);
    const now = new Date();
    const diffMs = now - birth;
    if (diffMs < 0) return;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = days / 30.44;
    setAgeResult({ days, months });

    const isLt2m = days < 60;
    const isGt5y = days >= 1825;
    if (isGt5y) {
      setSelectedAgeGroup("2m5y");
      setAgeRedirectAlert({ type: "outOfRange", message: `Usia anak ${days} hari (±${(months/12).toFixed(1)} tahun). Sistem ini dirancang untuk anak usia 2 bulan – 5 tahun. Anda dapat melanjutkan pemeriksaan ini, namun tingkat relevansinya mungkin kurang optimal.` });
    } else if (currentGroup === "lt2m" && !isLt2m) {
      setSelectedAgeGroup("2m5y");
      setAgeRedirectAlert({ type: "switched", message: `Usia anak ${days} hari (${months.toFixed(1)} bulan), termasuk kelompok 2 bulan – 5 tahun. Alur pemeriksaan otomatis disesuaikan.` });
    } else if (currentGroup === "2m5y" && isLt2m) {
      setSelectedAgeGroup("lt2m");
      setAgeRedirectAlert({ type: "switched", message: `Usia anak ${days} hari (${months.toFixed(1)} bulan), termasuk kelompok kurang dari 2 bulan. Alur pemeriksaan otomatis disesuaikan.` });
    } else {
      setAgeRedirectAlert(null);
    }

    if (bbSekarang && gender) {
      setStatusGizi(calcStatusGizi(gender, months, parseFloat(bbSekarang)));
    }
  };

  useEffect(() => {
    if (tglLahir && bbSekarang && gender && tglLahir.length === 10) {
      calcAge(selectedAgeGroup);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tglLahir, bbSekarang, gender]);

  const updateAnswer = (setter) => (id, val) => setter(prev => ({ ...prev, [id]: val }));

  // Auto-set hasGiziMasalah from status gizi
  useEffect(() => {
    if (statusGizi && statusGizi.level !== 0 && hasGiziMasalah === null) {
      setHasGiziMasalah(true);
    }
  }, [statusGizi]);

  // ─── RESULT: lt2m ──────────────────────────────────────────────────────────
  const computeResultLt2m = () => {
    const c1aRed = C1A_QUESTIONS.some(q => c1aAnswers[q.id] === true);
    const c1bRedQs = C1B_QUESTIONS.filter(q => q.level === "red");
    const c1bRed = hasDiare && c1bRedQs.some(q => c1bAnswers[q.id] === true);
    const c1bYellow = hasDiare && !c1bRed && C1B_QUESTIONS.filter(q => q.level === "yellow").some(q => c1bAnswers[q.id] === true);
    const c1cRed = hasKuning && C1C_QUESTIONS.some(q => c1cAnswers[q.id] === true);
    const c1dRed = c1dAnswers["c1d4"] === true;
    const c1dYellow = !c1dRed && ["c1d1","c1d2","c1d3","c1d5"].some(id => c1dAnswers[id] === true);
    const giziRed = statusGizi && (statusGizi.level <= -2 || statusGizi.level >= 2);
    const urgent = c1aRed || c1bRed || c1cRed || c1dRed || giziRed;
    const reasons = [];
    if (c1aRed) reasons.push({ section:"Tanda Bahaya / Infeksi Bakteri", items:C1A_QUESTIONS.filter(q=>c1aAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c1bRed) reasons.push({ section:"Diare dengan Dehidrasi Berat", items:c1bRedQs.filter(q=>c1bAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c1bYellow) reasons.push({ section:"Diare dengan Dehidrasi Ringan", items:C1B_QUESTIONS.filter(q=>q.level==="yellow"&&c1bAnswers[q.id]===true).map(q=>q.text), level:"yellow" });
    if (c1cRed) reasons.push({ section:"Bayi Kuning (Perlu Evaluasi)", items:C1C_QUESTIONS.filter(q=>c1cAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c1dRed) reasons.push({ section:"Berat Badan Rendah", items:["Berat badan bayi jauh lebih rendah dari berat lahir"], level:"red" });
    if (c1dYellow) reasons.push({ section:"Masalah Pemberian ASI", items:C1D_QUESTIONS.filter(q=>["c1d1","c1d2","c1d3","c1d5"].includes(q.id)&&c1dAnswers[q.id]===true).map(q=>q.text), level:"yellow" });
    if (giziRed) reasons.push({ section:"Status Gizi", items:[`Status gizi: ${statusGizi.label}`], level:"red" });
    return { urgent, reasons, edukasi: EDUKASI_LT2M };
  };

  // ─── RESULT: 2m5y ──────────────────────────────────────────────────────────
  const computeResult2m5y = () => {
    const c2aRed = C2A_QUESTIONS.some(q => c2aAnswers[q.id] === true);
    const c2bRed = hasBatuk && C2B_QUESTIONS.some(q => c2bAnswers[q.id] === true);
    const c2cRedQs = C2C_QUESTIONS.filter(q => q.level === "red");
    const c2cYellowQs = C2C_QUESTIONS.filter(q => q.level === "yellow");
    const c2cRed = hasDiare2 && c2cRedQs.some(q => c2cAnswers[q.id] === true);
    const c2cYellow = hasDiare2 && !c2cRed && c2cYellowQs.some(q => c2cAnswers[q.id] === true);
    const c2dRedQs = C2D_QUESTIONS.filter(q => q.level === "red");
    const c2dYellowQs = C2D_QUESTIONS.filter(q => q.level === "yellow");
    const c2dRed = hasDemam && c2dRedQs.some(q => c2dAnswers[q.id] === true);
    const c2dYellow = hasDemam && !c2dRed && c2dYellowQs.some(q => c2dAnswers[q.id] === true);
    const c2eRed = hasTelinga && C2E_QUESTIONS.some(q => c2eAnswers[q.id] === true);
    const c2fRed = (hasGiziMasalah || (statusGizi && statusGizi.level !== 0)) && C2F_QUESTIONS.some(q => c2fAnswers[q.id] === true);
    const giziRed = statusGizi && (statusGizi.level <= -2 || statusGizi.level >= 2);
    const urgent = c2aRed || c2bRed || c2cRed || c2dRed || c2eRed || c2fRed || giziRed;
    const reasons = [];
    if (c2aRed) reasons.push({ section:"Tanda Bahaya Umum", items:C2A_QUESTIONS.filter(q=>c2aAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c2bRed) reasons.push({ section:"Batuk / Sukar Bernapas", items:C2B_QUESTIONS.filter(q=>c2bAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c2cRed) reasons.push({ section:"Diare dengan Dehidrasi Berat", items:c2cRedQs.filter(q=>c2cAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c2cYellow) reasons.push({ section:"Diare – Perlu Dipantau", items:c2cYellowQs.filter(q=>c2cAnswers[q.id]===true).map(q=>q.text), level:"yellow" });
    if (c2dRed) reasons.push({ section:"Demam (Perlu Segera Diperiksa)", items:c2dRedQs.filter(q=>c2dAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c2dYellow) reasons.push({ section:"Demam – Perlu Dipantau", items:c2dYellowQs.filter(q=>c2dAnswers[q.id]===true).map(q=>q.text), level:"yellow" });
    if (c2eRed) reasons.push({ section:"Masalah Telinga", items:C2E_QUESTIONS.filter(q=>c2eAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (c2fRed) reasons.push({ section:"Gangguan Gizi / Pertumbuhan", items:C2F_QUESTIONS.filter(q=>c2fAnswers[q.id]===true).map(q=>q.text), level:"red" });
    if (giziRed && !c2fRed) reasons.push({ section:"Status Gizi", items:[`Status gizi: ${statusGizi.label}`], level:"red" });
    const edukasiSections = [...EDUKASI_2M5Y_UMUM];
    if (hasBatuk) edukasiSections.push(...EDUKASI_2M5Y_BATUK);
    if (hasDiare2) edukasiSections.push(...EDUKASI_2M5Y_DIARE);
    if (hasDemam) edukasiSections.push(...EDUKASI_2M5Y_DEMAM);
    if (hasTelinga) edukasiSections.push(...EDUKASI_2M5Y_TELINGA);
    if (hasGiziMasalah || giziRed) edukasiSections.push(...EDUKASI_2M5Y_GIZI);
    return { urgent, reasons, edukasi: [...new Set(edukasiSections)] };
  };

  // ─── STEP METADATA ─────────────────────────────────────────────────────────
  const isLt2m = selectedAgeGroup === "lt2m";
  const STEP_LABELS = isLt2m
    ? ["Mulai","Data","Tanda Bahaya","Diare","Kuning","ASI & BB","Hasil"]
    : ["Mulai","Data","Tanda Bahaya","Batuk","Diare","Demam","Telinga","Gizi","Hasil"];
  const stepToChipIdx = (s) => {
    if (isLt2m) return s;
    const m = { 0:0,1:1,10:2,11:3,12:4,13:5,14:6,15:7,16:8 };
    return m[s] ?? 0;
  };
  const chipIdx = stepToChipIdx(step);
  const progressTotal = STEP_LABELS.length - 1;

  // Validate step 1 form
  const step1Valid = gender && tglLahir && bbSekarang && tbSekarang
    && (isLt2m ? (hasDiare !== null && hasKuning !== null) : true);

  // Status gizi color helpers
  const giziColorMap = { green:{ bg:"bg-green-50", border:"border-green-300", icon:"bg-green-500", text:"text-green-700" },
    orange:{ bg:"bg-orange-50", border:"border-orange-300", icon:"bg-orange-500", text:"text-orange-700" },
    yellow:{ bg:"bg-yellow-50", border:"border-yellow-300", icon:"bg-yellow-500", text:"text-yellow-700" },
    red:{ bg:"bg-red-50", border:"border-red-300", icon:"bg-red-500", text:"text-red-700" } };
  const gc = statusGizi ? (giziColorMap[statusGizi.color] || giziColorMap.green) : giziColorMap.green;

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
          <div className="ml-auto flex gap-1 flex-wrap justify-end max-w-[55%]">
            {STEP_LABELS.map((label, i) => (
              <StepChip key={label+i} label={label} active={chipIdx===i} done={chipIdx>i} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <ProgressBar current={chipIdx} total={progressTotal} />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ═══ STEP 0: FRONT PAGE ════════════════════════════════════════ */}
          {step === 0 && (
            <motion.div key="front" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }}>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-700 to-emerald-500 p-8 mt-2 shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    <RiShieldCheckLine className="w-3.5 h-3.5" />Berbasis MTBS Kemenkes RI
                  </div>
                  <h1 className="text-3xl font-bold text-white leading-tight mb-2">SengkolCare</h1>
                  <p className="text-green-100 text-sm leading-relaxed">Alat bantu skrining kesehatan anak berdasarkan panduan Manajemen Terpadu Balita Sakit (MTBS) Kementerian Kesehatan RI.</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { icon:RiScales3Line, title:"Status Gizi", desc:"Evaluasi BB/U otomatis" },
                  { icon:RiFirstAidKitLine, title:"Deteksi Dini", desc:"Tanda bahaya & penyakit" },
                  { icon:RiMedicineBottleLine, title:"Rekomendasi", desc:"Perlu rujukan atau tidak" },
                  { icon:RiParentLine, title:"Edukasi", desc:"Tips perawatan di rumah" },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-2xl p-4 shadow-sm border border-green-50">
                    <item.icon className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <RiAlertLine className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Penting:</strong> Alat ini hanya sebagai panduan awal, bukan pengganti diagnosis dokter. Segera konsultasikan ke tenaga kesehatan untuk penanganan lebih lanjut.
                </p>
              </div>
              <p className="text-xs text-gray-400 text-center mt-6 mb-3 font-medium uppercase tracking-wider">Pilih kelompok usia anak</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setSelectedAgeGroup("lt2m"); setAgeRedirectAlert(null); goTo(1); }}
                  className="bg-gradient-to-br from-green-600 to-emerald-500 text-white rounded-2xl p-5 text-left shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                  <RiHeartLine className="w-7 h-7 mb-3 opacity-90" />
                  <p className="font-bold text-base">Kurang dari</p>
                  <p className="font-bold text-lg">2 Bulan</p>
                  <p className="text-xs text-green-100 mt-1">0 – 59 hari</p>
                </button>
                <button onClick={() => { setSelectedAgeGroup("2m5y"); setAgeRedirectAlert(null); goTo(1); }}
                  className="bg-gradient-to-br from-teal-600 to-cyan-500 text-white rounded-2xl p-5 text-left shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">Beta</div>
                  <RiUserLine className="w-7 h-7 mb-3 opacity-90" />
                  <p className="font-bold text-base">2 Bulan –</p>
                  <p className="font-bold text-lg">5 Tahun</p>
                  <p className="text-xs text-teal-100 mt-1">2 – 60 bulan</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 1: INPUT DATA ════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div key="input" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Data Anak</h2>
              <p className="text-sm text-gray-400 mb-4">Masukkan data untuk menghitung usia dan status gizi otomatis.</p>

              <AnimatePresence>
                {ageRedirectAlert && (
                  <motion.div initial={{ opacity:0, y:-12, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-8, scale:0.97 }} transition={{ duration:0.3 }}
                    className={`mb-4 rounded-2xl p-4 flex gap-3 items-start border ${
                      ageRedirectAlert.type==="outOfRange" ? "bg-amber-50 border-amber-300" : "bg-blue-50 border-blue-200"}`}>
                    <RiInformationLine className={`w-5 h-5 flex-shrink-0 mt-0.5 ${ageRedirectAlert.type==="outOfRange" ? "text-amber-500" : "text-blue-500"}`} />
                    <div className="flex-1">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${ageRedirectAlert.type==="outOfRange" ? "text-amber-600" : "text-blue-600"}`}>
                        {ageRedirectAlert.type==="switched" ? "Alur Disesuaikan Otomatis" : "Di Luar Rentang Usia Optimal"}
                      </p>
                      <p className={`text-xs leading-relaxed ${ageRedirectAlert.type==="outOfRange" ? "text-amber-700" : "text-blue-700"}`}>{ageRedirectAlert.message}</p>
                    </div>
                    <button onClick={() => setAgeRedirectAlert(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><RiCloseLine className="w-4 h-4" /></button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Jenis Kelamin</label>
                <div className="flex gap-3">
                  {[{val:"L",label:"Laki-laki"},{val:"P",label:"Perempuan"}].map(g => (
                    <button key={g.val} onClick={() => setGender(g.val)}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-sm border-2 transition-all duration-200 ${
                        gender===g.val ? "bg-green-600 text-white border-green-600 shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-green-300"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiCalendarLine className="inline w-3.5 h-3.5 mr-1" />Tanggal Lahir (DD/MM/YYYY)
                </label>
                <input type="text" placeholder="cth: 15/05/2024" value={tglLahir}
                  onChange={e => {
                    let v = e.target.value.replace(/[^\d/]/g, "");
                    if (v.length===2 && tglLahir.length===1) v+="/";
                    if (v.length===5 && tglLahir.length===4) v+="/";
                    if (v.length<=10) setTglLahir(v);
                  }}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors" />
                <AnimatePresence>
                  {ageResult && (
                    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                      className="mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <RiCheckLine className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-green-700 font-medium">
                        Usia: <strong>{ageResult.days} hari</strong> ({ageResult.months.toFixed(1)} bulan)
                        {" – Alur: "}<strong>{selectedAgeGroup==="lt2m" ? "< 2 Bulan" : "2 Bulan – 5 Tahun"}</strong>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiScales3Line className="inline w-3.5 h-3.5 mr-1" />Berat Badan Lahir (kg) — opsional
                </label>
                <input type="number" placeholder="cth: 3.2" value={bbLahir} onChange={e => setBbLahir(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors" />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiScales3Line className="inline w-3.5 h-3.5 mr-1" />Berat Badan Sekarang (kg) *
                </label>
                <input type="number" placeholder="cth: 4.5" value={bbSekarang} onChange={e => setBbSekarang(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors" />
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  <RiRulerLine className="inline w-3.5 h-3.5 mr-1" />Panjang/Tinggi Badan Sekarang (cm) *
                </label>
                <input type="number" placeholder="cth: 54" value={tbSekarang} onChange={e => setTbSekarang(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors" />
              </div>

              <AnimatePresence>
                {statusGizi && (
                  <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                    className={`mb-5 rounded-2xl p-4 border-2 ${gc.bg} ${gc.border}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${gc.icon}`}>
                        <RiScales3Line className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Status Gizi (BB/U)</p>
                        <p className={`text-sm font-bold ${gc.text}`}>{statusGizi.label}</p>
                      </div>
                    </div>
                    <div className="mt-3 relative">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="flex-1 bg-red-400" /><div className="flex-1 bg-orange-400" />
                        <div className="flex-1 bg-green-400" /><div className="flex-1 bg-yellow-400" />
                        <div className="flex-1 bg-red-500" />
                      </div>
                      <div className="absolute -top-1 w-3 h-4 bg-gray-800 rounded-sm transform -translate-x-1/2 transition-all duration-500"
                        style={{ left:`${statusGizi.level===-3?10:statusGizi.level===-2?30:statusGizi.level===0?50:statusGizi.level===2?70:90}%` }} />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                        <span>Buruk</span><span>Kurang</span><span>Baik</span><span>Lebih</span><span>Obesitas</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* lt2m only: diare & kuning */}
              {selectedAgeGroup === "lt2m" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <RiInformationLine className="w-4 h-4 text-green-500" />Kondisi Tambahan
                  </p>
                  <div className="space-y-3">
                    {[
                      { q:"Apakah bayi mengalami diare?", val:hasDiare, setter:setHasDiare },
                      { q:"Apakah kulit/mata bayi terlihat kuning?", val:hasKuning, setter:setHasKuning },
                    ].map(({ q, val, setter }) => (
                      <div key={q}>
                        <p className="text-sm text-gray-600 mb-2">{q}</p>
                        <div className="flex gap-2">
                          {[{v:true,l:"Ya"},{v:false,l:"Tidak"}].map(opt => (
                            <button key={String(opt.v)} onClick={() => setter(opt.v)}
                              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                                val===opt.v ? (opt.v?"bg-red-500 text-white border-red-500":"bg-green-500 text-white border-green-500") : "bg-white text-gray-500 border-gray-200"}`}>
                              {opt.l}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => goTo(0)}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all">
                  <RiArrowLeftLine className="w-5 h-5" />
                </button>
                <button onClick={() => goTo(selectedAgeGroup==="lt2m" ? 2 : 10)} disabled={!step1Valid}
                  className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all">
                  Lanjut ke Pemeriksaan <RiArrowRightLine className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ LT2M: C1a ═════════════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div key="c1a" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiAlertLine} moduleLabel="Modul C1a" title="Tanda Bahaya & Infeksi"
                desc="Jawab Ya atau Tidak untuk setiap pertanyaan di bawah." />
              <div className="space-y-3 mb-2">
                {C1A_QUESTIONS.map((q,i) => (
                  <YesNoCard key={q.id} question={q} value={c1aAnswers[q.id]} onChange={updateAnswer(setC1aAnswers)} index={i} />
                ))}
              </div>
              <NavButtons onBack={()=>goTo(1)} onNext={()=>goTo(hasDiare?3:hasKuning?4:5)}
                nextDisabled={C1A_QUESTIONS.some(q=>c1aAnswers[q.id]===undefined)} />
            </motion.div>
          )}

          {/* ═══ LT2M: C1b ═════════════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div key="c1b" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiDropLine} moduleLabel="Modul C1b" title="Diare & Dehidrasi"
                desc="Bayi tercatat mengalami diare. Jawab pertanyaan berikut."
                accent="bg-blue-100" iconColor="text-blue-500" labelColor="text-blue-500" />
              <div className="space-y-3 mb-2">
                {C1B_QUESTIONS.map((q,i) => (
                  <div key={q.id} className="relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${q.level==="red"?"bg-red-400":"bg-yellow-400"}`} />
                    <div className="pl-3"><YesNoCard question={q} value={c1bAnswers[q.id]} onChange={updateAnswer(setC1bAnswers)} index={i} /></div>
                  </div>
                ))}
              </div>
              <NavButtons onBack={()=>goTo(2)} onNext={()=>goTo(hasKuning?4:5)}
                nextDisabled={C1B_QUESTIONS.some(q=>c1bAnswers[q.id]===undefined)} />
            </motion.div>
          )}

          {/* ═══ LT2M: C1c ═════════════════════════════════════════════════ */}
          {step === 4 && (
            <motion.div key="c1c" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiSunLine} moduleLabel="Modul C1c" title="Bayi Kuning"
                desc="Bayi tercatat memiliki tanda kuning. Jawab pertanyaan berikut."
                accent="bg-yellow-100" iconColor="text-yellow-500" labelColor="text-yellow-600" />
              <div className="space-y-3 mb-2">
                {C1C_QUESTIONS.map((q,i) => (
                  <YesNoCard key={q.id} question={q} value={c1cAnswers[q.id]} onChange={updateAnswer(setC1cAnswers)} index={i} />
                ))}
              </div>
              <NavButtons onBack={()=>goTo(hasDiare?3:2)} onNext={()=>goTo(5)}
                nextDisabled={C1C_QUESTIONS.some(q=>c1cAnswers[q.id]===undefined)} />
            </motion.div>
          )}

          {/* ═══ LT2M: C1d ═════════════════════════════════════════════════ */}
          {step === 5 && (
            <motion.div key="c1d" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiParentLine} moduleLabel="Modul C1d" title="Pemberian ASI & BB"
                desc="Pertanyaan seputar pemberian ASI dan berat badan bayi."
                accent="bg-green-100" iconColor="text-green-600" labelColor="text-green-600" />
              <div className="space-y-3 mb-2">
                {C1D_QUESTIONS.map((q,i) => (
                  <div key={q.id} className="relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${q.level==="red"?"bg-red-400":"bg-yellow-400"}`} />
                    <div className="pl-3"><YesNoCard question={q} value={c1dAnswers[q.id]} onChange={updateAnswer(setC1dAnswers)} index={i} /></div>
                  </div>
                ))}
              </div>
              <NavButtons onBack={()=>goTo(hasKuning?4:hasDiare?3:2)} onNext={()=>goTo(6)} nextLabel="Lihat Hasil"
                nextDisabled={C1D_QUESTIONS.some(q=>c1dAnswers[q.id]===undefined)} />
            </motion.div>
          )}

          {/* ═══ LT2M: RESULT ══════════════════════════════════════════════ */}
          {step === 6 && (
            <ResultPage key="result-lt2m" result={computeResultLt2m()} onReset={resetAll} onBack={()=>goTo(5)} />
          )}

          {/* ═══ 2M5Y: C2a ═════════════════════════════════════════════════ */}
          {step === 10 && (
            <motion.div key="c2a" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiAlertLine} moduleLabel="Modul C2a" title="Tanda Bahaya Umum"
                desc="Cek tanda bahaya yang memerlukan penanganan segera." />
              <div className="space-y-3 mb-2">
                {C2A_QUESTIONS.map((q,i) => (
                  <YesNoCard key={q.id} question={q} value={c2aAnswers[q.id]} onChange={updateAnswer(setC2aAnswers)} index={i} />
                ))}
              </div>
              <NavButtons onBack={()=>goTo(1)} onNext={()=>goTo(11)}
                nextDisabled={C2A_QUESTIONS.some(q=>c2aAnswers[q.id]===undefined)} />
            </motion.div>
          )}

          {/* ═══ 2M5Y: C2b ═════════════════════════════════════════════════ */}
          {step === 11 && (
            <motion.div key="c2b" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiHeartPulseLine} moduleLabel="Modul C2b" title="Batuk / Sukar Bernapas"
                desc="Periksa kondisi pernapasan anak."
                accent="bg-blue-100" iconColor="text-blue-500" labelColor="text-blue-500" />
              <ConditionalModule
                mainQ="Apakah anak Anda batuk atau sulit bernapas?"
                mainVal={hasBatuk} onMainChange={setHasBatuk}
                subQuestions={C2B_QUESTIONS} subAnswers={c2bAnswers} onSubChange={updateAnswer(setC2bAnswers)}
                icon={RiHeartPulseLine} label="Batuk" accent="text-blue-500" />
              <NavButtons onBack={()=>goTo(10)} onNext={()=>goTo(12)}
                nextDisabled={hasBatuk===null || (hasBatuk && C2B_QUESTIONS.some(q=>c2bAnswers[q.id]===undefined))} />
            </motion.div>
          )}

          {/* ═══ 2M5Y: C2c ═════════════════════════════════════════════════ */}
          {step === 12 && (
            <motion.div key="c2c" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiDropLine} moduleLabel="Modul C2c" title="Diare & Dehidrasi"
                accent="bg-cyan-100" iconColor="text-cyan-600" labelColor="text-cyan-600" />
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5 mb-4 text-xs text-blue-600 leading-relaxed">
                Diare: BAB lebih sering dari biasanya (3x atau lebih/hari) dengan tekstur encer/berair.
              </div>
              <ConditionalModule
                mainQ="Apakah anak Anda mengalami diare?"
                mainVal={hasDiare2} onMainChange={setHasDiare2}
                subQuestions={C2C_QUESTIONS} subAnswers={c2cAnswers} onSubChange={updateAnswer(setC2cAnswers)}
                icon={RiDropLine} label="Diare" accent="text-cyan-600" />
              <NavButtons onBack={()=>goTo(11)} onNext={()=>goTo(13)}
                nextDisabled={hasDiare2===null || (hasDiare2 && C2C_QUESTIONS.some(q=>c2cAnswers[q.id]===undefined))} />
            </motion.div>
          )}

          {/* ═══ 2M5Y: C2d ═════════════════════════════════════════════════ */}
          {step === 13 && (
            <motion.div key="c2d" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiThermometerLine} moduleLabel="Modul C2d" title="Demam"
                accent="bg-orange-100" iconColor="text-orange-500" labelColor="text-orange-500" />
              <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2.5 mb-4 text-xs text-orange-600 leading-relaxed">
                Demam: suhu tubuh ≥37,5°C. Gunakan termometer ketiak untuk pengukuran yang akurat.
              </div>
              <ConditionalModule
                mainQ="Apakah anak Anda menderita demam?"
                mainVal={hasDemam} onMainChange={setHasDemam}
                subQuestions={C2D_QUESTIONS} subAnswers={c2dAnswers} onSubChange={updateAnswer(setC2dAnswers)}
                icon={RiThermometerLine} label="Demam" accent="text-orange-500" />
              <NavButtons onBack={()=>goTo(12)} onNext={()=>goTo(14)}
                nextDisabled={hasDemam===null || (hasDemam && C2D_QUESTIONS.some(q=>c2dAnswers[q.id]===undefined))} />
            </motion.div>
          )}

          {/* ═══ 2M5Y: C2e ═════════════════════════════════════════════════ */}
          {step === 14 && (
            <motion.div key="c2e" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiMusicLine} moduleLabel="Modul C2e" title="Masalah Telinga"
                accent="bg-purple-100" iconColor="text-purple-500" labelColor="text-purple-500" />
              <ConditionalModule
                mainQ="Apakah anak Anda memiliki masalah telinga?"
                mainVal={hasTelinga} onMainChange={setHasTelinga}
                subQuestions={C2E_QUESTIONS} subAnswers={c2eAnswers} onSubChange={updateAnswer(setC2eAnswers)}
                icon={RiMusicLine} label="Telinga" accent="text-purple-500" />
              <NavButtons onBack={()=>goTo(13)} onNext={()=>goTo(15)}
                nextDisabled={hasTelinga===null || (hasTelinga && C2E_QUESTIONS.some(q=>c2eAnswers[q.id]===undefined))} />
            </motion.div>
          )}

          {/* ═══ 2M5Y: C2f ═════════════════════════════════════════════════ */}
          {step === 15 && (
            <motion.div key="c2f" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration:0.35, ease:"easeInOut" }} className="mt-2">
              <SectionHeader icon={RiSeedlingLine} moduleLabel="Modul C2f" title="Gizi & Pertumbuhan"
                accent="bg-green-100" iconColor="text-green-600" labelColor="text-green-600" />
              {statusGizi && statusGizi.level !== 0 && (
                <div className={`mb-4 rounded-2xl p-3 border ${gc.bg} ${gc.border} flex items-center gap-3`}>
                  <RiAlertLine className={`w-5 h-5 flex-shrink-0 ${gc.text}`} />
                  <p className={`text-xs font-medium ${gc.text}`}>
                    Status gizi anak: <strong>{statusGizi.label}</strong>. Pertanyaan lanjutan ditampilkan otomatis.
                  </p>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <RiSeedlingLine className="w-4 h-4 text-green-600" />
                  Apakah anak Anda memiliki gangguan gizi atau pertumbuhan?
                </p>
                <div className="flex gap-2 mb-2">
                  {[{v:true,l:"Ya"},{v:false,l:"Tidak"}].map(opt => (
                    <button key={String(opt.v)} onClick={() => setHasGiziMasalah(opt.v)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        hasGiziMasalah===opt.v ? (opt.v?"bg-red-500 text-white border-red-500":"bg-green-500 text-white border-green-500") : "bg-white text-gray-500 border-gray-200"}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {(hasGiziMasalah || (statusGizi && statusGizi.level !== 0)) && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                    exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}>
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2 ml-1">Pertanyaan lanjutan</p>
                    <div className="space-y-3">
                      {C2F_QUESTIONS.map((q,i) => (
                        <YesNoCard key={q.id} question={q} value={c2fAnswers[q.id]} onChange={updateAnswer(setC2fAnswers)} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <NavButtons onBack={()=>goTo(14)} onNext={()=>goTo(16)} nextLabel="Lihat Hasil"
                nextDisabled={hasGiziMasalah===null && !(statusGizi && statusGizi.level !== 0)} />
            </motion.div>
          )}

          {/* ═══ 2M5Y: RESULT ══════════════════════════════════════════════ */}
          {step === 16 && (
            <ResultPage key="result-2m5y" result={computeResult2m5y()} onReset={resetAll} onBack={()=>goTo(15)} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── RESULT PAGE ─────────────────────────────────────────────────────────────
function ResultPage({ result, onReset, onBack }) {
  const { urgent, reasons, edukasi } = result;
  return (
    <motion.div key="result" initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, ease:"easeOut" }} className="mt-2">
      <div className={`rounded-3xl p-6 mb-4 ${urgent?"bg-gradient-to-br from-red-600 to-rose-500":"bg-gradient-to-br from-green-600 to-emerald-500"} shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            {urgent ? <RiHospitalLine className="w-7 h-7 text-white" /> : <RiShieldCheckLine className="w-7 h-7 text-white" />}
          </div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
            {urgent ? "Opsi 2 — Perlu Tindakan" : "Opsi 1 — Aman"}
          </p>
          <h2 className="text-2xl font-bold text-white leading-tight mb-2">
            {urgent ? "Segera Bawa ke Fasilitas Kesehatan" : "Anak Dapat Dirawat di Rumah"}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            {urgent ? "Berdasarkan jawaban Anda, anak memerlukan penanganan medis segera. Jangan tunda."
              : "Tidak ditemukan tanda bahaya serius. Tetap pantau kondisi anak dan lakukan perawatan di rumah."}
          </p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ringkasan Temuan</p>
          <div className="space-y-2">
            {reasons.map((r,i) => (
              <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:i*0.08, duration:0.35 }}
                className={`bg-white rounded-2xl border-l-4 ${r.level==="red"?"border-red-400":"border-yellow-400"} p-4 shadow-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${r.level==="red"?"bg-red-100":"bg-yellow-100"}`}>
                    <RiAlertLine className={`w-3 h-3 ${r.level==="red"?"text-red-500":"text-yellow-600"}`} />
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${r.level==="red"?"text-red-600":"text-yellow-600"}`}>{r.section}</p>
                </div>
                <ul className="space-y-1">
                  {r.items.map((item,j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                      <RiCheckLine className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {reasons.length === 0 && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <RiShieldCheckLine className="w-6 h-6 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">Tidak ditemukan tanda bahaya atau masalah serius pada pemeriksaan ini.</p>
        </div>
      )}

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Edukasi &amp; Tips Perawatan</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          {edukasi.map((tip,i) => (
            <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3+i*0.05, duration:0.3 }} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-green-700">{i+1}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <RiAlertLine className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Hasil ini bukan diagnosis medis. Selalu konsultasikan kondisi anak kepada dokter atau tenaga kesehatan terdekat untuk penanganan yang tepat.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-all">
          <RiArrowLeftLine className="w-5 h-5" />
        </button>
        <button onClick={onReset}
          className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all">
          <RiRefreshLine className="w-4 h-4" /> Mulai Pemeriksaan Baru
        </button>
      </div>
    </motion.div>
  );
}
