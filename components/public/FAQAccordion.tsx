"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full my-8 p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-4 text-sky-400">
        <HelpCircle className="w-5 h-5" />
        <h3 className="text-lg font-bold text-slate-100">Sıkça Sorulan Sorular (SSS)</h3>
      </div>

      <div className="space-y-3">
        {items.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/50 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 hover:text-sky-400 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-sky-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800/40 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
