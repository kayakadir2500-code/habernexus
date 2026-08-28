"use client";

import { useState, useEffect } from "react";
import { Cpu, RefreshCw, CheckCircle2, Save } from "lucide-react";

export default function AiSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [textModels, setTextModels] = useState<{ id: string; name: string }[]>([
    { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash (Varsayılan - En Hızlı & Güncel)" },
    { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Kıdemli & Derin Analiz)" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  ]);

  const [imageModels, setImageModels] = useState<{ id: string; name: string }[]>([
    { id: "imagen-3.0-generate-002", name: "Imagen 3 (Ultra Gerçekçi Basın Fotoğrafı)" },
    { id: "imagen-3.0-fast-generate-001", name: "Imagen 3 Fast" },
    { id: "imagen-4.0-generate-001", name: "Imagen 4 (Yeni Nesil)" },
  ]);

  const [selectedTextModel, setSelectedTextModel] = useState("gemini-3.7-flash");
  const [selectedImageModel, setSelectedImageModel] = useState("imagen-3.0-generate-002");
  const [customModelId, setCustomModelId] = useState("");
  const [dailyTarget, setDailyTarget] = useState(10);
  const [isAutoPublish, setIsAutoPublish] = useState(true);

  // Veritabanından mevcut ayarları yükle
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.activeTextModel) setSelectedTextModel(data.settings.activeTextModel);
          if (data.settings.activeImageModel) setSelectedImageModel(data.settings.activeImageModel);
          if (data.settings.dailyTarget) setDailyTarget(data.settings.dailyTarget);
          if (typeof data.settings.isAutoPublish === "boolean") setIsAutoPublish(data.settings.isAutoPublish);
        }
      })
      .catch(() => {});
  }, []);

  const handleFetchLiveModels = async () => {
    setFetchingModels(true);
    try {
      const res = await fetch("/api/ai/models");
      const data = await res.json();
      if (data.textModels && data.textModels.length > 0) {
        setTextModels(data.textModels);
      }
      if (data.imageModels && data.imageModels.length > 0) {
        setImageModels(data.imageModels);
      }
    } catch (e) {
      console.error("Model çekme hatası:", e);
    } finally {
      setFetchingModels(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const finalModel = customModelId.trim() || selectedTextModel;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeTextModel: finalModel,
          activeImageModel: selectedImageModel,
          dailyTarget,
          isAutoPublish,
        }),
      });

      if (res.ok) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (e) {
      console.error("Kaydetme hatası:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Cpu className="w-7 h-7 text-sky-400" />
          <span>Yapay Zeka Model & Çalışma Ayarları</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Haberleri araştırıp yazan Gemini ve görselleri üreten Imagen modellerini canlı yönetin.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Yapay zeka ayarları başarıyla veritabanına kaydedildi ve tüm sisteme uygulandı.</span>
        </div>
      )}

      {/* Model Seçim Kutusu */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Google Yapay Zeka Modelleri</h2>
            <p className="text-xs text-slate-400">Google API'den hesabınıza açık güncel modelleri listeleyin</p>
          </div>

          <button
            onClick={handleFetchLiveModels}
            disabled={fetchingModels}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 text-slate-200 text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingModels ? "animate-spin text-sky-400" : ""}`} />
            <span>{fetchingModels ? "Sorgulanıyor..." : "Modelleri Google'dan Güncelle"}</span>
          </button>
        </div>

        {/* 1. Yazar Modeli */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            Haber Araştırma & Yazım Modeli (Gemini)
          </label>
          <select
            value={selectedTextModel}
            onChange={(e) => setSelectedTextModel(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {textModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Görsel Modeli */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            16:9 Basın Fotoğrafı Üretim Modeli (Imagen)
          </label>
          <select
            value={selectedImageModel}
            onChange={(e) => setSelectedImageModel(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {imageModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Özel Model ID */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <label className="text-xs font-semibold text-slate-400 block">
            Özel / Yeni Çıkan Model ID (İsteğe Bağlı):
          </label>
          <input
            type="text"
            placeholder="Örn: gemini-4.0-pro-preview veya imagen-4.0-generate"
            value={customModelId}
            onChange={(e) => setCustomModelId(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
          />
          <p className="text-[11px] text-slate-500">
            Google yeni bir model duyurduğunda, listeye düşmesini beklemeden buraya doğrudan model kodunu yazabilirsiniz.
          </p>
        </div>
      </div>

      {/* Otomasyon ve Yayın Ayarları */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Otonom Yayın & Zamanlama Kuralları
        </h2>

        {/* Günlük Hedef Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300">Günlük Otonom Hedef Haber Sayısı:</span>
            <span className="font-mono font-bold text-sky-400 text-base">{dailyTarget} Haber / Gün</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={dailyTarget}
            onChange={(e) => setDailyTarget(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>

        {/* Otomatik Yayınlama Switch */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            <div className="text-sm font-semibold text-white">Anında Canlıya Alma & Google İndeksleme</div>
            <div className="text-xs text-slate-400">Üretilen haber onay beklemeden doğrudan yayına girsin ve Google botuna ping atılsın</div>
          </div>
          <button
            onClick={() => setIsAutoPublish(!isAutoPublish)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              isAutoPublish ? "bg-emerald-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isAutoPublish ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4 fill-slate-950" />
        <span>{loading ? "Kaydediliyor..." : "Tüm Yapay Zeka Ayarlarını Kaydet"}</span>
      </button>
    </div>
  );
}