import type { Metadata } from "next";
import { Header } from "@/presentation/components/Header";
import { AppPreferencesProvider } from "@/presentation/components/AppPreferencesProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MalevoLens",
  description: "Aplicación educativa para visualizar ataques web comunes y mitigaciones defensivas."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AppPreferencesProvider>
          <Header />
          {children}
        </AppPreferencesProvider>
      </body>
    </html>
  );
}
