import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speaker-Motiv erstellen | stiftungsmarktplatz.eu",
  description: "Erstelle dein gebrandetes Speaker-Motiv für Social Media.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
