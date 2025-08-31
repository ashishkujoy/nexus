import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";

import "./globals.css";
import { authOptions } from "./lib/auth";
import Login from "./components/Login";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { QueryProvider } from "./components/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Connection point between mentors and interns",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://res.cloudinary.com"
        />
        <link
          rel="dns-prefetch"
          href="https://randomuser.me"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {
          !session ? <Login /> : (
            <QueryProvider>
              <SessionProviderWrapper>
                {children}
              </SessionProviderWrapper>
              <Analytics />
              <SpeedInsights />
            </QueryProvider>
          )
        }
      </body>
    </html>
  );
}
