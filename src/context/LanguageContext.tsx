"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    nav: {
      menuTitle: "Menu",
      close: "Close",
      home: "Home",
      trapNews: "Trap News",
      shop: "Shop",
      about: "About",
      events: "Events",
      upcomingEvents: "Upcoming Events",
      pastEvents: "Past Events",
      cartLabel: "Open cart",
      hamburgerOpen: "Open menu",
      hamburgerClose: "Close menu",
    },
    auth: {
      dashboard: "Dashboard",
      signOut: "Sign out",
      signIn: "Sign in",
      signUp: "Sign up",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  es: {
    nav: {
      menuTitle: "Menú",
      close: "Cerrar",
      home: "Inicio",
      trapNews: "Noticias Trap",
      shop: "Tienda",
      about: "Acerca de",
      events: "Eventos",
      upcomingEvents: "Próximos Eventos",
      pastEvents: "Eventos Pasados",
      cartLabel: "Abrir carrito",
      hamburgerOpen: "Abrir menú",
      hamburgerClose: "Cerrar menú",
    },
    auth: {
      dashboard: "Panel",
      signOut: "Cerrar sesión",
      signIn: "Iniciar sesión",
      signUp: "Crear cuenta",
    },
    footer: {
      rights: "Todos los derechos reservados.",
    },
  },
} as const;

export type SupportedLanguage = keyof typeof translations;
type Dictionary = (typeof translations)[SupportedLanguage];

type LanguageContextValue = {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  dictionary: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<SupportedLanguage>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tc-lang") as SupportedLanguage | null;
      if (stored && stored in translations) {
        setLang(stored);
      }
    } catch (error) {
      console.warn("Unable to read saved language preference", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tc-lang", lang);
    } catch (error) {
      console.warn("Unable to persist language preference", error);
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      dictionary: translations[lang],
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
