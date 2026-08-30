import type { Metadata } from "next";
import { CountdownTimer } from "@/components/coming-soon/CountdownTimer";
import "./coming-soon.css";

const description =
  "Anil Bhimani’s new digital experience is being carefully prepared and will be launching soon.";

export const metadata: Metadata = {
  title: {
    absolute: "Anil Bhimani | Coming Soon",
  },
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Anil Bhimani | Coming Soon",
    description,
    siteName: "Anil Bhimani",
  },
  twitter: {
    card: "summary",
    title: "Anil Bhimani | Coming Soon",
    description,
  },
};

export default function ComingSoonPage() {
  return (
    <main className="construction-page">
      <div className="construction-orb construction-orb-one" aria-hidden="true" />
      <div className="construction-orb construction-orb-two" aria-hidden="true" />

      <section className="construction-hero" aria-labelledby="construction-title">
        <div className="construction-brand" aria-label="Anil Bhimani">
          <span aria-hidden="true">AB</span>
          <strong>Anil Bhimani</strong>
        </div>

        <p className="construction-badge">
          <span aria-hidden="true" />
          Website Under Construction
        </p>

        <h1 id="construction-title">Something meaningful is on the way.</h1>
        <p className="construction-copy">
          We’re refining the experience and getting everything ready.
          Please check back soon.
        </p>

        <CountdownTimer launchAt={process.env.NEXT_PUBLIC_LAUNCH_AT} />
      </section>

      <footer className="construction-footer">
        © {new Date().getFullYear()} Anil Bhimani
      </footer>
    </main>
  );
}
