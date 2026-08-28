"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PersonaModal } from "@/components/admin/PersonaModal";
import { Users, CheckCircle2, Loader2 } from "lucide-react";

export function PersonaListClient({ initialPersonas }: { initialPersonas: any[] }) {
  const [personas, setPersonas] = useState<any[]>(initialPersonas || []);
  const [loading, setLoading] = useState(false);

  const refreshPersonas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/personas");
      const data = await res.json();
      if (data.personas) {
        setPersonas(data.personas);
      }
    } catch (e) {
      console.error("Personalar yenilenemedi:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>Yapay Zeka Yazar Personaları ({personas.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Her biri farklı uzmanlık alanına ve üsluba sahip sanal editör kadrosu
          </p>
        </div>

        <PersonaModal onCreated={refreshPersonas} />
      </div>

      {loading && (
        <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Personalar güncelleniyor...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-md"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shrink-0">
                  <Image
                    src={p.avatarUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>{p.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  </h3>
                  <div className="text-xs text-indigo-300 font-medium">{p.role}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                {p.bio}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex flex-wrap gap-1.5">
                {p.categories.map((cat: string) => (
                  <span key={cat} className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="text-[11px] italic text-slate-400 truncate max-w-[180px]">
                  {p.tone}
                </span>
                <span className="font-semibold text-sky-400">
                  {p._count?.articles || 0} Makale
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}