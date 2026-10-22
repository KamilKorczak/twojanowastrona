"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

export default function PolitykaPrywatnosci() {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-32 pb-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19] z-0"></div>

      <section className="px-6 max-w-4xl mx-auto w-full relative z-10">
        <Reveal delay={0}>
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-white tracking-tight">Polityka Prywatności i <span className="text-blue-400">Cookies</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Poniższy dokument określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z usług serwisu twojanowastrona24.pl.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 text-slate-300 space-y-8 leading-relaxed shadow-xl">
            
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§1.</span> Postanowienia Ogólne
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Administratorem Twoich danych osobowych zbieranych za pośrednictwem strony internetowej twojanowastrona24.pl jest Kamil Korczak (zwany dalej "Administratorem").</li>
                <li>Z Administratorem można skontaktować się pisząc na adres e-mail: <a href="mailto:twojanowastrona24@gmail.com" className="text-blue-400 hover:underline">twojanowastrona24@gmail.com</a> lub telefonicznie pod numerem: 518 496 254.</li>
                <li>Dane osobowe przetwarzane są zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).</li>
                <li>Administrator dokłada szczególnej staranności w celu ochrony interesów osób, których dane dotyczą, a w szczególności zapewnia, że dane są przetwarzane zgodnie z prawem.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§2.</span> Cel i zakres zbierania danych
              </h2>
              <p className="text-sm text-slate-400 mb-2">Dane osobowe Użytkowników zbierane są w celu:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Obsługi zapytań wysyłanych przez formularze kontaktowe (podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora).</li>
                <li>Przedstawienia oferty i darmowego audytu na wyraźną prośbę Użytkownika (podstawa prawna: art. 6 ust. 1 lit. b RODO).</li>
                <li>Realizacji umów o stworzenie strony internetowej oraz świadczenia opieki technicznej.</li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">Wymagamy podania tylko tych danych, które są niezbędne do działania serwisu i kontaktu (najczęściej: imię/nazwa firmy, e-mail lub telefon).</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§3.</span> Odbiorcy danych osobowych
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Dane osobowe Użytkowników mogą być przekazywane podmiotom uprawnionym do ich otrzymania na mocy obowiązujących przepisów prawa.</li>
                <li>W celu zapewnienia prawidłowego działania strony i formularzy kontaktowych, Administrator korzysta z zewnętrznego dostawcy usług API – serwisu <strong>Web3Forms</strong>. Przesyłając formularz, wyrażasz zgodę na bezpieczne procesowanie tej wiadomości za pośrednictwem ich serwerów.</li>
                <li>Administrator korzysta także z usług hostingowych, na których serwerach przechowywana jest strona i dane analityczne.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§4.</span> Prawa osoby, której dane dotyczą
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Prawo dostępu do treści swoich danych oraz ich poprawiania.</li>
                <li>Prawo do usunięcia danych ("prawo do bycia zapomnianym") oraz ograniczenia przetwarzania.</li>
                <li>Prawo do wniesienia sprzeciwu wobec przetwarzania danych w celach marketingowych.</li>
                <li>W celu realizacji swoich praw, wyślij żądanie na adres: <a href="mailto:twojanowastrona24@gmail.com" className="text-blue-400 hover:underline">twojanowastrona24@gmail.com</a>.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§5.</span> Polityka Plików Cookies (Ciasteczka)
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Strona twojanowastrona24.pl używa plików cookies. Są to niewielkie pliki tekstowe wysyłane przez serwer www i przechowywane przez oprogramowanie komputera przeglądarki.</li>
                <li>Gromadzimy informacje dotyczące adresu IP, typu przeglądarki, języka, systemu operacyjnego, dostawcy usług internetowych oraz informacji o czasie i dacie.</li>
                <li>Zebrane dane służą do monitorowania i sprawdzania, w jaki sposób użytkownicy korzystają z naszych witryn, aby usprawniać funkcjonowanie serwisu zapewniając bardziej efektywną nawigację.</li>
                <li>Użytkownik w każdej chwili ma możliwość wyłączenia lub przywrócenia opcji gromadzenia cookies poprzez zmianę ustawień w przeglądarce internetowej.</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Powrót do strony głównej
              </Link>
            </div>

          </div>
        </Reveal>
      </section>
    </div>
  );
}