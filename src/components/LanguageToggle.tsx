import React from "react";
import type { SupportedLanguage } from "@/context/LanguageContext";

type Props = {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  pillStyle?: boolean;
};

export default function LanguageToggle({ value, onChange, pillStyle }: Props) {
  if (pillStyle) {
    return (
      <div className="flex items-center">
        <div className="flex items-center bg-black/80 border-2 border-[#FF7A2A] rounded-full px-1 py-0.5 shadow-lg" style={{ minWidth: 64 }}>
          <button
            className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold transition-colors duration-200 focus:outline-none ${
              value === "en"
                ? "bg-[#FF7A2A] text-white shadow"
                : "bg-transparent text-white"
            }`}
            onClick={() => onChange("en")}
            aria-pressed={value === "en"}
            style={{ minWidth: 28 }}
          >
            EN
          </button>
          <button
            className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold transition-colors duration-200 focus:outline-none ${
              value === "es"
                ? "bg-[#FF7A2A] text-white shadow"
                : "bg-transparent text-white"
            }`}
            onClick={() => onChange("es")}
            aria-pressed={value === "es"}
            style={{ minWidth: 28 }}
          >
            ES
          </button>
        </div>
      </div>
    );
  }
  const glowColor = value === "en" ? "#FF7A2A" : "#8C5BFF";

  return (
    <div className="relative">
      <div
        className="relative flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg px-0.5 py-0.5 transition-all duration-300 hover:scale-105"
        style={{ boxShadow: `0 0 10px ${glowColor}` }}
      >
        <div
          className={`pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-[#FF7A2A] to-[#8C5BFF] transition-transform duration-300 ease-out ${
            value === "es" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <button
          className={`relative z-10 flex-1 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide transition-colors duration-200 ${
            value === "en" ? "text-black" : "text-white/70"
          }`}
          onClick={() => onChange("en")}
          aria-pressed={value === "en"}
        >
          EN
        </button>
        <button
          className={`relative z-10 flex-1 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide transition-colors duration-200 ${
            value === "es" ? "text-black" : "text-white/70"
          }`}
          onClick={() => onChange("es")}
          aria-pressed={value === "es"}
        >
          ES
        </button>
      </div>
    </div>
  );
}
