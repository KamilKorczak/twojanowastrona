import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ChatWidget from "./components/ChatWidget"; // Nasz nowy import bota AI

// To jest serce SEO Twojej strony. Google czyta ten fragment jako pierwszy!
export const metadata: Metadata = {
  title: "twojanowastrona24.pl - Nowoczesne strony internetowe premium",
  description: "Projektujemy ultraszybkie, zoptymalizowane strony internetowe dla małych i średnich firm. Zdobądź nowoczesny wizerunek i zamień odwiedzających w realnych klientów. Zamów darmowy projekt wstępny!",
  keywords: "strony internetowe, tworzenie stron www, strony dla firm, nowoczesne strony internetowe, web design",
  openGraph: {
    title: "twojanowastrona24.pl - Nowoczesne strony internetowe premium",
    description: "Projektujemy ultraszybkie i konwersyjne strony www. Zobacz nasz cennik i zamów darmowy audyt obecnej strony!",
    url: "https://twojanowastrona24.pl",
    siteName: "twojanowastrona24.pl",
    images: [
      {
        // Ten obrazek wyświetli się, gdy wyślesz komuś link na FB lub Messengerze.
        // Poniżej wstawiłem eleganckie biurowe zdjęcie Premium, ale w przyszłości 
        // możesz tu podmienić URL na obrazek swojego własnego logo!
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "twojanowastrona24.pl - Podgląd strony",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        {/* Favicon - Ikona widoczna w zakładce przeglądarki */}
        <link rel="icon" href="https://fav.farm/💻" />
      </head>
      <body className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden flex flex-col">
        {/* Tu wstawiamy nasze opakowanie, które zawiera Menu i Stopkę z pliku ClientLayout.tsx */}
        <ClientLayout>
          {children}
        </ClientLayout>

        {/* Pływający wirtualny asystent AI - działa na każdej podstronie */}
        <ChatWidget />
      </body>
    </html>
  );
}