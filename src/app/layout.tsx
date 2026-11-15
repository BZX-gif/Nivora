import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  EnquiriesProvider,
  FavouritesProvider,
  SessionProvider,
  ToastProvider,
  UserListingsProvider,
} from "@/lib/store";

/* Self-hosted variable fonts (Fontsource) — no runtime dependency on Google Fonts. */
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";

export const metadata: Metadata = {
  metadataBase: new URL("https://nivora.example"),
  title: {
    default: "NIVORA — Find your place.",
    template: "%s | NIVORA",
  },
  description:
    "NIVORA connects people looking to buy or rent properties with owners, brokers, agencies and builders. Discover properties, explore neighbourhoods and contact advertisers directly.",
  openGraph: {
    title: "NIVORA — Find your place.",
    description:
      "Discover properties, explore neighbourhoods, and connect directly with the people advertising them.",
    type: "website",
    images: ["/brand/nivora-app-icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "NIVORA — Find your place.",
    description: "Discover properties and connect directly with advertisers.",
  },
  icons: {
    icon: "/brand/nivora-favicon.svg",
    apple: "/brand/nivora-app-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#151515",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <ToastProvider>
          <SessionProvider>
            <FavouritesProvider>
              <UserListingsProvider>
                <EnquiriesProvider>
                  <Navbar />
                  <main id="main" className="pt-16">
                    {children}
                  </main>
                  <Footer />
                </EnquiriesProvider>
              </UserListingsProvider>
            </FavouritesProvider>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
