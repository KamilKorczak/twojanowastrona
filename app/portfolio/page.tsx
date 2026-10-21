"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// --- SILNIK ANIMACJI ---
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- SILNIK ANIMACJI LITER NA HOVER ---
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

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);

  // Efekt Parallax dla tła
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 8 projektów zawierających TYLKO samą kategorię i zdjęcie
  const projects = [
    { category: "Architektura & Portfolio", image: "/mockup-1.jpg" },
    { category: "Hotelarstwo & Nieruchomości", image: "/mockup-2.jpg" },
    { category: "Gastronomia", image: "/mockup-3.jpg" },
    { category: "Kosmetyka", image: "/mockup-4.jpg" },
    { category: "Architektura Wnętrz", image: "/mockup-5.jpg" },
    { category: "Motoryzacja & Serwis", image: "/mockup-6.jpg" },
    { category: "Fotografia", image: "/mockup-7.jpg" },
    { category: "Agencja & Biznes B2B", image: "/mockup-8.jpg" }
  ];

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-32">
      {/* Tło Parallax Premium */}
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=3840&q=80')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19] z-0"></div>

      {/* Hero Portfolio */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center relative z-10 w-full">
        <Reveal delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8 uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Nasze możliwości
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg flex flex-col items-center justify-center">
             <div className="flex flex-wrap justify-center gap-2">
               <HoverLetters text="Zobacz więcej projektów w naszym wykonaniu" />
             </div>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light mt-6">
            Przejrzyj nasze portfolio i zainspiruj się rozwiązaniami, które wdrożyliśmy dla innych klientów.
          </p>
        </Reveal>
      </section>

      {/* Grid Realizacji - 8 elementów */}
      <section className="px-6 pb-24 max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <Reveal delay={idx * 100} key={idx} className="h-full">
              <div className="group bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500 flex flex-col h-full">
                
                {/* Górna belka symulująca okno przeglądarki */}
                <div className="h-10 bg-slate-950 flex items-center px-5 gap-2.5 border-b border-slate-800 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors duration-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors duration-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors duration-300"></div>
                </div>
                
                {/* Zdjęcie w całości widoczne (object-contain i aspect-video) */}
                <div className="w-full aspect-video relative bg-slate-950 flex items-center justify-center p-2">
                  <img 
                    src={project.image} 
                    alt={project.category} 
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out rounded-xl" 
                  />
                  {/* Overlay z przyciskiem do kontaktu */}
                  <div className="absolute inset-0 bg-[#0B0F19]/0 group-hover:bg-[#0B0F19]/70 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl m-2">
                    <Link href="/kontakt" className="translate-y-4 group-hover:translate-y-0 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2">
                      Zamów podobną stronę
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                </div>

                {/* Wyśrodkowana Kategoria (tylko jeden element tekstowy) */}
                <div className="p-6 flex-grow flex items-center justify-center bg-gradient-to-br from-slate-900 to-[#0B0F19] border-t border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300 group-hover:text-blue-400 transition-colors text-center">
                    {project.category}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Baner CTA na samym dole */}
      <section className="px-6 pb-12 max-w-5xl mx-auto w-full relative z-10">
        <Reveal delay={0}>
          <div className="bg-gradient-to-r from-blue-900/30 via-slate-900 to-blue-900/10 border border-blue-500/20 rounded-3xl p-10 sm:p-14 text-center shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden group hover:border-blue-500/40 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>
            
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Nie znalazłeś swojej branży?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Bez obaw! Codziennie projektujemy strony dla nietypowych biznesów. Wyślij nam krótką wiadomość, a za darmo naszkicujemy dla Ciebie indywidualny układ, dopasowany do Twoich potrzeb.
            </p>
            <Link href="/kontakt" className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg hover:-translate-y-1 duration-300 relative z-10">
              Poproś o indywidualny projekt
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}