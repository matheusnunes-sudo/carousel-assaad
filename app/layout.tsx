import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarrosselGen — Gerador de Carrosséis",
  description: "Crie carrosséis visuais profissionais para redes sociais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
