import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";

import "./globals.css";
import { authOptions } from "./lib/auth";
import Login from "./components/Login";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { QueryProvider } from "./components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {
          !session ? <Login /> : (
            <QueryProvider>
              <SessionProviderWrapper>
                {children}
              </SessionProviderWrapper>
            </QueryProvider>
          )
        }
      </body>
    </html>
  );
}
