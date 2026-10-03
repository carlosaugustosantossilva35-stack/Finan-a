import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { PwaSetup } from "@/components/pwa";
export const metadata: Metadata = { title: "Controle financeiro",
  manifest: "/manifest.webmanifest",
  icons: { apple: "/icons/icon-192.png" },
  appleWebApp: { capable: true, title: "Finanças", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { themeColor: "#0a0a0a" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><Providers>{children}<PwaSetup /></Providers></body></html>;
}
