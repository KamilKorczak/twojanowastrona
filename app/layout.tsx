import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ChatWidget from "./components/ChatWidget";

export const metadata: Metadata = {
  title: "twojanowastrona24.pl - Nowoczesne strony WWW, Boty AI i Rezerwacje",
  description: "Projektujemy i wdrażamy nowoczesne strony WWW, systemy rezerwacji oraz boty AI dla firm. Zdobądź przewagę na rynku. Odbierz darmowy projekt próbny Twojej nowej witryny!",
  keywords: "strony internetowe, tworzenie stron www, strony dla firm, nowoczesne strony internetowe, boty AI, systemy rezerwacji",
  openGraph: {
    title: "twojanowastrona24.pl - Nowoczesne strony WWW i Boty AI",
    description: "Projektujemy ultraszybkie i konwersyjne strony www. Zobacz naszą ofertę i zamów darmowy projekt próbny!",
    url: "https://twojanowastrona24.pl",
    siteName: "twojanowastrona24.pl",
    images: [
      {
        // Ścieżka do Twojego własnego obrazka w folderze public
        url: "https://twojanowastrona24.pl/og-image.jpg",
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
        {/* Usunięto sztywny link do ikony. Next.js sam zaciągnie plik icon.png */}
      </head>
      <body className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden flex flex-col">
        <ClientLayout>
          {children}
        </ClientLayout>

        <ChatWidget />
      </body>
    </html>
  );
}