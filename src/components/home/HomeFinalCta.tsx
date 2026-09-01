import Link from "next/link";
import { ProtectedLink } from "@/components/security/ProtectedLink";

export function HomeFinalCta() {
  return (
    <section className="home-cta">
      <div className="home-container">
        <div className="home-cta-inner">
          <span className="home-kicker">Start here</span>
          <h2>Read the writing, or request the full profile.</h2>
          <p>
            The blog is open to everyone. The detailed professional profile is
            shared with verified visitors through a quick access request.
          </p>
          <div className="home-cta-actions">
            <Link href="/blog" className="home-btn home-btn-primary">
              Explore the blog
              <span aria-hidden="true">→</span>
            </Link>
            <ProtectedLink href="/about" className="home-btn home-btn-ghost">
              Request profile access
            </ProtectedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
