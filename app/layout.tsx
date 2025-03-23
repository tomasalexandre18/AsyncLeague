import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Lato } from 'next/font/google';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['700'], // Bold uniquement pour titres principaux
    variable: '--font-montserrat',
});

const lato = Lato({
    subsets: ['latin'],
    weight: ['400'], // Regular pour textes et sous-titres
    variable: '--font-lato',
});

export const metadata: Metadata = {
  title: "aSync Museum",
  description: "Un musée d'art numérique",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${lato.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
