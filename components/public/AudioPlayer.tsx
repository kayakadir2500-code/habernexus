"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, FastForward, Radio } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string | null;
  title: string;
  summary: string;
}

export function AudioPlayer({ audioUrl, title, summary }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isSpeechSynthesis, setIsSpeechSynthesis] = useState(false);

  useEffect(() => {
    if (!audioUrl && typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSpeechSynthesis(true);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (isSpeechSynthesis) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const text = `${title}. Haber özeti: ${summary}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "tr-TR";
        utterance.rate = playbackRate;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const changeSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    if (isPlaying && isSpeechSynthesis) {
      togglePlay();
      setTimeout(togglePlay, 100);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/20 shadow-xl">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Sol Bilgi */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5" />
              <span>Sesli Haber Bülteni</span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              Bu haberi sesli olarak dinleyin
            </div>
          </div>
        </div>

        {/* Kontroller */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={changeSpeed}
            className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            {playbackRate}x
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/30 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Durdur</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Haberi Dinle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {duration > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}