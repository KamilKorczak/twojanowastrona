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
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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

// --- KOMPONENT OPISU (TOOLTIP) ---
const InfoTooltip = ({ title, description }: { title: string, description: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block ml-2">
      <button 
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs hover:bg-blue-600 hover:text-white transition-colors focus:outline-none"
      >
        ?
      </button>
      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-xl shadow-2xl text-left leading-relaxed">
          <strong className="block text-white mb-1">{title}</strong>
          {description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

export default function Cennik() {
  const [scrollY, setScrollY] = useState(0);

  // STANY KALKULATORA
  const [selectedPackage, setSelectedPackage] = useState<"one-page" | "company" | "ecommerce">("company");
  const [maintenance, setMaintenance] = useState<"none" | "standard" | "vip">("standard");
  const [addons, setAddons] = useState({
    copywriting: false,
    googleMaps: false,
    booking: false,
    languages: false,
    branding: false,
    rodo: false,
    analytics: false,
    aiBot: false,
    liveChat: false,
    extraPages: 0
  });

  // STANY DLA WYSYŁKI ZAMÓWIENIA (MODAL I FORMULARZ)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientData, setClientData] = useState({ name: "", phone: "", email: "" });
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efekt Parallax i blokada scrollowania przy otwartym oknie
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCheckoutOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isCheckoutOpen]);

  // LOGIKA OBLICZENIOWA
  let basePrice = selectedPackage === "one-page" ? 899 : 1499;
  let copyPrice = selectedPackage === "one-page" ? 299 : 399;

  let addonsTotal = 0;
  let distinctAddonsCount = 0;
  let selectedAddonsList: string[] = [];

  if (addons.copywriting) { addonsTotal += copyPrice; distinctAddonsCount++; selectedAddonsList.push("Copywriting"); }
  if (addons.googleMaps) { addonsTotal += 499; distinctAddonsCount++; selectedAddonsList.push("Wizytówka Google"); }
  if (addons.booking) { addonsTotal += 349; distinctAddonsCount++; selectedAddonsList.push("System Rezerwacji"); }
  if (addons.languages) { addonsTotal += 399; distinctAddonsCount++; selectedAddonsList.push("Wielojęzyczność"); }
  if (addons.branding) { addonsTotal += 299; distinctAddonsCount++; selectedAddonsList.push("Branding & Logo"); }
  if (addons.rodo) { addonsTotal += 199; distinctAddonsCount++; selectedAddonsList.push("Pakiet RODO"); }
  if (addons.analytics) { addonsTotal += 149; distinctAddonsCount++; selectedAddonsList.push("Analityka"); }
  if (addons.aiBot) { addonsTotal += 599; distinctAddonsCount++; selectedAddonsList.push("Wirtualny Asystent AI"); }
  if (addons.liveChat) { addonsTotal += 149; distinctAddonsCount++; selectedAddonsList.push("Czat na żywo"); }

  addonsTotal += addons.extraPages * 129;
  if (addons.extraPages > 0) selectedAddonsList.push(`Dodatkowe podstrony (${addons.extraPages} szt.)`);

  let rawTotal = basePrice + addonsTotal;
  let discountPercent = distinctAddonsCount >= 3 ? 0.20 : (distinctAddonsCount === 2 ? 0.10 : 0);
  let rawDiscounted = rawTotal * (1 - discountPercent);

  let finalOneTime = Math.round(rawDiscounted / 50) * 50 - 1;
  if (discountPercent === 0) finalOneTime = rawTotal;

  let maintenancePrice = maintenance === "vip" ? 249 : (maintenance === "standard" ? 199 : 0);
  if (addons.aiBot) maintenancePrice += 99;

  const toggleAddon = (key: keyof typeof addons) => {
    if (key === "extraPages") return;
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateExtraPages = (amount: number) => {
    setAddons(prev => {
      const newVal = prev.extraPages + amount;
      return { ...prev, extraPages: newVal < 0 ? 0 : newVal };
    });
  };

  // OBSŁUGA WYSYŁKI ZAMÓWIENIA
  const handleCheckoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("Przetwarzanie zamówienia...");

    const packageName = selectedPackage === "one-page" ? "Wizytówka One-Page" : "Strona Firmowa";
    const maintenanceName = maintenance === "none" ? "Brak opieki" : (maintenance === "standard" ? "Standard" : "VIP");
    
    // Budowanie czytelnej wiadomości z zamówieniem do maila
    const orderDetails = `
      NOWE ZAPYTANIE Z KALKULATORA:
      Pakiet główny: ${packageName}
      Opieka techniczna: ${maintenanceName}
      Wybrane dodatki: ${selectedAddonsList.length > 0 ? selectedAddonsList.join(", ") : "Brak"}
      
      Zniżka: ${discountPercent * 100}%
      Kwota wdrożenia po rabacie: ${finalOneTime} zł
      Stały abonament miesięczny: ${maintenancePrice} zł / mc
    `;

    const formDataObj = new FormData();
    formDataObj.append("access_key", "e44f0f1b-bc96-41d4-9a5b-e08af7ec7f0f"); // Twój klucz Web3Forms
    formDataObj.append("name", clientData.name);
    formDataObj.append("phone", clientData.phone);
    formDataObj.append("email", clientData.email);
    formDataObj.append("message", orderDetails);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus("Sukces! Wygenerowaliśmy Twoje zestawienie. Skontaktujemy się z Tobą najszybciej jak to możliwe.");
        setClientData({ name: "", phone: "", email: "" });
        setTimeout(() => { setIsCheckoutOpen(false); setFormStatus(""); }, 3000);
      } else {
        setFormStatus("Błąd techniczny podczas wysyłania. Spróbuj ponownie.");
      }
    } catch (error) {
      setFormStatus("Błąd połączenia. Sprawdź dostęp do internetu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-32 bg-[#020617]">
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=3840&q=80')", transform: `translateY(${scrollY * 0.3}px)` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#020617]/90 to-[#020617] z-0"></div>

      {/* Hero Cennika */}
      <section className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto relative z-10 w-full">
        <Reveal delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8 uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Zbuduj swój projekt
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-lg flex flex-col items-center justify-center">
            <div><HoverLetters text="Interaktywny" /></div>
            <div className="mt-2 text-blue-400 p-2 hover:text-blue-300 transition-colors duration-300">kalkulator wyceny.</div>
          </h1>
          
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto mt-6 leading-relaxed">
            Nie ukrywamy cen pod przyciskiem "napisz do nas". Wybierz bazę swojej strony, dobierz moduły, które realnie rozwiną Twój biznes, i poznaj gotową kwotę inwestycji.
          </p>
        </Reveal>
      </section>

      {/* KALKULATOR */}
      <section className="px-6 py-12 max-w-5xl mx-auto relative z-10 w-full">
        
        {/* KROK 1: Wybierz fundament */}
        <Reveal delay={100}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">1</span> 
              Wybierz bazę technologiczną
            </h2>
            <p className="text-slate-400 text-sm mb-6 ml-11">Wszystkie projekty tworzymy w ultraszybkiej, bezpiecznej technologii Next.js (jak Netflix czy TikTok), omijając luki awaryjnego WordPressa.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-0 sm:ml-11">
              <div 
                onClick={() => setSelectedPackage("one-page")}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${selectedPackage === "one-page" ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-lg">Wizytówka One-Page</h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPackage === "one-page" ? "border-blue-500" : "border-slate-600"}`}>
                    {selectedPackage === "one-page" && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-6">Długa, przewijana strona z pełną ofertą i kontaktem. Idealna na start dla lokalnego biznesu.</p>
                <div className="text-2xl font-bold text-white">899 zł</div>
              </div>

              <div 
                onClick={() => setSelectedPackage("company")}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${selectedPackage === "company" ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-lg">Strona Firmowa</h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPackage === "company" ? "border-blue-500" : "border-slate-600"}`}>
                    {selectedPackage === "company" && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-6">Strona główna + do 5 podstron (np. O nas, Oferta, Cennik). Maksymalne budowanie zaufania.</p>
                <div className="text-2xl font-bold text-white">1499 zł</div>
              </div>

              <div 
                onClick={() => setSelectedPackage("ecommerce")}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${selectedPackage === "ecommerce" ? "bg-purple-600/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-lg">Sklepy E-commerce</h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPackage === "ecommerce" ? "border-purple-500" : "border-slate-600"}`}>
                    {selectedPackage === "ecommerce" && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-6">Zaawansowane platformy sprzedażowe z płatnościami online i integracją kurierów.</p>
                <div className="text-xl font-bold text-purple-400">Wycena indywidualna</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* BLOKADA DLA E-COMMERCE */}
        {selectedPackage === "ecommerce" ? (
          <Reveal delay={200}>
            <div className="ml-0 sm:ml-11 p-10 rounded-3xl bg-gradient-to-br from-purple-900/20 to-slate-900 border border-purple-500/40 text-center shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Wycena sklepów to projekt szyty na miarę</h3>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                Sklepy internetowe i portale dedykowane posiadają ogromną ilość zmiennych (od 10 do 1000 produktów, warianty, integracje magazynowe). Nie jesteśmy w stanie jednoznacznie określić ceny z automatu. Skontaktuj się z nami, a przygotujemy darmową analizę Twojego pomysłu.
              </p>
              <Link href="/kontakt" className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all">
                Porozmawiajmy o Twoim sklepie
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            {/* KROK 2: Moduły i Dodatki */}
            <Reveal delay={200}>
              <div className="mb-12">
                <div className="flex flex-wrap items-end justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span> 
                      Dobierz moduły wspierające
                    </h2>
                    <p className="text-slate-400 text-sm ml-11">Skonfiguruj projekt pod swoje potrzeby. Zbuduj pakiet i obniż koszty.</p>
                  </div>
                  <div className="ml-11 mt-4 sm:mt-0">
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${distinctAddonsCount >= 3 ? "bg-green-500/20 border-green-500 text-green-400 animate-pulse" : (distinctAddonsCount === 2 ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-500")}`}>
                      {distinctAddonsCount >= 3 ? "Aktywny Rabat: -20% na wdrożenie!" : (distinctAddonsCount === 2 ? "Aktywny Rabat: -10% na wdrożenie!" : "Dobierz 2 moduły, by otrzymać -10%")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 sm:ml-11">
                  {/* Moduły w gridzie */}
                  <div onClick={() => toggleAddon("copywriting")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.copywriting ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.copywriting ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.copywriting && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Copywriting Sprzedażowy</h4>
                        <InfoTooltip title="Oparto na psychologii" description="Nie lejemy wody. Piszemy konkretne teksty dopasowane do Twojej grupy docelowej, by nakłonić ich do zakupu. Cena dostosowuje się do wielkości wybranej witryny." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Teksty, które sprzedają</p>
                      <span className="font-bold text-blue-400 text-sm">+{copyPrice} zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("googleMaps")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.googleMaps ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.googleMaps ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.googleMaps && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Dominacja Wizytówki Google</h4>
                        <InfoTooltip title="Google Maps" description="Tworzymy, weryfikujemy i pozycjonujemy Twój profil tak, by wyświetlał się lokalnie w TOP3 i generował darmowe telefony." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Darmowy ruch lokalny</p>
                      <span className="font-bold text-blue-400 text-sm">+499 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("booking")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.booking ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.booking ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.booking && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">System Rezerwacji</h4>
                        <InfoTooltip title="Kalendarz Wizyt" description="Interaktywny kalendarz, w którym klienci mogą sami umawiać wizyty na wybrane godziny. Integrujemy to z Twoim telefonem." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Zapisy 24/7</p>
                      <span className="font-bold text-blue-400 text-sm">+349 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("aiBot")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.aiBot ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.aiBot ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.aiBot && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Wirtualny Asystent AI</h4>
                        <InfoTooltip title="Bot na sterydach" description="Prywatny sprzedawca na Twojej stronie. Uczymy go cennika i 15 najczęstszych pytań (FAQ). Zbierze kontakty od klientów w środku nocy." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Automatyczny handlowiec</p>
                      <span className="font-bold text-blue-400 text-sm">+599 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("branding")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.branding ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.branding ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.branding && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Branding & Logo Premium</h4>
                        <InfoTooltip title="Mini Księga Znaku" description="Tworzymy profesjonalne logo, dobieramy paletę kolorów firmowych oraz typografię. Dostajesz gotową tożsamość wizualną." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Tożsamość firmy</p>
                      <span className="font-bold text-blue-400 text-sm">+299 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("liveChat")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.liveChat ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.liveChat ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.liveChat && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Czat na żywo (Messenger)</h4>
                        <InfoTooltip title="Szybki kontakt" description="Wpinamy w róg strony dymek czatu zintegrowany z Twoim Facebookiem lub WhatsApp. Odpisujesz klientom prosto z telefonu." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Powiadomienia na tel.</p>
                      <span className="font-bold text-blue-400 text-sm">+149 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("rodo")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.rodo ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.rodo ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.rodo && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Pakiet Prawny RODO</h4>
                        <InfoTooltip title="Zgodność z prawem UE" description="Wdrażamy dedykowaną Politykę Prywatności, formularze zgodne z RODO oraz legalny pasek akceptacji plików Cookies." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Brak kar prawnych</p>
                      <span className="font-bold text-blue-400 text-sm">+199 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("languages")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.languages ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.languages ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.languages && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Dodatkowy Język</h4>
                        <InfoTooltip title="np. Polski i Angielski" description="Przygotowujemy techniczną infrastrukturę strony do obsługi wielu języków wraz z inteligentnym przełącznikiem (flagi)." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Wersja anglojęzyczna</p>
                      <span className="font-bold text-blue-400 text-sm">+399 zł</span>
                    </div>
                  </div>

                  <div onClick={() => toggleAddon("analytics")} className={`cursor-pointer p-5 rounded-2xl border transition-all ${addons.analytics ? "bg-blue-600/10 border-blue-500" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${addons.analytics ? "bg-blue-600" : "bg-slate-700"}`}>
                          {addons.analytics && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <h4 className="font-bold text-white text-sm">Moduł Analityki Google</h4>
                        <InfoTooltip title="Google Analytics 4" description="Podpinamy zaawansowane narzędzia śledzące. Będziesz wiedzieć, ilu masz odwiedzających, z jakich miast i w co najczęściej klikają." />
                      </div>
                    </div>
                    <div className="pl-8 flex justify-between items-end">
                      <p className="text-xs text-slate-500">Pełne statystyki</p>
                      <span className="font-bold text-blue-400 text-sm">+149 zł</span>
                    </div>
                  </div>
                </div>

                {selectedPackage === "company" && (
                  <div className="ml-0 sm:ml-11 mt-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-800 flex justify-between items-center">
                    <div className="flex items-center">
                      <h4 className="font-bold text-white text-sm mr-2">Dodatkowa Podstrona</h4>
                      <InfoTooltip title="Powyżej limitu 5 sztuk" description="Twój pakiet bazowy zawiera 5 podstron. Potrzebujesz osobnej zakładki dla każdej ze swoich nowych usług? Wybierz ilość." />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-xs hidden sm:block">+129 zł/szt.</span>
                      <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                        <button onClick={() => updateExtraPages(-1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">-</button>
                        <div className="w-8 h-8 flex items-center justify-center text-white font-bold bg-slate-900 text-sm">{addons.extraPages}</div>
                        <button onClick={() => updateExtraPages(1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* KROK 3: Abonament / Opieka Techniczna */}
            <Reveal delay={300}>
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">3</span> 
                  Zdejmij problemy z głowy (Opieka)
                </h2>
                <p className="text-slate-400 text-sm mb-6 ml-11">Abonament zapewnia hosting, opłacenie Twojej domeny, bezpieczeństwo i nasz czas na poprawki.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-0 sm:ml-11">
                  <div onClick={() => setMaintenance("none")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${maintenance === "none" ? "bg-slate-800 border-slate-500" : "bg-slate-900/20 border-slate-800 hover:border-slate-700"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white text-lg">Zrobię to sam</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${maintenance === "none" ? "border-slate-400" : "border-slate-700"}`}>
                        {maintenance === "none" && <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>}
                      </div>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-500 mb-6 line-through">
                      <li>Opłacony Hosting i Domena</li>
                      <li>Drobne zmiany w tekście</li>
                      <li>Kopie zapasowe i monitoring</li>
                    </ul>
                    <div className="text-xl font-bold text-slate-400">0 zł / mc</div>
                    <p className="text-[10px] text-slate-500 mt-2">Przekazujemy kod, serwer kupujesz sam.</p>
                  </div>

                  <div onClick={() => setMaintenance("standard")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${maintenance === "standard" ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white text-lg">Opieka Standard</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${maintenance === "standard" ? "border-blue-500" : "border-slate-600"}`}>
                        {maintenance === "standard" && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 mb-6">
                      <li className="flex gap-2"><span className="text-blue-500">✓</span> <strong>Hosting, Domena, SSL w cenie</strong></li>
                      <li className="flex gap-2"><span className="text-blue-500">✓</span> Kopie zapasowe kodu (GitHub)</li>
                      <li className="flex gap-2"><span className="text-blue-500">✓</span> Monitoring dostępności 24/7</li>
                      <li className="flex gap-2"><span className="text-blue-500">✓</span> <strong>Do 1 godz.</strong> drobnych zmian w miesiącu</li>
                    </ul>
                    <div className="text-xl font-bold text-blue-400">199 zł / mc</div>
                    <p className="text-[10px] text-slate-500 mt-2">Jedna faktura, całkowity święty spokój.</p>
                  </div>

                  <div onClick={() => setMaintenance("vip")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${maintenance === "vip" ? "bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]" : "bg-slate-900/50 border-slate-800 hover:border-slate-600"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white text-lg">Opieka VIP</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${maintenance === "vip" ? "border-blue-400" : "border-slate-600"}`}>
                        {maintenance === "vip" && <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>}
                      </div>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 mb-6">
                      <li className="flex gap-2"><span className="text-blue-400">✓</span> Wszystko to, co w pakiecie Standard</li>
                      <li className="flex gap-2"><span className="text-blue-400">✓</span> <strong>Do 2 godz.</strong> poważniejszych prac na stronie</li>
                      <li className="flex gap-2"><span className="text-blue-400">✓</span> Gwarancja reakcji na zgłoszenie w 24h</li>
                      <li className="flex gap-2"><span className="text-blue-400">✓</span> Indywidualne raporty kwartalne</li>
                    </ul>
                    <div className="text-xl font-bold text-blue-300">249 zł / mc</div>
                    <p className="text-[10px] text-slate-500 mt-2">Dla firm, które dynamicznie dodają nowe oferty.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* PODSUMOWANIE (STICKY BAR LUB BOX) */}
            <Reveal delay={400}>
              <div className="ml-0 sm:ml-11 p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(59,130,246,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full"></div>
                
                <div className="flex-1 relative z-10 w-full">
                  <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Wstępna kalkulacja projektu</h3>
                  <div className="flex items-end gap-4 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-white">{finalOneTime} zł</span>
                    {discountPercent > 0 && (
                      <span className="text-lg text-slate-500 line-through mb-1">{rawTotal} zł</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm">
                    {discountPercent > 0 && (
                      <p className="text-green-400 font-bold">Zaoszczędziłeś {(rawTotal - rawDiscounted).toFixed(0)} zł (-{discountPercent * 100}% na wdrożenie)!</p>
                    )}
                    <p className="text-slate-400">
                      Stałe koszty utrzymania: <strong className="text-white">{maintenancePrice} zł / mc</strong> 
                      {addons.aiBot && maintenance !== "none" && <span className="text-xs text-blue-400"> (w tym 99 zł za API bota AI)</span>}
                      {addons.aiBot && maintenance === "none" && <span className="text-xs text-blue-400"> (Opłata 99 zł/mc za API bota AI będzie doliczana osobno)</span>}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto relative z-10 shrink-0">
                  {/* Przycisk otwierający Modal Zamówienia */}
                  <button onClick={() => setIsCheckoutOpen(true)} className="block w-full text-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                    Zamawiam tę wycenę
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-3">Kwoty netto. Nie pobieramy ukrytych opłat.</p>
                </div>
              </div>
            </Reveal>
          </>
        )}
      </section>

      {/* NOWA, BOGATA SEKCJA: W JAKIEJ KOLEJNOŚCI INWESTOWAĆ (GLASSMORPHISM GRID) */}
      <section className="px-6 py-24 max-w-6xl mx-auto relative z-10 w-full mt-8 border-t border-slate-800/50">
        <Reveal delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white flex justify-center flex-wrap">
               <HoverLetters text="W jakiej kolejności inwestować budżet?" />
            </h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto leading-relaxed">
              Zastanawiasz się, od czego zacząć? Zobacz sprawdzony, 4-etapowy model inwestycji, który wdrażamy u naszych najbardziej rentownych klientów. Budujemy biznes, krok po kroku.
            </p>
          </div>
        </Reveal>

        {/* Siatka Kart 2x2 z efektem Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal delay={100} className="h-full">
            <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
              {/* Tło znaku wodnego */}
              <div className="absolute -right-8 -bottom-12 text-slate-800/30 font-black text-9xl transition-transform duration-500 group-hover:scale-110 group-hover:text-slate-800/50 pointer-events-none">01</div>
              
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Bezpieczny Fundament (Strona WWW)</h4>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                Zanim wydasz budżet na reklamy Google czy Facebook, potrzebujesz miejsca, które realnie konwertuje. Zbudujemy Twoje wirtualne biuro w ultraszybkiej technologii Next.js (omijając awaryjnego WordPressa). To silnik, który pracuje 24/7 i buduje natychmiastowe zaufanie w oczach Twojego klienta.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} className="h-full">
            <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
              <div className="absolute -right-8 -bottom-12 text-slate-800/30 font-black text-9xl transition-transform duration-500 group-hover:scale-110 group-hover:text-slate-800/50 pointer-events-none">02</div>
              
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Słowa, które realnie sprzedają</h4>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                Nawet najpiękniejsza strona w internecie nie obroni się sama. Klienci skanują witryny wzrokiem, podświadomie szukając korzyści dla siebie. Nasz zespół przełoży Twoją wiedzę na psychologiczny język korzyści, który uderza w bóle klienta i naturalnie prowadzi go do kliknięcia przycisku "Zamawiam".
              </p>
            </div>
          </Reveal>

          <Reveal delay={300} className="h-full">
            <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
              <div className="absolute -right-8 -bottom-12 text-slate-800/30 font-black text-9xl transition-transform duration-500 group-hover:scale-110 group-hover:text-slate-800/50 pointer-events-none">03</div>
              
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Dominacja Lokalna i Ruch AI</h4>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                Kiedy masz już gotową maszynę, musisz wlać do niej paliwo. Wdrażamy profil Google Maps, byś w pełni przejął lokalny ruch w swoim mieście. Dodatkowo integrujemy stronę z Asystentem AI, który obsłuży klientów o 2:00 w nocy i pozyska dla Ciebie numery telefonów, gdy Twoja konkurencja dawno śpi.
              </p>
            </div>
          </Reveal>

          <Reveal delay={400} className="h-full">
            <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
              <div className="absolute -right-8 -bottom-12 text-slate-800/30 font-black text-9xl transition-transform duration-500 group-hover:scale-110 group-hover:text-slate-800/50 pointer-events-none">04</div>
              
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Święty Spokój (Abonament IT)</h4>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                Profesjonalna strona internetowa to nie ulotka – to żywy organizm. Zamiast martwić się o opłacanie domen, konfiguracje serwerów i bezpieczeństwo plików, zrzucasz cały ten ciężar na naszą agencję. Ty skupiasz się na obsłudze swoich nowych klientów, my pilnujemy, by wszystko od strony technicznej działało perfekcyjnie.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MODAL Z FORMULARZEM WYSYŁKI WSTĘPNEGO ZAMÓWIENIA */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm animate-fadeIn">
          {/* Tło klikalne zamykające modal */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsCheckoutOpen(false)}></div>
          
          <div className="relative w-full max-w-lg overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setIsCheckoutOpen(false)} 
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all focus:outline-none z-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="absolute top-0 left-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="text-left mb-8 relative z-10 pr-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold mb-4 uppercase">
                Szacunkowa inwestycja: {finalOneTime} zł
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">Prześlij swoją konfigurację</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Podaj swoje dane, a my prześlemy Ci mailem dokładne, niezobowiązujące podsumowanie wybranych przez Ciebie opcji wraz z planem wdrożenia.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Twoje Imię / Firma</label>
                <input type="text" required value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" placeholder="np. Jan Kowalski" />
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Numer Telefonu</label>
                <input type="tel" required value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" placeholder="+48 000 000 000" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 focus-within:text-blue-400">Adres E-mail</label>
                <input type="email" required value={clientData.email} onChange={(e) => setClientData({ ...clientData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all text-sm" placeholder="twoj@email.pl" />
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-4 mt-2 font-bold rounded-xl transition-all text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] ${isSubmitting ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"}`}>
                {isSubmitting ? "Wysyłanie..." : "Prześlij do akceptacji (Niezobowiązująco)"}
              </button>
              
              {formStatus && (
                <div className={`p-4 rounded-xl text-sm text-center font-medium mt-4 animate-pulse ${formStatus.includes("Sukces") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-blue-500/10 border border-blue-500/30 text-blue-400"}`}>
                  {formStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Wszystkie definicje CSS (bez zmian) */}
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
    </div>
  );
}