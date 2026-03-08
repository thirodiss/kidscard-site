import "./globals.css";
import { Inter } from "next/font/google";
import AuthSessionProvider from "../components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "KidsCard | Conta Digital para Pensão e Mesada",
  description:
    "Conta digital para organizar pensão alimentícia e mesada com mais transparência, controle e planos progressivos para a família.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} min-h-screen bg-white text-black`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}