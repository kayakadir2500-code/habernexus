import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface PersonaCardProps {
  persona: {
    id: string;
    name: string;
    slug: string;
    role: string;
    bio: string;
    avatarUrl: string;
  };
}

export function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <div className="w-full my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-sky-500/40 shrink-0 shadow-lg">
          <Image
            src={persona.avatarUrl}
            alt={persona.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/yazar/${persona.slug}`}
              className="text-lg font-bold text-slate-100 hover:text-sky-400 transition-colors"
            >
              {persona.name}
            </Link>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
              <CheckCircle2 className="w-3 h-3 text-sky-400" />
              <span>Doğrulanmış Kıdemli Yazar</span>
            </span>
          </div>

          <div className="text-xs font-medium text-slate-400 mt-0.5">
            {persona.role}
          </div>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed line-clamp-2">
            {persona.bio}
          </p>
        </div>
      </div>
    </div>
  );
}