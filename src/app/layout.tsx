import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talitha Reis | Slots & Games",
  description: "Descubra as melhores plataformas de slots e games com Talitha Reis. Dicas, estratégias e recomendações para você ganhar!",
  keywords: ["slots", "games", "cassino", "Talitha Reis", "apostas", "jogos online"],
  authors: [{ name: "Talitha Reis" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Talitha Reis | Slots & Games",
    description: "Descubra as melhores plataformas de slots e games",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
