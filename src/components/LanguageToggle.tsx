import React from "react";
import type { SupportedLanguage } from "@/context/LanguageContext";
import type { CSSProperties } from "react";

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
  const glowColor = value === "en" ? "rgba(255, 122, 42, 0.55)" : "rgba(140, 91, 255, 0.5)";
  const glowStyle = { "--language-toggle-glow": glowColor } as CSSProperties;

  return (
    <div className="language-toggle" style={glowStyle}>
      <div
        className={`language-toggle__thumb ${value === "es" ? "language-toggle__thumb--right" : ""}`}
      />
      <button
        type="button"
        className={`language-toggle__button ${value === "en" ? "is-active" : ""}`}
        onClick={() => onChange("en")}
        aria-pressed={value === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={`language-toggle__button ${value === "es" ? "is-active" : ""}`}
        onClick={() => onChange("es")}
        aria-pressed={value === "es"}
      >
        ES
      </button>
    </div>
  );
}
