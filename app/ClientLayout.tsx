"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Współdzielone komponenty wizualne dla Layoutu
const HoverLetters = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`inline-block transition-transform duration-300 hover:-translate-y-2 cursor-default ${char === " " ? "w-[0.25em]" : ""} hover:text-blue-400`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const pathname = usePathname(); // Sprawdzamy, na jakiej stronie jesteśmy, żeby podświetlić menu

  return (
    <>
      {/* Nawigacja Globalna */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0B0F19]/90 border-b border-slate-800/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group flex" href="/">
              <HoverLetters text="twoja" />
              <span className="text-blue-500 font-light group-hover:text-blue-400 transition-colors">nowa</span>
              <HoverLetters text="strona.pl" />
            </Link>
            <nav className="hidden lg:flex gap-6 text-sm font-medium">
              <Link 
                href="/" 
                className={`transition-all hover:-translate-y-0.5 duration-300 ${pathname === "/" ? "text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-500" : "text-slate-400 hover:text-white"}`}
              >
                Strona Główna
              </Link>
              <Link 
                href="/portfolio" 
                className={`transition-all hover:-translate-y-0.5 duration-300 ${pathname === "/portfolio" ? "text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-500" : "text-slate-400 hover:text-white"}`}
              >
                Realizacje
              </Link>
              <Link 
                href="/cennik" 
                className={`transition-all hover:-translate-y-0.5 duration-300 ${pathname === "/cennik" ? "text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-500" : "text-slate-400 hover:text-white"}`}
              >
                Cennik usług
              </Link>
              <Link 
                href="/audyt" 
                className={`transition-all hover:-translate-y-0.5 duration-300 ${pathname === "/audyt" ? "text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-500" : "text-slate-400 hover:text-white"}`}
              >
                Darmowy Audyt
              </Link>
              <Link 
                href="/kontakt" 
                className={`transition-all hover:-translate-y-0.5 duration-300 ${pathname === "/kontakt" ? "text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-500" : "text-slate-400 hover:text-white"}`}
              >
                Kontakt
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300 mr-2 border-r border-slate-800 pr-6">
              <a href="mailto:twojanowastrona24@gmail.com" className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group">
                <svg className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                twojanowastrona24@gmail.com
              </a>
            </div>
            <a href="tel:518496254" className="text-sm font-medium text-slate-300 hover:text-white hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group">
              <svg className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              518 496 254
            </a>
          </div>
        </div>
      </header>

      {/* Miejsce na podstrony */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Globalna Rozbudowana Stopka */}
      <footer className="pt-16 pb-12 border-t border-slate-900 bg-[#070A11] text-slate-400 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="text-xl font-bold tracking-tight text-white mb-4 flex">
              twoja<span className="text-blue-500 font-light">nowa</span>strona.pl
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Nowoczesne, szybkie i konwersyjne strony internetowe dla małych i średnich firm. Realizacje z darmowym projektem wstępnym.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Szybka Nawigacja</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Strona Główna</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Realizacje</Link></li>
              <li><Link href="/cennik" className="hover:text-white transition-colors">Cennik usług</Link></li>
              <li><Link href="/audyt" className="hover:text-white transition-colors">Darmowy Audyt</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Dokumenty i Prawo</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka Prywatności</Link></li>
              <li><Link href="/regulamin" className="hover:text-white transition-colors">Regulamin Serwisu</Link></li>
              <li><button onClick={() => setCookieAccepted(false)} className="hover:text-white transition-colors text-left">Polityka Plików Cookies</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Kontakt Bezpośredni</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="mailto:twojanowastrona24@gmail.com" className="hover:text-white transition-colors">twojanowastrona24@gmail.com</a></li>
              <li><a href="tel:518496254" className="hover:text-white transition-colors">Tel: 518 496 254</a></li>
              <li className="text-slate-600 pt-2">Dostępność: Pon-Pt / Dostępni 24/7</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800/60 pt-6 text-center text-xs text-slate-600">
        2026 twojanowastrona.pl. Wszelkie prawa zastrzeżone. Projekt i realizacja: Kamil Korczak.
        </div>
      </footer>

      {/* Globalny Pop-up Cookies */}
      {!cookieAccepted && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-50">
          <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Szanujemy Twoją prywatność.</strong> Używamy plików cookies. Możesz dowiedzieć się więcej, czytając naszą <Link href="/polityka-prywatnosci" className="text-blue-400 hover:underline">Politykę Prywatności</Link>.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setCookieAccepted(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
              >
                Akceptuję i zamykam
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}