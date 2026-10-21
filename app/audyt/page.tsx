"use client";

import React, { useState, useEffect, useRef } from "react";

// --- SILNIK ANIMACJI SEKCJI ---
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
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
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: `${delay}ms` }}>
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

// --- EFEKT PISANIA NA MASZYNIE (Typewriter) ---
const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        timeoutId = setTimeout(() => {}, 500); 
      } else {
        timeoutId = setTimeout(() => {
          setCurrentText(word.substring(0, currentText.length - 1));
        }, 50); 
      }
    } else {
      if (currentText === word) {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); 
      } else {
        timeoutId = setTimeout(() => {
          setCurrentText(word.substring(0, currentText.length + 1));
        }, 100); 
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-red-400 inline-block min-w-[300px] text-center sm:text-left">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default function Audyt() {
  const [formData, setFormData] = useState({ 
    url: "", 
    problem: "", 
    contactPreference: "email", // domyślny wybór preferencji
    email: "", 
    phone: "" 
  });
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
    setStatus("Wysyłanie zgłoszenia na audyt...");

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.append("access_key", "e44f0f1b-bc96-41d4-9a5b-e08af7ec7f0f");
    formDataObj.append("temat", "Nowe zlecenie darmowego audytu z twojanowastrona.pl");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Analiza zlecona! Skontaktujemy się z Tobą najszybciej jak to możliwe.");
        setFormData({ url: "", problem: "", contactPreference: "email", email: "", phone: "" });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("Wystąpił błąd podczas wysyłania. Spróbuj ponownie za chwilę.");
      }
    } catch (error) {
      setStatus("Błąd połączenia z serwerem. Sprawdź połączenie internetowe.");
    }
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-32">
      {/* Tło Parallax Premium */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=3840&q=80')",
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/80 to-[#0B0F19] z-0"></div>

      <div className="relative z-10 w-full max-w-4xl px-6 mx-auto text-center">
        <Reveal delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Bezpłatna Ekspertyza (24-48h)
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-lg flex flex-col items-center justify-center">
            <div>
              <HoverLetters text="Dlaczego Twoja strona" />
            </div>
            <div className="mt-2">
              <TypewriterEffect words={[
                "nie sprzedaje?", 
                "jest wolna?", 
                "odstrasza klientów?", 
                "wygląda staro?", 
                "nie ma jej w Google?"
              ]} />
            </div>
          </h1>
          
          <p className="text-lg text-slate-400 font-light mb-12 max-w-2xl mx-auto mt-4">
            Prześlij nam link do swojej witryny, a my przeprowadzimy darmowy audyt. Wskażemy 3 główne błędy, które odstraszają Twoich klientów i powodują utratę zysków.
          </p>
        </Reveal>

        {/* QUIZ / Formularz połączony z Web3Forms */}
        <Reveal delay={200}>
          <div className="bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-slate-800 rounded-3xl p-8 sm:p-12 text-left shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              
              {/* Krok 1 */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-lg shadow-blue-600/30">1</span>
                  Gdzie znajduje się Twoja obecna strona?
                </h3>
                <input 
                  type="url" 
                  name="adres_strony_www"
                  required 
                  value={formData.url} 
                  onChange={(e) => setFormData({...formData, url: e.target.value})} 
                  className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" 
                  placeholder="np. https://mojastrona.pl" 
                />
              </div>

              {/* Krok 2 */}
              <div className="pt-8 border-t border-slate-800/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-lg shadow-blue-600/30">2</span>
                  Z czym jest największy problem?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Strona wygląda na przestarzałą",
                    "Ładuje się bardzo wolno",
                    "Nie mam z niej zapytań i telefonów",
                    "Nie wyświetla się poprawnie na komórce",
                    "Nie ma jej w Google",
                    "Inny problem / Nie wiem"
                  ].map((prob, idx) => (
                    <label key={idx} className={`cursor-pointer px-4 py-3.5 rounded-xl border transition-all text-sm flex items-center gap-3 ${formData.problem === prob ? "bg-blue-600/20 border-blue-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"}`}>
                      <input 
                        type="radio" 
                        name="glowny_problem" 
                        value={prob} 
                        checked={formData.problem === prob} 
                        onChange={(e) => setFormData({...formData, problem: e.target.value})} 
                        className="hidden" 
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.problem === prob ? "border-blue-500" : "border-slate-600"}`}>
                        {formData.problem === prob && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                      </div>
                      {prob}
                    </label>
                  ))}
                </div>
              </div>

              {/* Krok 3 - Wpisanie danych i ZAZNACZENIE PREFERENCJI */}
              <div className="pt-8 border-t border-slate-800/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-lg shadow-blue-600/30">3</span>
                  Gdzie przesłać wyniki audytu?
                </h3>
                
                {/* Oba pola widoczne cały czas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Twój E-mail</label>
                    <input 
                      type="email" 
                      name="adres_email"
                      required={formData.contactPreference === "email"} 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" 
                      placeholder="kontakt@firma.pl" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Twój Telefon</label>
                    <input 
                      type="tel" 
                      name="numer_telefonu"
                      required={formData.contactPreference === "phone"} 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" 
                      placeholder="+48 000 000 000" 
                    />
                  </div>
                </div>

                {/* Wybór preferencji kontaktu (wyraźne przyciski) */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-center sm:text-left">
                    W jaki sposób wolisz otrzymać wyniki? Zaznacz preferowaną formę:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className={`cursor-pointer flex-1 py-3 px-4 rounded-xl border text-center font-medium text-sm transition-all flex items-center justify-center gap-3 ${formData.contactPreference === 'email' ? "bg-blue-600/20 border-blue-500 text-white" : "bg-[#0B0F19] border-slate-700 text-slate-500 hover:border-slate-500"}`}>
                      <input 
                        type="radio" 
                        name="preferowany_kontakt" 
                        value="email" 
                        checked={formData.contactPreference === "email"} 
                        onChange={(e) => setFormData({...formData, contactPreference: e.target.value})} 
                        className="hidden" 
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.contactPreference === 'email' ? "border-blue-500" : "border-slate-600"}`}>
                        {formData.contactPreference === 'email' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                      </div>
                      Wybieram kontakt E-mail
                    </label>
                    <label className={`cursor-pointer flex-1 py-3 px-4 rounded-xl border text-center font-medium text-sm transition-all flex items-center justify-center gap-3 ${formData.contactPreference === 'phone' ? "bg-blue-600/20 border-blue-500 text-white" : "bg-[#0B0F19] border-slate-700 text-slate-500 hover:border-slate-500"}`}>
                      <input 
                        type="radio" 
                        name="preferowany_kontakt" 
                        value="phone" 
                        checked={formData.contactPreference === "phone"} 
                        onChange={(e) => setFormData({...formData, contactPreference: e.target.value})} 
                        className="hidden" 
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.contactPreference === 'phone' ? "border-blue-500" : "border-slate-600"}`}>
                        {formData.contactPreference === 'phone' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                      </div>
                      Wybieram kontakt Telefoniczny
                    </label>
                  </div>
                </div>

              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 mt-6">
                Rozpocznij darmową analizę
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
    </div>
  );
}