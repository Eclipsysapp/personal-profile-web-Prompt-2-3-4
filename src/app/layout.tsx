import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://anilbhimani.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Anil Bhimani — Writing, Work & Ideas",
    template: "%s | Anil Bhimani",
  },

  description:
    "The personal site of Anil Bhimani — writing on technology, building and business, with a protected professional profile for verified visitors.",

  applicationName: "Anil Bhimani",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    title: "Anil Bhimani — Writing, Work & Ideas",
    description:
      "Writing on technology, building and business, with a protected professional profile for verified visitors.",
    siteName: "Anil Bhimani",
  },

  twitter: {
    card: "summary_large_image",
    title: "Anil Bhimani — Writing, Work & Ideas",
    description:
      "Writing on technology, building and business, with a protected professional profile for verified visitors.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
