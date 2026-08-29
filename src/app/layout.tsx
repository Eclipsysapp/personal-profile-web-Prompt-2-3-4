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
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Professional Profile | Secure Digital Portfolio",
    template: "%s | Professional Profile",
  },

  description:
    "A secure professional profile and digital portfolio with controlled visitor access.",

  applicationName: "Professional Profile",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    title: "Professional Profile | Secure Digital Portfolio",
    description:
      "A secure professional profile and digital portfolio with controlled visitor access.",
    siteName: "Professional Profile",
  },

  twitter: {
    card: "summary_large_image",
    title: "Professional Profile | Secure Digital Portfolio",
    description:
      "A secure professional profile and digital portfolio with controlled visitor access.",
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