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

export default function Regulamin() {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-32 pb-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19] z-0"></div>

      <section className="px-6 max-w-4xl mx-auto w-full relative z-10">
        <Reveal delay={0}>
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-white tracking-tight">Regulamin Świadczenia <span className="text-blue-400">Usług</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Jasne zasady to fundament dobrej współpracy. Poniższy regulamin określa zasady realizacji projektów, płatności oraz przenoszenia praw autorskich.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 text-slate-300 space-y-8 leading-relaxed shadow-xl">
            
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§1.</span> Postanowienia ogólne
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Niniejszy regulamin określa zasady świadczenia usług drogą elektroniczną oraz zasady współpracy pomiędzy Wykonawcą a Zamawiającym.</li>
                <li>Wykonawcą usług w ramach strony twojanowastrona24.pl jest Kamil Korczak, wykonujący zlecenia w ramach działalności nierejestrowanej zgodnie z ustawą Prawo Przedsiębiorców (art. 5 ust. 1).</li>
                <li>Kontakt z Wykonawcą odbywa się drogą mailową (twojanowastrona24@gmail.com) lub telefoniczną (518 496 254).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§2.</span> Przedmiot i zakres usług
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Wykonawca świadczy usługi w zakresie: projektowania i tworzenia stron internetowych (w tym wizytówek One-Page i stron firmowych), usług copywriting'u ofertowego, integracji systemów zewnętrznych (np. rezerwacji) oraz opieki technicznej i audytów.</li>
                <li>Zakres prac, kosztorys oraz termin realizacji każdorazowo ustalane są indywidualnie z Zamawiającym przed przystąpieniem do właściwych prac i akceptowane w formie elektronicznej (e-mail) lub poprzez podpisanie prostej umowy o dzieło/zlecenia.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§3.</span> Proces realizacji i płatności
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Proces tworzenia strony rozpoczyna się od bezpłatnej, niezobowiązującej konsultacji i przygotowania wstępnego szkicu/projektu.</li>
                <li>Po akceptacji wstępnego projektu przez Zamawiającego, strony ustalają ostateczną wycenę. Wymagane jest wpłacenie zaliczki (standardowo od 30% do 50% wartości zlecenia) przed rozpoczęciem prac deweloperskich.</li>
                <li>Wszystkie ceny podane na stronie są cenami końcowymi (brak doliczanego podatku VAT w związku z działalnością nierejestrowaną). Uregulowanie płatności odbywa się na podstawie wystawionego Rachunku (dowodu sprzedaży) na wskazane konto bankowe.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§4.</span> Prawa autorskie i własność
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Do momentu uregulowania pełnej kwoty za zlecenie, autorskie prawa majątkowe do stworzonej witryny, kodu oraz projektów graficznych pozostają własnością Wykonawcy.</li>
                <li><strong>Z chwilą zaksięgowania całkowitej kwoty</strong> za wykonaną usługę, Wykonawca przekazuje Zamawiającemu 100% praw majątkowych do strony, co czyni go wyłącznym właścicielem kodu oraz użytych materiałów docelowych.</li>
                <li>Wykonawca zastrzega sobie prawo do umieszczenia w stopce zrealizowanej strony drobnej informacji o autorstwie (np. "Projekt i realizacja: twojanowastrona24.pl") oraz umieszczenia projektu w swoim portfolio, chyba że strony ustalą inaczej.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§5.</span> Poprawki i Reklamacje
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>W trakcie trwania prac, Zamawiającemu przysługuje prawo do zgłaszania poprawek do projektu w ramach ustalonego wcześniej zakresu. Zmiany wykraczające poza pierwotną specyfikację podlegają dodatkowej wycenie (99 zł / rbh).</li>
                <li>Reklamacje dotyczące działania witryny po jej oddaniu można zgłaszać drogą elektroniczną. Wykonawca ustosunkuje się do zgłoszenia w terminie do 14 dni roboczych.</li>
                <li>Wykonawca nie ponosi odpowiedzialności za awarie wynikające z działania siły wyższej, awarii serwerów zewnętrznych dostawców (hosting) lub ingerencji w kod źródłowy przez osoby trzecie po oddaniu projektu.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">§6.</span> Odstąpienie od umowy
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>Zgodnie z polskim prawem, strona internetowa na zamówienie ma charakter spersonalizowanego dzieła cyfrowego. Rozpoczęcie prac deweloperskich po opłaceniu zaliczki i wyrażeniu zgody na realizację oznacza utratę prawa do odstąpienia od umowy bez podania przyczyny w terminie 14 dni.</li>
                <li>W przypadku zerwania umowy przez Zamawiającego w trakcie prac, wpłacona zaliczka nie podlega zwrotowi i pokrywa koszty dotychczas wykonanej pracy programistycznej.</li>
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