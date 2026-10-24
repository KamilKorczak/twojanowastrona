"use client";

import React, { useState, useEffect, useRef } from "react";

// --- SILNIK ANIMACJI SEKCJI ---
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.1 });
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

export default function Kontakt() {
  const [formData, setFormData] = useState({ name: "", phone: "", time: "asap", message: "" });
  const [status, setStatus] = useState("");
  const [scrollY, setScrollY] = useState(0);

  // Efekt Parallax dla tła
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- OBSŁUGA WYSYŁKI PRZEZ WEB3FORMS ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Wysyłanie wiadomości...");

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.append("access_key", "e44f0f1b-bc96-41d4-9a5b-e08af7ec7f0f");
    formDataObj.append("temat", "Nowa wiadomość z zakładki KONTAKT - twojanowastrona24.pl");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Wiadomość wysłana! Odezwę się do Ciebie w wybranym przedziale czasowym.");
        setFormData({ name: "", phone: "", time: "asap", message: "" });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("Wystąpił błąd podczas wysyłania. Spróbuj ponownie za chwilę lub zadzwoń bezpośrednio.");
      }
    } catch (error) {
      setStatus("Błąd połączenia z serwerem. Sprawdź połączenie internetowe.");
    }
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-32">
      {/* Tło Parallax Premium */}
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=3840&q=80')",
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19] z-0"></div>

      <section className="pt-20 px-6 max-w-6xl mx-auto w-full relative z-10">
        <Reveal delay={0}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8 uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Jesteśmy dla Ciebie
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white drop-shadow-lg flex flex-col items-center justify-center">
               <div><HoverLetters text="Porozmawiajmy o" /></div>
               <div className="mt-2 text-blue-400 p-2 hover:text-blue-300 transition-colors duration-300 hover:scale-105 transform">
                 Twoim biznesie.
               </div>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mt-4">
              Masz pytania? Chcesz omówić projekt? Zostaw wiadomość lub zadzwoń. Jesteśmy od tego by doradzić Ci najlepsze rozwiązanie.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
          {/* Lewa strona - Dane kontaktowe */}
          <Reveal delay={150} className="h-full">
            <div className="bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-slate-800 hover:border-slate-700 transition duration-300 rounded-3xl p-10 h-full shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-10">Bezpośredni kontakt</h3>
              
              <div className="space-y-10">
                {/* Telefon */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-blue-900/30 border border-blue-500/30 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                    <svg className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-1">Zadzwoń do nas</div>
                    <a href="tel:518496254" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">518 496 254</a>
                    <div className="mt-3 text-sm text-slate-400 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-lg inline-block">
                      <span className="text-blue-400 font-bold">24/7</span> – Jeśli nie odbierzemy, oddzwonimy tak szybko jak to możliwe.
                    </div>
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex items-center sm:items-start gap-4 sm:gap-5 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-900/30 border border-blue-500/30 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="overflow-hidden flex flex-col justify-center">
                    <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-500 mb-0.5 sm:mb-1">Napisz e-mail</div>
                    <a href="mailto:twojanowastrona24@gmail.com" className="text-[13px] sm:text-xl font-bold text-white hover:text-blue-400 transition-colors whitespace-nowrap tracking-tight">twojanowastrona24@gmail.com</a>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50 mt-10">
                  <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Znajdziesz nas również tutaj:</div>
                  <div className="flex flex-wrap gap-4">
                    {/* Przyciski Social Media */}
                    <a href="https://www.facebook.com/share/1P4L9b1vcC/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-blue-600/10 transition-all duration-300 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 group" title="Facebook">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/twojanowastrona24?dlrf=ZHloOWozdWJ0c2s%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 border border-slate-700 hover:border-pink-500 hover:bg-pink-500/10 transition-all duration-300 rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 group" title="Instagram">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    <a href="https://wa.me/48518496254" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 border border-slate-700 hover:border-green-500 hover:bg-green-500/10 transition-all duration-300 rounded-full flex items-center justify-center text-slate-400 hover:text-green-500 group" title="WhatsApp">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/kamil-k-a54484374" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 border border-slate-700 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 group" title="LinkedIn">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Prawa strona - Formularz Web3Forms */}
          <Reveal delay={300} className="h-full">
            <div className="bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-blue-500/20 rounded-3xl p-10 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Umówmy się na rozmowę</h3>
              <p className="text-sm text-slate-400 mb-8 relative z-10">Wypełnij formularz i wybierz godzinę, która Ci odpowiada.</p>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 focus-within:text-blue-400 transition-colors">Imię i Nazwisko</label>
                    <input 
                      type="text" 
                      name="imie_nazwisko"
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-base sm:text-sm" 
                      placeholder="Jan Kowalski" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 focus-within:text-blue-400 transition-colors">Telefon</label>
                    <input 
                      type="tel" 
                      name="telefon"
                      required 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-base sm:text-sm" 
                      placeholder="+48 000 000 000" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 focus-within:text-blue-400 transition-colors">Preferowana godzina kontaktu</label>
                  <select 
                    name="preferowana_godzina"
                    value={formData.time} 
                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                    className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-base sm:text-sm cursor-pointer appearance-none"
                  >
                    <option value="Jak najszybciej">Jak najszybciej</option>
                    <option value="Rano (8:00 - 12:00)">Rano (8:00 - 12:00)</option>
                    <option value="Popołudnie (12:00 - 16:00)">Popołudnie (12:00 - 16:00)</option>
                    <option value="Wieczór (16:00 - 20:00)">Wieczór (16:00 - 20:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 focus-within:text-blue-400 transition-colors">O czym chcesz porozmawiać? (Opcjonalnie)</label>
                  <textarea 
                    name="wiadomosc"
                    rows={4} 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-base sm:text-sm resize-none" 
                    placeholder="Np. potrzebuję nowej strony dla mechanika z systemem rezerwacji..." 
                  />
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 mt-4">
                  Zgłoś chęć kontaktu
                </button>

                {status && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm text-center font-medium mt-4 animate-pulse">
                    {status}
                  </div>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}