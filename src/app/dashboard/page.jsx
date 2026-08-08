"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  RiDashboardLine,
  RiTreeLine,
  RiStoreLine,
  RiMapPin2Line,
  RiHeartPulseLine,
  RiLogoutBoxLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiCheckLine,
  RiAlertLine,
  RiUploadCloud2Line,
  RiArrowUpLine,
  RiArrowDownLine,
  RiUserLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiNewspaperLine,
  RiArticleLine,
  RiFilePdfLine,
} from "react-icons/ri";

// ─────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg">
            <RiDashboardLine className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Desa Sengkol</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email admin"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="relative">
            <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs rounded-xl px-3 py-2.5">
              <RiAlertLine /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-60">
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Akun admin dibuat melalui Supabase → Authentication → Users
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <RiCheckLine /> : <RiAlertLine />}
      {message}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// DRAG & DROP ZONE (reusable)
// ─────────────────────────────────────────────────────────────
function DropZone({ onFiles, accept = "image/*", multiple = true, uploading = false, label = "Upload Foto", hoverColor = "hover:border-gray-400 hover:text-gray-700" }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef();
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
      onDrop={handleDrop}
      onClick={() => !uploading && ref.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-xl px-4 py-4 flex flex-col items-center gap-1 text-sm transition-all select-none ${
        dragging
          ? "border-cyan-400 bg-cyan-50 text-cyan-600 scale-[1.01]"
          : `border-gray-300 text-gray-500 ${hoverColor}`
      } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
    >
      <RiUploadCloud2Line className="text-2xl" />
      <span className="font-medium">{uploading ? "Mengupload..." : label}</span>
      <span className="text-xs text-gray-400">atau drag file ke sini</span>
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden"
        onChange={(e) => e.target.files.length && onFiles(e.target.files)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UPLOAD FOTO HELPER
// ─────────────────────────────────────────────────────────────
async function uploadFoto(file, folder) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

// Gradien tetap untuk list pohon di dashboard (supaya selalu ter-compile Tailwind)
const POHON_GRADIENTS = [
  "from-emerald-600 to-green-500",
  "from-teal-600 to-cyan-500",
  "from-green-700 to-emerald-500",
  "from-amber-600 to-orange-500",
  "from-teal-700 to-cyan-600",
  "from-orange-600 to-amber-500",
  "from-lime-700 to-green-600",
  "from-violet-600 to-purple-500",
  "from-rose-600 to-pink-500",
  "from-blue-600 to-cyan-500",
];

// ─────────────────────────────────────────────────────────────
// POHON SECTION
// ─────────────────────────────────────────────────────────────
function PohonSection({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null); // null | {} | {existing}
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    const { data } = await supabase.from("pohon").select("*").order("urutan");
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const blank = () => ({
    nama: "", nama_ilmiah: "", famili: "", deskripsi_singkat: "",
    ciri: "", manfaat: "", fotos: [],
    warna: "from-emerald-600 to-green-400",
    badge: "bg-emerald-100 text-emerald-800",
    urutan: list.length + 1,
  });

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editItem,
        ciri: typeof editItem.ciri === "string"
          ? editItem.ciri.split("\n").filter(Boolean)
          : editItem.ciri,
        fotos: editItem.fotos || [],
      };
      if (payload.id) {
        const { id, created_at, ...rest } = payload;
        await supabase.from("pohon").update(rest).eq("id", id);
      } else {
        await supabase.from("pohon").insert(payload);
      }
      toast("Pohon disimpan!");
      setEditItem(null);
      load();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Hapus pohon ini?")) return;
    await supabase.from("pohon").delete().eq("id", id);
    toast("Dihapus.");
    load();
  };

  const uploadFotos = async (files) => {
    const urls = [];
    for (const f of Array.from(files)) {
      const url = await uploadFoto(f, "pohon");
      urls.push(url);
    }
    setEditItem((prev) => ({ ...prev, fotos: [...(prev.fotos || []), ...urls] }));
  };

  const removeFoto = (url) => {
    setEditItem((prev) => ({ ...prev, fotos: prev.fotos.filter((f) => f !== url) }));
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{list.length} pohon terdaftar</p>
        <button onClick={() => setEditItem(blank())}
          className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">
          <RiAddLine /> Tambah Pohon
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 bg-gradient-to-r ${POHON_GRADIENTS[i % POHON_GRADIENTS.length]} p-3 rounded-2xl shadow-sm`}>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{p.nama}</p>
              <p className="text-white/70 text-xs">{p.nama_ilmiah} · {p.famili}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem({ ...p, ciri: Array.isArray(p.ciri) ? p.ciri.join("\n") : p.ciri })}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-colors">
                <RiEditLine />
              </button>
              <button onClick={() => del(p.id)}
                className="bg-white/20 hover:bg-red-500 text-white rounded-xl p-2 transition-colors">
                <RiDeleteBinLine />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">{editItem.id ? "Edit Pohon" : "Tambah Pohon"}</h3>
                <button onClick={() => setEditItem(null)}><RiCloseLine className="text-xl text-gray-400" /></button>
              </div>

              {[
                { label: "Nama Pohon", key: "nama", placeholder: "Cemara Kipas" },
                { label: "Nama Ilmiah", key: "nama_ilmiah", placeholder: "Thuja orientalis" },
                { label: "Famili", key: "famili", placeholder: "Cupressaceae" },
                { label: "Deskripsi Singkat", key: "deskripsi_singkat", placeholder: "Singkat, 1–2 kalimat" },
                { label: "Manfaat", key: "manfaat", placeholder: "Manfaat pohon ini..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={editItem[key] || ""} onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Ciri-ciri <span className="font-normal normal-case text-gray-400">(satu per baris)</span>
                </label>
                <textarea value={editItem.ciri || ""} onChange={(e) => setEditItem({ ...editItem, ciri: e.target.value })}
                  rows={4} placeholder={"Daun kecil bersisik\nBatang tegak lurus"}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
              </div>

              {/* Urutan */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Urutan tampil</label>
                <input type="number" value={editItem.urutan || 0} onChange={(e) => setEditItem({ ...editItem, urutan: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>

              {/* Upload Foto */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Foto Pohon</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(editItem.fotos || []).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <button onClick={() => removeFoto(url)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 text-xs">
                        <RiCloseLine />
                      </button>
                    </div>
                  ))}
                </div>
                <DropZone
                  onFiles={uploadFotos}
                  label="Upload Foto"
                  hoverColor="hover:border-green-400 hover:text-green-600"
                />
              </div>

              <button onClick={save} disabled={saving}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UMKM SECTION
// ─────────────────────────────────────────────────────────────
function UmkmSection({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("umkm").select("*").order("urutan");
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const blank = () => ({ nama_usaha: "", pemilik: "", kategori: [], produk: "", deskripsi: "", alamat: "", maps_url: "", instagram: "", website: "", whatsapp: "", telepon: "", fotos: [], pembayaran: [], urutan: list.length + 1 });

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editItem, fotos: editItem.fotos || [] };
      if (payload.id) {
        const { id, created_at, ...rest } = payload;
        await supabase.from("umkm").update(rest).eq("id", id);
      } else {
        await supabase.from("umkm").insert(payload);
      }
      toast("UMKM disimpan!");
      setEditItem(null);
      load();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Hapus UMKM ini?")) return;
    await supabase.from("umkm").delete().eq("id", id);
    toast("Dihapus.");
    load();
  };

  const uploadFotos = async (files) => {
    setUploading(true);
    try {
      const urls = [];
      for (const f of Array.from(files)) {
        const url = await uploadFoto(f, "umkm");
        urls.push(url);
      }
      setEditItem((prev) => ({ ...prev, fotos: [...(prev.fotos || []), ...urls] }));
      toast(`${urls.length} foto diupload!`);
    } catch (e) { toast(e.message, "error"); }
    setUploading(false);
  };

  const removeFoto = (url) => {
    setEditItem((prev) => ({ ...prev, fotos: prev.fotos.filter((f) => f !== url) }));
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;

  const KATEGORI = ["Jasa Wisata", "Kuliner", "Kerajinan", "Toko/Perdagangan"];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{list.length} UMKM terdaftar</p>
        <button onClick={() => setEditItem(blank())}
          className="flex items-center gap-1.5 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
          <RiAddLine /> Tambah UMKM
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((u) => (
          <div key={u.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 overflow-hidden">
              {(u.fotos?.[0] || u.foto_url) ? <Image src={u.fotos?.[0] || u.foto_url} alt="" width={48} height={48} className="object-cover w-full h-full" /> : <RiStoreLine className="text-orange-400 text-xl" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{u.nama_usaha}</p>
              <p className="text-gray-400 text-xs">{u.pemilik} · {Array.isArray(u.kategori) ? u.kategori.join(", ") : u.kategori}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem({ ...u, fotos: u.fotos || (u.foto_url ? [u.foto_url] : []) })} className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl p-2 transition-colors"><RiEditLine /></button>
              <button onClick={() => del(u.id)} className="bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl p-2 transition-colors"><RiDeleteBinLine /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">{editItem.id ? "Edit UMKM" : "Tambah UMKM"}</h3>
                <button onClick={() => setEditItem(null)}><RiCloseLine className="text-xl text-gray-400" /></button>
              </div>

              {[
                { label: "Nama Usaha", key: "nama_usaha" },
                { label: "Pemilik", key: "pemilik" },
                { label: "Produk / Layanan", key: "produk" },
                { label: "Deskripsi", key: "deskripsi" },
                { label: "Alamat", key: "alamat" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={editItem[key] || ""} onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}

              {/* Lokasi & Kontak */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Lokasi & Kontak</p>
                {[
                  { label: "Link Google Maps", key: "maps_url", placeholder: "https://maps.google.com/..." },
                  { label: "Instagram (URL)", key: "instagram", placeholder: "https://instagram.com/..." },
                  { label: "Website (URL)", key: "website", placeholder: "https://..." },
                  { label: "WhatsApp (URL)", key: "whatsapp", placeholder: "https://wa.me/628..." },
                  { label: "Nomor Telepon", key: "telepon", placeholder: "0812-3456-7890" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="mb-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                    <input value={editItem[key] || ""} onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                ))}
              </div>

              {/* Kategori multi-select */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Kategori (bisa pilih lebih dari 1)</label>
                <div className="flex flex-wrap gap-2">
                  {KATEGORI.map((k) => {
                    const selected = (editItem.kategori || []).includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          const cur = editItem.kategori || [];
                          setEditItem({ ...editItem, kategori: selected ? cur.filter((x) => x !== k) : [...cur, k] });
                        }}
                        className={`text-sm font-semibold px-3.5 py-2 rounded-xl border transition-colors ${
                          selected
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-600 border-gray-200 hover:border-orange-400"
                        }`}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pembayaran multi-select */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pembayaran yang Tersedia</label>
                <div className="flex flex-wrap gap-2">
                  {["Tunai", "QRIS", "EDC"].map((p) => {
                    const selected = (editItem.pembayaran || []).includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          const cur = editItem.pembayaran || [];
                          setEditItem({ ...editItem, pembayaran: selected ? cur.filter((x) => x !== p) : [...cur, p] });
                        }}
                        className={`text-sm font-semibold px-3.5 py-2 rounded-xl border transition-colors ${
                          selected
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multi-foto */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Foto <span className="font-normal normal-case text-gray-400">(bisa lebih dari 1, slideshow otomatis)</span>
                </label>
                {(editItem.fotos || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editItem.fotos || []).map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <button onClick={() => removeFoto(url)}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 text-xs">
                          <RiCloseLine />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <DropZone
                  onFiles={uploadFotos}
                  uploading={uploading}
                  label="Upload Foto"
                  hoverColor="hover:border-orange-400 hover:text-orange-600"
                />
              </div>

              <button onClick={save} disabled={saving || uploading}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WISATA SECTION
// ─────────────────────────────────────────────────────────────
function WisataSection({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    const { data } = await supabase.from("wisata").select("*").order("urutan");
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const blank = () => ({
    nama: "", deskripsi: "", kategori: "Alam", rating: "4.5", tipe: "",
    jam: "", maps_url: "", warna: "from-green-700 to-emerald-400",
    fotos: [], urutan: list.length + 1,
  });

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editItem, fotos: editItem.fotos || [] };
      if (payload.id) {
        const { id, created_at, ...rest } = payload;
        await supabase.from("wisata").update(rest).eq("id", id);
      } else {
        await supabase.from("wisata").insert(payload);
      }
      toast("Wisata disimpan!");
      setEditItem(null);
      load();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Hapus wisata ini?")) return;
    await supabase.from("wisata").delete().eq("id", id);
    toast("Dihapus.");
    load();
  };

  const uploadFotos = async (files) => {
    setUploading(true);
    try {
      const urls = [];
      for (const f of Array.from(files)) {
        const url = await uploadFoto(f, "wisata");
        urls.push(url);
      }
      setEditItem((prev) => ({ ...prev, fotos: [...(prev.fotos || []), ...urls] }));
    } catch (e) { toast(e.message, "error"); }
    setUploading(false);
  };

  const removeFoto = (url) => {
    setEditItem((prev) => ({ ...prev, fotos: prev.fotos.filter((f) => f !== url) }));
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{list.length} wisata terdaftar</p>
        <button onClick={() => setEditItem(blank())}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <RiAddLine /> Tambah Wisata
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((w) => (
          <div key={w.id} className={`flex items-center gap-3 bg-gradient-to-r ${w.warna} rounded-2xl p-4 shadow-sm`}>
            {(w.fotos?.length > 0 || w.foto_url) && (
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.fotos?.[0] || w.foto_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{w.nama}</p>
              <p className="text-white/70 text-xs">
                {w.kategori} · ★ {w.rating}
                {w.fotos?.length > 0 && ` · 📸 ${w.fotos.length} foto`}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem({ ...w, fotos: w.fotos || [] })} className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-colors"><RiEditLine /></button>
              <button onClick={() => del(w.id)} className="bg-white/20 hover:bg-red-500 text-white rounded-xl p-2 transition-colors"><RiDeleteBinLine /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">{editItem.id ? "Edit Wisata" : "Tambah Wisata"}</h3>
                <button onClick={() => setEditItem(null)}><RiCloseLine className="text-xl text-gray-400" /></button>
              </div>

              {[
                { label: "Nama Wisata", key: "nama" },
                { label: "Deskripsi", key: "deskripsi" },
                { label: "Kategori", key: "kategori" },
                { label: "Rating (misal: 4.7)", key: "rating" },
                { label: "Tipe (misal: Pantai)", key: "tipe" },
                { label: "Jam Operasional", key: "jam" },
                { label: "Link Google Maps", key: "maps_url" },
                { label: "Gradient Warna (Tailwind from-X to-X)", key: "warna" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={editItem[key] || ""} onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              ))}

              {/* Upload Foto */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Foto Wisata <span className="font-normal normal-case text-gray-400">(bisa lebih dari 1)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(editItem.fotos || []).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <button onClick={() => removeFoto(url)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 text-xs">
                        <RiCloseLine />
                      </button>
                    </div>
                  ))}
                </div>
                <DropZone
                  onFiles={uploadFotos}
                  uploading={uploading}
                  label="Upload Foto"
                  hoverColor="hover:border-blue-400 hover:text-blue-600"
                />
              </div>

              <button onClick={save} disabled={saving || uploading}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KESEHATAN SECTION
// ─────────────────────────────────────────────────────────────
function KesehatanSection() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("kesehatan_records").select("*").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => { setList(data || []); setLoading(false); });
  }, []);

  const STATUS_COLOR = {
    "Gizi Baik": "bg-green-100 text-green-700",
    "Normal": "bg-green-100 text-green-700",
    "Gizi Kurang": "bg-yellow-100 text-yellow-700",
    "Pendek": "bg-yellow-100 text-yellow-700",
    "Kurus": "bg-yellow-100 text-yellow-700",
    "Gizi Buruk": "bg-red-100 text-red-700",
    "Sangat Pendek": "bg-red-100 text-red-700",
    "Sangat Kurus": "bg-red-100 text-red-700",
    "Gizi Lebih": "bg-orange-100 text-orange-700",
    "Gemuk": "bg-orange-100 text-orange-700",
    "Tinggi": "bg-blue-100 text-blue-700",
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;
  if (list.length === 0) return (
    <div className="text-center py-12">
      <RiHeartPulseLine className="text-5xl text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">Belum ada data pemeriksaan</p>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{list.length} rekam pemeriksaan</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              {["Nama", "JK", "Umur", "BB", "TB", "BB/U", "TB/U", "BB/TB", "Tanggal"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-bold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((r) => (
              <tr key={r.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.nama}</td>
                <td className="px-4 py-3 text-gray-500">{r.jenis_kelamin}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.umur_bulan} bln</td>
                <td className="px-4 py-3 text-gray-500">{r.berat_badan} kg</td>
                <td className="px-4 py-3 text-gray-500">{r.tinggi_badan} cm</td>
                {[r.status_bb_u, r.status_tb_u, r.status_bb_tb].map((s, i) => (
                  <td key={i} className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLOR[s] || "bg-gray-100 text-gray-500"}`}>
                      {s || "–"}
                    </span>
                  </td>
                ))}
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BERITA SECTION
// ─────────────────────────────────────────────────────────────
const BERITA_KATEGORI = ["Kesehatan", "Lingkungan", "Ekonomi", "Budaya", "Pendidikan", "Pariwisata", "Umum"];
const JURNAL_KATEGORI = ["Laporan", "Kesehatan", "Lingkungan", "Ekonomi", "Budaya", "Pendidikan"];

function ArtikelSubSection({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    const { data } = await supabase.from("artikel").select("*").order("tanggal", { ascending: false });
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().split("T")[0];
  const blank = () => ({ judul: "", ringkasan: "", konten: "", kategori: "Umum", tanggal: today, penulis: "Tim KKN Desa Sengkol", foto_url: "" });

  const save = async () => {
    setSaving(true);
    try {
      if (editItem.id) {
        const { id, created_at, ...rest } = editItem;
        await supabase.from("artikel").update(rest).eq("id", id);
      } else {
        await supabase.from("artikel").insert(editItem);
      }
      toast("Artikel disimpan!");
      setEditItem(null);
      load();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Hapus artikel ini?")) return;
    await supabase.from("artikel").delete().eq("id", id);
    toast("Dihapus.");
    load();
  };

  const uploadFotoArtikel = async (file) => {
    setUploading(true);
    try {
      const url = await uploadFoto(file, "berita");
      setEditItem((prev) => ({ ...prev, foto_url: url }));
    } catch (e) { toast(e.message, "error"); }
    setUploading(false);
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{list.length} artikel terdaftar</p>
        <button onClick={() => setEditItem(blank())}
          className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
          <RiAddLine /> Tambah Artikel
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((a) => (
          <div key={a.id} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
            {a.foto_url && (
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.foto_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{a.judul}</p>
              <p className="text-gray-400 text-xs mt-0.5">{a.kategori} · {a.tanggal}</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{a.ringkasan}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem(a)} className="bg-white hover:bg-gray-100 text-gray-600 rounded-xl p-2 border border-gray-200 transition-colors"><RiEditLine /></button>
              <button onClick={() => del(a.id)} className="bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl p-2 border border-gray-200 transition-colors"><RiDeleteBinLine /></button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Belum ada artikel. Tambah sekarang!</div>
        )}
      </div>

      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">{editItem.id ? "Edit Artikel" : "Tambah Artikel"}</h3>
                <button onClick={() => setEditItem(null)}><RiCloseLine className="text-xl text-gray-400" /></button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Judul</label>
                <input value={editItem.judul || ""} onChange={(e) => setEditItem({ ...editItem, judul: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Kategori</label>
                  <select value={editItem.kategori || "Umum"} onChange={(e) => setEditItem({ ...editItem, kategori: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {BERITA_KATEGORI.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tanggal</label>
                  <input type="date" value={editItem.tanggal || ""} onChange={(e) => setEditItem({ ...editItem, tanggal: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Penulis</label>
                <input value={editItem.penulis || ""} onChange={(e) => setEditItem({ ...editItem, penulis: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Ringkasan</label>
                <textarea rows={2} value={editItem.ringkasan || ""} onChange={(e) => setEditItem({ ...editItem, ringkasan: e.target.value })}
                  placeholder="1-2 kalimat ringkasan artikel..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Isi Artikel <span className="font-normal normal-case text-gray-400">(paragraf dipisah dengan baris kosong)</span>
                </label>
                <textarea rows={10} value={editItem.konten || ""} onChange={(e) => setEditItem({ ...editItem, konten: e.target.value })}
                  placeholder="Tulis isi artikel di sini..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Foto Artikel</label>
                {editItem.foto_url && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editItem.foto_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <button onClick={() => setEditItem({ ...editItem, foto_url: "" })}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><RiCloseLine /></button>
                  </div>
                )}
                <DropZone
                  onFiles={(files) => uploadFotoArtikel(files[0])}
                  multiple={false}
                  uploading={uploading}
                  label="Upload Foto"
                  hoverColor="hover:border-indigo-400 hover:text-indigo-600"
                />
              </div>

              <button onClick={save} disabled={saving || uploading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan Artikel"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function JurnalSubSection({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pdfRef = useRef();

  const load = async () => {
    const { data } = await supabase.from("jurnal").select("*").order("tanggal", { ascending: false });
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().split("T")[0];
  const blank = () => ({ judul: "", deskripsi: "", kategori: "Laporan", tanggal: today, file_url: "", halaman: 0 });

  const save = async () => {
    setSaving(true);
    try {
      if (editItem.id) {
        const { id, created_at, ...rest } = editItem;
        await supabase.from("jurnal").update(rest).eq("id", id);
      } else {
        await supabase.from("jurnal").insert(editItem);
      }
      toast("Jurnal disimpan!");
      setEditItem(null);
      load();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Hapus jurnal ini?")) return;
    await supabase.from("jurnal").delete().eq("id", id);
    toast("Dihapus.");
    load();
  };

  const uploadPdf = async (file) => {
    setUploading(true);
    try {
      const url = await uploadFoto(file, "jurnal");
      setEditItem((prev) => ({ ...prev, file_url: url }));
    } catch (e) { toast(e.message, "error"); }
    setUploading(false);
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{list.length} jurnal terdaftar</p>
        <button onClick={() => setEditItem(blank())}
          className="flex items-center gap-1.5 bg-rose-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors">
          <RiAddLine /> Tambah Jurnal
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((j) => (
          <div key={j.id} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <RiFilePdfLine className="text-rose-500 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{j.judul}</p>
              <p className="text-gray-400 text-xs mt-0.5">{j.kategori} · {j.tanggal} · {j.halaman} hal</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{j.deskripsi}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem(j)} className="bg-white hover:bg-gray-100 text-gray-600 rounded-xl p-2 border border-gray-200 transition-colors"><RiEditLine /></button>
              <button onClick={() => del(j.id)} className="bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl p-2 border border-gray-200 transition-colors"><RiDeleteBinLine /></button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Belum ada jurnal. Tambah sekarang!</div>
        )}
      </div>

      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg">{editItem.id ? "Edit Jurnal" : "Tambah Jurnal"}</h3>
                <button onClick={() => setEditItem(null)}><RiCloseLine className="text-xl text-gray-400" /></button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Judul</label>
                <input value={editItem.judul || ""} onChange={(e) => setEditItem({ ...editItem, judul: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Kategori</label>
                  <select value={editItem.kategori || "Laporan"} onChange={(e) => setEditItem({ ...editItem, kategori: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                    {JURNAL_KATEGORI.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tanggal</label>
                  <input type="date" value={editItem.tanggal || ""} onChange={(e) => setEditItem({ ...editItem, tanggal: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Jumlah Halaman</label>
                <input type="number" min={0} value={editItem.halaman || 0} onChange={(e) => setEditItem({ ...editItem, halaman: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Deskripsi</label>
                <textarea rows={3} value={editItem.deskripsi || ""} onChange={(e) => setEditItem({ ...editItem, deskripsi: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">File PDF</label>
                {editItem.file_url && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 mb-2">
                    <RiFilePdfLine className="text-rose-500 shrink-0" />
                    <span className="text-xs text-rose-700 truncate flex-1">PDF tersimpan</span>
                    <a href={editItem.file_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-rose-600 font-bold hover:underline shrink-0">Lihat</a>
                    <button onClick={() => setEditItem({ ...editItem, file_url: "" })} className="text-rose-400 hover:text-red-600 shrink-0"><RiCloseLine /></button>
                  </div>
                )}
                <DropZone
                  onFiles={(files) => uploadPdf(files[0])}
                  accept="application/pdf"
                  multiple={false}
                  uploading={uploading}
                  label="Upload PDF"
                  hoverColor="hover:border-rose-400 hover:text-rose-600"
                />
              </div>

              <button onClick={save} disabled={saving || uploading}
                className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan Jurnal"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BeritaSection({ toast }) {
  const [subTab, setSubTab] = useState("artikel");
  return (
    <div>
      <div className="flex gap-2 mb-5 border-b border-gray-100 pb-4">
        {[
          { key: "artikel", label: "Artikel Tulisan", icon: RiArticleLine,  active: "bg-indigo-100 text-indigo-700" },
          { key: "jurnal",  label: "Jurnal PDF",      icon: RiFilePdfLine,  active: "bg-rose-100 text-rose-700"    },
        ].map(({ key, label, icon: Icon, active }) => (
          <button key={key} onClick={() => setSubTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all ${
              subTab === key ? active : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}>
            <Icon /> {label}
          </button>
        ))}
      </div>
      {subTab === "artikel" && <ArtikelSubSection toast={toast} />}
      {subTab === "jurnal"  && <JurnalSubSection  toast={toast} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
const TABS = [
  { key: "pohon",     label: "Pohon",     icon: RiTreeLine,       color: "text-emerald-400", bg: "bg-emerald-500/15" },
  { key: "umkm",     label: "UMKM",      icon: RiStoreLine,      color: "text-orange-400",  bg: "bg-orange-500/15"  },
  { key: "wisata",   label: "Wisata",    icon: RiMapPin2Line,    color: "text-cyan-400",    bg: "bg-cyan-500/15"    },
  { key: "kesehatan",label: "Kesehatan", icon: RiHeartPulseLine, color: "text-rose-400",    bg: "bg-rose-500/15"    },
  { key: "berita",   label: "Berita",    icon: RiNewspaperLine,  color: "text-indigo-400",  bg: "bg-indigo-500/15"  },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pohon");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const showToast = (msg, type = "success") => setToast({ msg, type });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => supabase.auth.getUser().then(({ data }) => setUser(data.user))} />;
  }

  const activeTabData = TABS.find(t => t.key === activeTab);

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ── Header dark ── */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-white/5 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
              <RiDashboardLine className="text-cyan-400 text-lg" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide">Admin Dashboard</h1>
              <p className="text-[11px] text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-500/40 px-3 py-1.5 rounded-full">
            <RiLogoutBoxLine /> Keluar
          </button>
        </div>

        {/* Tab bar — pill style */}
        <div className="max-w-5xl mx-auto px-6 pb-4 flex gap-2 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon, color, bg }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap ${
                activeTab === key
                  ? `${bg} ${color} ring-1 ring-white/10`
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}>
              <Icon /> {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Section title */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-2xl ${activeTabData.bg} border border-white/5 flex items-center justify-center`}>
            <activeTabData.icon className={`text-xl ${activeTabData.color}`} />
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Kelola</p>
            <h2 className="text-lg font-black text-white">{activeTabData.label}</h2>
          </div>
        </div>

        {/* Content card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-white/5">
          {activeTab === "pohon"     && <PohonSection     toast={showToast} />}
          {activeTab === "umkm"      && <UmkmSection      toast={showToast} />}
          {activeTab === "wisata"    && <WisataSection     toast={showToast} />}
          {activeTab === "kesehatan" && <KesehatanSection />}
          {activeTab === "berita"    && <BeritaSection     toast={showToast} />}
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.msg} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
