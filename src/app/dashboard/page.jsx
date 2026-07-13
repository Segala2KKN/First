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
    const urls = await Promise.all(
      Array.from(files).map((f) => uploadFoto(f, "pohon"))
    );
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
        {list.map((p) => (
          <div key={p.id} className={`flex items-center gap-4 bg-gradient-to-r ${p.warna} p-3 rounded-2xl shadow-sm`}>
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
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-600 text-sm px-4 py-3 rounded-xl w-full justify-center transition-colors">
                  <RiUploadCloud2Line /> Upload Foto
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => uploadFotos(e.target.files)} />
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
  const fileRef = useRef();

  const load = async () => {
    const { data } = await supabase.from("umkm").select("*").order("urutan");
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const blank = () => ({ nama_usaha: "", pemilik: "", kategori: "Kuliner", produk: "", deskripsi: "", kontak: "", alamat: "", foto_url: "", urutan: list.length + 1 });

  const save = async () => {
    setSaving(true);
    try {
      if (editItem.id) {
        const { id, created_at, ...rest } = editItem;
        await supabase.from("umkm").update(rest).eq("id", id);
      } else {
        await supabase.from("umkm").insert(editItem);
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

  const uploadFotoUmkm = async (file) => {
    const url = await uploadFoto(file, "umkm");
    setEditItem((prev) => ({ ...prev, foto_url: url }));
  };

  if (loading) return <div className="text-gray-400 text-sm py-8 text-center">Memuat...</div>;

  const KATEGORI = ["Kuliner", "Kerajinan", "Jasa", "Pertanian", "Perdagangan"];

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
              {u.foto_url ? <Image src={u.foto_url} alt="" width={48} height={48} className="object-cover w-full h-full" /> : <RiStoreLine className="text-orange-400 text-xl" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{u.nama_usaha}</p>
              <p className="text-gray-400 text-xs">{u.pemilik} · {u.kategori}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem(u)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl p-2 transition-colors"><RiEditLine /></button>
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
                { label: "Kontak (No. HP)", key: "kontak" },
                { label: "Alamat", key: "alamat" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={editItem[key] || ""} onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Kategori</label>
                <select value={editItem.kategori || "Kuliner"} onChange={(e) => setEditItem({ ...editItem, kategori: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Foto</label>
                {editItem.foto_url && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editItem.foto_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <button onClick={() => setEditItem({ ...editItem, foto_url: "" })} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 text-xs"><RiCloseLine /></button>
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-orange-400 text-gray-500 hover:text-orange-600 text-sm px-4 py-3 rounded-xl w-full justify-center transition-colors">
                  <RiUploadCloud2Line /> Upload Foto
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files[0] && uploadFotoUmkm(e.target.files[0])} />
              </div>

              <button onClick={save} disabled={saving}
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

  const load = async () => {
    const { data } = await supabase.from("wisata").select("*").order("urutan");
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const blank = () => ({ nama: "", deskripsi: "", kategori: "Alam", rating: "4.5", tipe: "", jam: "", maps_url: "", warna: "from-green-700 to-emerald-400", urutan: list.length + 1 });

  const save = async () => {
    setSaving(true);
    try {
      if (editItem.id) {
        const { id, created_at, ...rest } = editItem;
        await supabase.from("wisata").update(rest).eq("id", id);
      } else {
        await supabase.from("wisata").insert(editItem);
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
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{w.nama}</p>
              <p className="text-white/70 text-xs">{w.kategori} · ★ {w.rating}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditItem(w)} className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-colors"><RiEditLine /></button>
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

              <button onClick={save} disabled={saving}
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
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
const TABS = [
  { key: "pohon",     label: "Pohon",     icon: RiTreeLine,       color: "text-green-600" },
  { key: "umkm",     label: "UMKM",      icon: RiStoreLine,      color: "text-orange-500" },
  { key: "wisata",   label: "Wisata",    icon: RiMapPin2Line,    color: "text-blue-600" },
  { key: "kesehatan",label: "Kesehatan", icon: RiHeartPulseLine, color: "text-rose-500" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pohon");
  const [toast, setToast] = useState(null); // {msg, type}

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    // Listen to auth state changes
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => supabase.auth.getUser().then(({ data }) => setUser(data.user))} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-gray-900">Dashboard Admin</h1>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <RiLogoutBoxLine /> Keluar
          </button>
        </div>

        {/* Tab Bar */}
        <div className="max-w-4xl mx-auto px-6 flex gap-1 overflow-x-auto pb-px">
          {TABS.map(({ key, label, icon: Icon, color }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === key
                  ? `${color} border-current`
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}>
              <Icon /> {label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === "pohon" && <PohonSection toast={showToast} />}
        {activeTab === "umkm" && <UmkmSection toast={showToast} />}
        {activeTab === "wisata" && <WisataSection toast={showToast} />}
        {activeTab === "kesehatan" && <KesehatanSection />}
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
