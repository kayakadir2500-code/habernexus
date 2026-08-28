"use client";

import { useState } from "react";
import { Plus, X, Loader2, CheckCircle2, UserPlus } from "lucide-react";

const ALL_CATEGORIES = [
  "GUNDEM",
  "TEKNOLOJI",
  "EKONOMI",
  "DUNYA",
  "SPOR",
  "OTOMOTIV",
  "BILIM",
  "SAGLIK",
];

export function PersonaModal({ onCreated }: { onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [tone, setTone] = useState("Profesyonel, analitik ve akıcı");
  const [selectedCats, setSelectedCats] = useState<string[]>(["GUNDEM"]);

  const toggleCat = (cat: string) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter((c) => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !bio) return;

    setLoading(true);
    try {
      const res = await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          bio,
          avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
          categories: selectedCats,
          tone,
        }),
      });

      if (res.ok) {
        setIsOpen(false);
        setName("");
        setRole("");
        setBio("");
        setAvatarUrl("");
        onCreated();
      }
    } catch (e) {
      console.error("Persona eklenirken hata:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        <span>Yeni Yazar Personası Ekle</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni AI Yazar Personası Tanımla</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Yazar Adı & Soyadı:</label>
                <input
                  type="text"
                  placeholder="Örn: Caner Demir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Unvan / Rol:</label>
                <input
                  type="text"
                  placeholder="Örn: Kıdemli Ekonomi & Finans Analisti"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Biyografi & Uzmanlık Geçmişi:</label>
                <textarea
                  placeholder="Yazarın deneyimi, uzmanlaştığı konular ve analiz yeteneği..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Profil Fotoğrafı URL (İsteğe bağlı):</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">İlgilendiği Kategoriler:</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CATEGORIES.map((cat) => {
                    const isSelected = selectedCats.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCat(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          isSelected
                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || !name || !role || !bio}
                  className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold transition-all disabled:opacity-40"
                >
                  {loading ? "Kaydediliyor..." : "Personayı Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}