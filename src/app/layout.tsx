import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Time Synx - Global Time Zone Converter",
  description: "Modern time zone converter with meeting planner, world clock, and smart scheduling features. Compare multiple time zones and find the best meeting times.",
  keywords: ["Time Synx", "Time Zone", "Converter", "Meeting Planner", "World Clock", "Scheduler", "Time Zone Comparison"],
  authors: [{ name: "Time Synx Team" }],
  openGraph: {
    title: "Time Synx - Global Time Zone Converter",
    description: "Compare time zones and plan meetings across the world with ease",
    url: "https://timesynx.app",
    siteName: "Time Synx",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Synx - Global Time Zone Converter",
    description: "Compare time zones and plan meetings across the world with ease",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
