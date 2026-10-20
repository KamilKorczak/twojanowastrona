"use client";

import React, { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("motoryzacja");
  const [formData, setFormData] = useState({ name: "", phone: "", industry: "" });
  const [status, setStatus] = useState("");

  const projects = {
    motoryzacja: [
      { title: "Auto-Serwis Pro", desc: "Nowoczesny serwis mechaniki i wulkanizacji z prostym cennikiem.", tag: "Mechanika" },
      { title: "Detailing Studio", desc: "Prezentacja pakietów zabezpieczeń lakieru i galeria realizacji.", tag: "Auto Detailing" },
    ],
    uroda: [
      { title: "Studio Urody Glamour", desc: "Elegancka wizytówka salonu fryzjerskiego z cennikiem usług.", tag: "Fryzjer & Kosmetyka" },
      { title: "Makijaż Permanentny", desc: "Portfolio prac z formularzem szybkiej rezerwacji terminu.", tag: "Wizaż" },
    ],
    budownictwo: [
      { title: "Drewno Styl", desc: "Zakład stolarski wykonujący kuchnie i meble na wymiar.", tag: "Stolarstwo" },
      { title: "Remonty Pod Klucz", desc: "Strona dla ekipy remontowo-wykończeniowej z listą wolnych terminów.", tag: "Budownictwo" },
    ],
    uslugi: [
      { title: "Pogotowie Hydrauliczne", desc: "Prosta strona z jednym celem: natychmiastowe kliknięcie 'Zadzwoń teraz'.", tag: "Hydraulik" },
      { title: "Biuro Rachunkowe Bilans", desc: "Budująca zaufanie wizytówka dla małych firm i freelancerów.", tag: "Księgowość" },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Dziękujemy! Twój numer został zapisany. Odezwiemy się w ciągu 2 godzin!");
    setFormData({ name: "", phone: "", industry: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Pasek nawigacji */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              twoja<span className="text-blue-500">nowa</span>strona.pl
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:518496254" className="text-sm font-semibold text-slate-300">📞 518 496 254</a>
            <a href="#kontakt" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full">Darmowa wycena</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          Nowoczesna strona w <span className="text-blue-400">7 dni</span>.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Tworzymy strony, które genialnie wyglądają na smartfonach i realnie zdobywają zapytania od lokalnych klientów. Zobacz wstępny projekt całkowicie bezpłatnie.
        </p>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="px-6 py-20 max-w-xl mx-auto">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-2xl font-extrabold mb-6 text-center">Porozmawiajmy o Twojej stronie</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="Twoje imię lub nazwa firmy" className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="tel" required placeholder="Numer telefonu" className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">Wyślij zgłoszenie</button>
            {status && <div className="p-3 bg-green-500/10 text-green-400 text-sm text-center rounded-lg">{status}</div>}
          </form>
          <div className="mt-8 text-center text-sm text-slate-400">
            ✉️ kamilkorczak123@o2.pl
          </div>
        </div>
      </section>
    </div>
  );
}