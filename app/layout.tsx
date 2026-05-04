import type { Metadata } from "next";
import { Header } from "@/presentation/components/Header";
import { AppPreferencesProvider } from "@/presentation/components/AppPreferencesProvider";
import { Footer } from "@/presentation/components/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MalevoLens",
  description:
    "Aplicación educativa para visualizar ataques web comunes y mitigaciones defensivas. Educational app for visualizing common web attacks and defensive mitigations."
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
          <div className="min-h-[calc(100vh-129px)]">{children}</div>
          <Footer />
        </AppPreferencesProvider>
      </body>
    </html>
  );
}
