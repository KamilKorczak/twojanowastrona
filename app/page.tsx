"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// --- SILNIK ANIMACJI SEKCJI ---
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
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
    <span className="text-red-400 inline-block min-w-[200px] text-left">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", package: "", industry: "" });
  const [status, setStatus] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Wyskakujące okienko (Modal)
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Karuzela i bezpieczne ładowanie strony
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isFormOpen]);

  // ZAKTUALIZOWANE PORTFOLIO Z NOWYMI MAKIETAMI
  const portfolioItems = [
    { title: "Architektura i Wnętrza", desc: "Minimalistyczny design skupiony na portfolio projektów.", type: "Wizytówka Premium", image: "/mockup-architektura.jpg" },
    { title: "Firma Budowlana", desc: "Solidna strona firmowa z pełną ofertą usług i galerią.", type: "Strona Firmowa", image: "/mockup-budowlana.jpg" },
    { title: "Klinika / Salon Urody", desc: "Elegancka witryna z miejscem na integrację kalendarza wizyt.", type: "Strona + Rezerwacje", image: "/mockup-uroda.jpg" },
    { title: "Biuro Rachunkowe", desc: "Klasyczna, przejrzysta budowa budząca zaufanie w biznesie.", type: "Strona Firmowa", image: "/mockup-ksiegowosc.jpg" }
  ];

  const faqs = [
    { 
      q: "Ile czasu zajmuje stworzenie nowej strony internetowej?", 
      a: "Zazwyczaj jest to około 7 dni roboczych od momentu akceptacji wstępnego projektu koncepcyjnego i przekazania materiałów. Czas ten może się nieznacznie wydłużyć w przypadku rozbudowy o dodatkowe moduły." 
    },
    { 
      q: "Nie mam własnych tekstów, zdjęć ani logo. Czy pomożecie?", 
      a: "Oczywiście. Oferujemy profesjonalny copywriting sprzedażowy (píšemy teksty oparte na psychologii klientów), dobieramy profesjonalne zdjęcia oraz możemy wykonać dla Ciebie spójny Branding i Logo Premium." 
    },
    { 
      q: "Jak wyglądają koszty utrzymania strony po jej uruchomieniu?", 
      a: "Każda strona w sieci wymaga hostingu i domeny. Możesz zarządzać tym samodzielnie lub wybrać naszą Opiekę Techniczną (od 199 zł/mc), w której w cenie masz opłacony serwer, domenę, certyfikat SSL, monitoring oraz pulę godzin na bieżące zmiany." 
    },
    { 
      q: "Co w przypadku, gdy wstępny projekt strony mi się nie spodoba?", 
      a: "Pracujemy bez ryzyka. Na start przygotowujemy dla Ciebie darmowy szkic koncepcyjny. Jeśli kierunek wizualny nie do końca spełnia Twoje oczekiwania, na bieżąco wdrażamy Twoje uwagi, dopasowując projekt w 100% do wizji Twojego biznesu." 
    },
    { 
      q: "Czy moja strona będzie dobrze działać na telefonach i tabletaach?", 
      a: "Tak. Wszystkie nasze projekty powstają w technologii w pełni responsywnej (RWD). Witryna automatycznie i płynnie dostosowuje się do każdego ekranu – od małego smartfona po duży monitor 4K." 
    },
    { 
      q: "Kto jest właścicielem strony i domeny po zakończeniu prac?", 
      a: "Po uregulowaniu faktury końcowej stajesz się w 100% jedynym i prawnym właścicielem strony, całego kodu źródłowego oraz przypisanej domeny. Nie stosujemy żadnych ukrytych umów blokujących ani abonamentów przymusowych." 
    }
  ];

  const testimonials = [
    { name: "Tomasz", company: "Warsztat Auto-Fix", text: "Szybko, konkretnie i na temat. Strona w końcu normalnie ładuje się na telefonach, a klienci dzwonią z map. Polecam współpracę." },
    { name: "Anna", company: "Salon Beauty SPA", text: "Bałam się skomplikowanych umów, ale tutaj wszystko było jasne. Świetny kontakt i piękny, nowoczesny design, który chwalą klientki." },
    { name: "Marek", company: "Usługi Remontowe", text: "Agencje chciały ode mnie gigantycznych kwot. Tu dostałem profesjonalną wizytówkę w około 7 dni. Zdecydowanie warto." },
    { name: "Karolina", company: "Biuro Rachunkowe", text: "Pełen profesjonalizm. Wstępny projekt strony dostałam bardzo szybko, a po moich uwagach od razu i bez problemu wprowadzono zmiany." },
    { name: "Piotr", company: "Architekt Wnętrz", text: "Dzięki nowej stronie moje portfolio wreszcie wygląda prestiżowo. Bardzo doceniam bezpośredni kontakt i przejrzysty cennik." },
    { name: "Magda", company: "Gabinet Dietetyczny", text: "Nie miałam tekstów ani pomysłu na witrynę. Pan Kamil zajął się wszystkim od A do Z. Efekt przerósł moje oczekiwania." }
  ];

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextTestimonial = () => setCurrentTestimonialIndex((prev) => (prev + 1) % totalPages);
  const prevTestimonial = () => setCurrentTestimonialIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Wysyłanie zgłoszenia...");

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.append("access_key", "e44f0f1b-bc96-41d4-9a5b-e08af7ec7f0f");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Dziękujemy! Formularz został wysłany. Skontaktujemy się z Tobą wkrótce.");
        setFormData({ name: "", phone: "", email: "", package: "", industry: "" });
        setTimeout(() => setIsFormOpen(false), 2500);
      } else {
        setStatus("Wystąpił błąd podczas wysyłania. Spróbuj ponownie.");
      }
    } catch (error) {
      setStatus("Błąd połączenia z serwerem. Sprawdź internet.");
    }
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-24 text-center flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=3840&q=80')",
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/80 via-[#0B0F19]/70 to-[#0B0F19] z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex-grow flex flex-col justify-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8 tracking-wide uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Twój nowoczesny wizerunek
            </div>
          </Reveal>
          
          <Reveal delay={150}>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.15] mb-8 text-white drop-shadow-lg cursor-default flex flex-col items-center justify-center">
              <div>
                <HoverLetters text="Zamień odwiedzających w" />
              </div>
              <div className="mt-2 text-blue-400 p-2 hover:text-blue-300 transition-all duration-300 hover:scale-105">
                prawdziwych klientów.
              </div>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light drop-shadow-sm">
              Projektujemy szybkie, zoptymalizowane strony internetowe dla firm, które chcą dominować w swojej branży. Otrzymaj wstępny projekt strony bez żadnych zobowiązań.
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1"
              >
                Rozpocznij projekt
              </button>
              <Link href="/cennik" className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-medium rounded-xl transition-all hover:-translate-y-1">
                Sprawdź cennik
              </Link>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs sm:text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2 hover:text-white hover:-translate-y-0.5 transition-all cursor-default">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Certyfikat SSL w cenie
              </div>
              <div className="flex items-center gap-2 hover:text-white hover:-translate-y-0.5 transition-all cursor-default">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Zgodność z RODO
              </div>
              <div className="flex items-center gap-2 hover:text-white hover:-translate-y-0.5 transition-all cursor-default">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Ultraszybkie serwery
              </div>
              <div className="flex items-center gap-2 hover:text-white hover:-translate-y-0.5 transition-all cursor-default">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Jasna umowa i przejrzyste zasady
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. DARMOWY AUDYT */}
      <section className="py-12 bg-gradient-to-r from-[#0B0F19] via-blue-900/20 to-[#0B0F19] border-b border-blue-500/20">
        <Reveal delay={0}>
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 cursor-default">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex flex-wrap items-center gap-3">
                <HoverLetters text="Dlaczego Twoja strona" /> 
                <TypewriterEffect words={["nie sprzedaje?", "jest wolna?", "nie pokazuje się w Google?", "wygląda staro?"]} />
              </h2>
              <p className="text-slate-400 text-sm mt-2">Prześlij nam link do swojej obecnej witryny. Prześwietlimy ją całkowicie za darmo i wskażemy główne błędy, które blokują Twoją sprzedaż w sieci.</p>
            </div>
            <div className="shrink-0">
              <Link href="/audyt" className="inline-block px-8 py-3.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg hover:-translate-y-1 duration-300">
                Zamów darmowy audyt
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. PROCES WSPÓŁPRACY */}
      <section className="px-6 py-24 bg-[#0E131F] border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <Reveal delay={0}>
            <div className="text-center mb-16 cursor-default">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white flex justify-center flex-wrap">
                 <HoverLetters text="Przejrzysty proces współpracy" />
              </h2>
              <p className="text-slate-400">Pełen profesjonalizm na każdym kroku. Zobacz, jak przebiega realizacja.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Reveal delay={100}>
              <div className="relative p-6 bg-slate-900/50 rounded-2xl border border-slate-800 h-full group hover:border-slate-600 transition-colors animate-float" style={{ animationDelay: '0s' }}>
                <div className="text-slate-600 text-3xl font-bold mb-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">01</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Wstępna konsultacja</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Rozpoczynamy od analizy potrzeb biznesowych oraz określenia głównych celów nowej witryny.</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative p-6 bg-slate-900/50 rounded-2xl border border-slate-800 h-full group hover:border-slate-600 transition-colors animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="text-slate-600 text-3xl font-bold mb-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">02</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Wstępny projekt strony</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Przygotowujemy dla Ciebie bezpłatny szkic koncepcyjny. Oceniasz go bez żadnego ryzyka.</p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="relative p-6 bg-slate-900/50 rounded-2xl border border-slate-800 h-full group hover:border-slate-600 transition-colors animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-slate-600 text-3xl font-bold mb-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">03</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Umowa i formalności</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Po akceptacji ustalamy detale, podpisujemy prostą umowę, pobieramy zaliczkę i kodujemy.</p>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="relative p-6 bg-slate-900/50 rounded-2xl border border-slate-800 h-full group hover:border-slate-600 transition-colors animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="text-slate-600 text-3xl font-bold mb-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">04</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Testy i wdrożenie</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Gotowy projekt ląduje na serwerze testowym. Po akceptacji całości uruchamiamy witrynę.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. PORÓWNANIE */}
      <section className="px-6 py-24 bg-[#0B0F19] relative z-10 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <Reveal delay={0}>
            <div className="text-center mb-16 cursor-default">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white flex justify-center flex-wrap">
                 <HoverLetters text="Czym różnimy się od tradycyjnych agencji?" />
              </h2>
              <p className="text-slate-400">Wybierz jakość premium bez korporacyjnych narzutów i skomplikowanych procedur.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal delay={150}>
              <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 opacity-80 hover:opacity-100 transition-opacity h-full">
                <h3 className="text-xl font-bold text-slate-500 mb-8 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Tradycyjna Agencja
                </h3>
                <ul className="space-y-6 text-sm text-slate-400">
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Ukryte koszty i wysokie opłaty administracyjne.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Kontakt przez pośredników i "Account Managerów".</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Taśmowe podejście i dziesiątki projektów naraz.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Długi czas oczekiwania i powolne procesy (tygodnie).</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Skomplikowane umowy z drobnym druczkiem.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Czekanie dniami na drobną poprawkę tekstu.</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-300 relative overflow-hidden h-full">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  twojanowastrona.pl
                </h3>
                <ul className="space-y-6 text-sm text-slate-200">
                  <li className="flex items-start gap-4 group">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <strong className="font-semibold text-white">Płacisz wyłącznie za realną pracę eksperta.</strong>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <strong className="font-semibold text-white">Bezpośredni kontakt z twórcą Twojej strony.</strong>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <strong className="font-semibold text-white">Indywidualne skupienie na Twoim biznesie.</strong>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <strong className="font-semibold text-white">Szybka realizacja w około 7 dni roboczych.</strong>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <strong className="font-semibold text-white">Przejrzyste zasady i proste warunki współpracy.</strong>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <strong className="font-semibold text-white">Błyskawiczne reakcje i zmiany na bieżąco.</strong>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO */}
      <section className="py-24 border-b border-slate-800/50 bg-[#0B0F19]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal delay={0}>
            <div className="text-center mb-16 cursor-default">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white flex justify-center flex-wrap">
                 <HoverLetters text="Nasze realizacje" />
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Projektujemy z myślą o użyteczności. Zobacz przykładowe koncepcje, które stanowią solidny fundament pod budowę witryny dla Twojej firmy.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioItems.map((item, idx) => (
              <Reveal delay={idx * 150} key={idx}>
                <div className="group rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-500 cursor-pointer flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative bg-slate-800 border-b border-slate-800">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-out" />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500"></div>
                  </div>
                  <div className="p-8 flex-grow">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-3 inline-block group-hover:-translate-y-1 transition-transform">{item.type}</span>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-100 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          
          <Reveal delay={300}>
            <div className="text-center mt-12">
              <Link href="/portfolio" className="inline-block px-8 py-3.5 bg-slate-900 border border-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors hover:-translate-y-1">
                Zobacz wszystkie realizacje
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. OPINIE */}
      <section className="py-24 bg-[#0E131F] border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 mb-12 cursor-default">
          <Reveal delay={0}>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white flex justify-center flex-wrap">
                 <HoverLetters text="Co mówią o nas przedsiębiorcy?" />
              </h2>
              <p className="text-slate-400">Setki udanych realizacji zaczynają się od jednego wstępnego szkicu.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
              {testimonials.slice(currentTestimonialIndex * itemsPerPage, (currentTestimonialIndex + 1) * itemsPerPage).map((testi, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full animate-fadeIn">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic mb-8 flex-grow">"{testi.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center font-bold text-blue-400 shrink-0">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{testi.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{testi.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-12">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 transition-all duration-300 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${currentTestimonialIndex === idx ? 'bg-blue-500 w-8' : 'bg-slate-700 hover:bg-slate-500'}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 transition-all duration-300 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. ZAKTUALIZOWANE FAQ */}
      <section className="px-6 py-24 bg-[#0B0F19] border-b border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <Reveal delay={0}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Najczęściej zadawane pytania</h2>
              <p className="text-slate-400">Rozwiewamy wątpliwości jeszcze przed pierwszą rozmową.</p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`border rounded-2xl bg-slate-900/50 overflow-hidden transition-all duration-300 ${openFaq === idx ? "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-slate-800 hover:border-slate-700"}`}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none group"
                  >
                    <span className={`font-semibold transition-colors ${openFaq === idx ? "text-blue-400" : "text-white group-hover:text-slate-200"}`}>{faq.q}</span>
                    <span className={`text-2xl transition-transform duration-300 ${openFaq === idx ? "rotate-45 text-blue-500" : "text-slate-500 group-hover:text-blue-400"}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </span>
                  </button>
                  <div className={`px-6 text-sm text-slate-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. WYSKAKUJĄCY FORMULARZ (MODAL) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsFormOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setIsFormOpen(false)} 
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all focus:outline-none z-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="absolute top-0 right-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8 relative z-10 pr-10">
              <h2 className="text-2xl font-bold mb-2 text-white">Wypełnij niezobowiązujący formularz</h2>
              <p className="text-slate-400 text-sm">Opisz nam krótko swoje potrzeby, a my przygotujemy bezpłatny plan działania i wycenę.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Imię / Nazwa Firmy</label>
                  <input type="text" name="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" placeholder="np. Jan Kowalski" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Numer telefonu</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" placeholder="+48 000 000 000" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">E-mail (Opcjonalnie)</label>
                <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" placeholder="kontakt@firma.pl" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Czego głównie potrzebujesz?</label>
                <select name="package" value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm appearance-none cursor-pointer">
                  <option value="" disabled>Wybierz główny cel projektu...</option>
                  <option value="one-page">Prosta Strona Wizytówka (One-Page)</option>
                  <option value="multi-page">Rozbudowana Strona Firmowa z podstronami</option>
                  <option value="ecommerce">Sklep internetowy / Platforma E-commerce</option>
                  <option value="audit">Darmowy audyt mojej obecnej strony</option>
                  <option value="other">Inne / Coś niestandardowego</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Dodatkowe informacje / Branża</label>
                <textarea name="message" rows={3} required value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm resize-none" placeholder="Czym się zajmujesz? Masz już jakieś konkretne pomysły?" />
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl hover:-translate-y-1 transition-all text-sm mt-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                Wyślij do bezpłatnej wyceny
              </button>
              
              {status && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm text-center font-medium mt-4 animate-pulse">{status}</div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Definicje CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0B0F19; 
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #334155; 
        }
      `}} />
    </>
  );
}