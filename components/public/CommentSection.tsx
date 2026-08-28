"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, User, ThumbsUp, CheckCircle2 } from "lucide-react";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  user?: { name: string | null; image: string | null };
}

export function CommentSection({ newsId }: { newsId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?newsId=${newsId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      console.error("Yorumlar yüklenemedi:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsId,
          content: newComment,
          authorName: authorName.trim() || "HaberNexus Okuru",
        }),
      });

      if (res.ok) {
        setNewComment("");
        setSubmitted(true);
        fetchComments();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (e) {
      console.error("Yorum gönderme hatası:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
        <MessageSquare className="w-5 h-5 text-sky-400" />
        <h3>Okur Yorumları ({comments.length})</h3>
      </div>

      {/* Yorum Gönderme Formu */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Adınız veya Takma Adınız (İsteğe bağlı)..."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 sm:w-1/3"
          />
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Bu haber hakkındaki düşüncenizi paylaşın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 pr-24 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gönder</span>
            </button>
          </div>
        </div>

        {submitted && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Yorumunuz başarıyla yayınlandı. Teşekkür ederiz!</span>
          </div>
        )}
      </form>

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            Bu habere henüz yorum yapılmamış. İlk yorumu siz yapın!
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">
                    {c.user?.name ? c.user.name[0].toUpperCase() : "O"}
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {c.user?.name || "HaberNexus Okuru"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-9">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}