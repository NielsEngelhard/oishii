import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import CheatSheetFAB from "@/components/specific/cheatsheet/CheatSheetFAB";
import InstallPrompt from "@/components/ui/InstallPrompt";
import localFont from "next/font/local";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "@/i18n/types";

const specialFont = localFont({
  src: [
    {
      path: "../lib/fonts/Kamikaze/Kamikaze.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-special"
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oishii - Your Personal Recipe Collection",
  description: "The modern recipe app that helps you organize your culinary creations, discover new flavors, and share your passion for cooking with the world.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oishii",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${nunito.variable} ${geistMono.variable} ${specialFont.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ToastProvider>
              <Header />

              <div className="flex justify-center w-full min-h-[calc(100vh-64px-120px)]">
                {children}
              </div>

              <Footer />

              {/* Mobile floating button for cheat sheet */}
              <CheatSheetFAB />

              {/* PWA install prompt */}
              <InstallPrompt />
            </ToastProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
