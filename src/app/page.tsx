export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Professional Profile",
    description:
      "A secure professional profile and digital portfolio with controlled visitor access.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <main className="site-shell">
        <header className="site-header">
          <div className="container header-inner">
            <a href="/" className="brand" aria-label="Home">
              <span className="brand-mark">P</span>

              <span className="brand-copy">
                <strong>Professional Profile</strong>
                <small>Private Digital Portfolio</small>
              </span>
            </a>

            <nav
              className="desktop-nav"
              aria-label="Primary navigation"
            >
              <a href="#overview">Overview</a>
              <a href="#access">Access</a>
              <a href="#security">Security</a>
            </nav>

            <a href="#access" className="header-button">
              Request Access
            </a>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Secure Professional Profile
              </div>

              <h1>
                Professional experience.
                <span> Shared with purpose.</span>
              </h1>

              <p className="hero-description">
                A private digital profile designed to share
                professional experience, skills, projects and
                selected information with verified visitors.
              </p>

              <div className="hero-actions">
                <a href="#access" className="button button-primary">
                  Request Profile Access
                  <span aria-hidden="true">→</span>
                </a>

                <a
                  href="#overview"
                  className="button button-secondary"
                >
                  Learn More
                </a>
              </div>

              <div className="hero-trust-row">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Verified visitors</span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Controlled access</span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Secure sessions</span>
                </div>
              </div>
            </div>

            <div
              className="profile-preview"
              aria-label="Secure profile preview"
            >
              <div className="preview-topbar">
                <div>
                  <span className="preview-label">
                    PRIVATE PROFILE
                  </span>
                  <p>Professional Portfolio</p>
                </div>

                <div className="status-pill">
                  <span />
                  Protected
                </div>
              </div>

              <div className="preview-profile">
                <div className="avatar-placeholder">
                  <span>PP</span>
                </div>

                <div>
                  <div className="preview-line preview-line-title" />
                  <div className="preview-line preview-line-short" />
                </div>
              </div>

              <div className="preview-divider" />

              <div className="preview-stat-grid">
                <div className="preview-stat">
                  <span>01</span>
                  <p>Professional profile</p>
                </div>

                <div className="preview-stat">
                  <span>02</span>
                  <p>Verified access</p>
                </div>

                <div className="preview-stat">
                  <span>03</span>
                  <p>Private content</p>
                </div>
              </div>

              <div className="security-card">
                <div className="security-icon">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <strong>Identity-protected access</strong>
                  <p>
                    Profile information is available only after
                    visitor verification and approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="overview-section">
          <div className="container">
            <div className="section-heading">
              <span className="section-kicker">
                PROFESSIONAL PRESENCE
              </span>

              <h2>
                One profile. A clearer professional story.
              </h2>

              <p>
                Built to present professional information in a
                focused environment while keeping access under
                control.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <span className="feature-number">01</span>

                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M4 19V5h16v14H4Zm4-9h8M8 14h5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3>Professional Overview</h3>

                <p>
                  Experience, education and professional
                  information presented in a clean and structured
                  format.
                </p>
              </article>

              <article className="feature-card">
                <span className="feature-number">02</span>

                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="m12 3 7 3v5c0 4.6-2.8 8.2-7 10-4.2-1.8-7-5.4-7-10V6l7-3Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="m9 12 2 2 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3>Controlled Access</h3>

                <p>
                  Profile access is provided only to verified and
                  approved visitors through a secure access flow.
                </p>
              </article>

              <article className="feature-card">
                <span className="feature-number">03</span>

                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M5 19V9m7 10V5m7 14v-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3>Selected Work</h3>

                <p>
                  Skills, portfolio projects and professional work
                  can be shared without making the entire profile
                  publicly accessible.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="security" className="security-section">
          <div className="container security-layout">
            <div className="security-copy">
              <span className="section-kicker">
                PRIVACY BY DESIGN
              </span>

              <h2>
                Public introduction.
                <br />
                Private professional details.
              </h2>

              <p>
                Instead of publishing sensitive professional
                information openly, access can be requested,
                verified and approved before protected content is
                displayed.
              </p>
            </div>

            <div className="security-points">
              <div className="security-point">
                <span>01</span>
                <div>
                  <strong>Visitor verification</strong>
                  <p>
                    Visitors verify their contact information
                    before requesting profile access.
                  </p>
                </div>
              </div>

              <div className="security-point">
                <span>02</span>
                <div>
                  <strong>Manual approval</strong>
                  <p>
                    Every access request can be reviewed before
                    private content becomes available.
                  </p>
                </div>
              </div>

              <div className="security-point">
                <span>03</span>
                <div>
                  <strong>Time-limited access</strong>
                  <p>
                    Authorized sessions expire automatically and
                    access can be revoked when necessary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="access" className="access-section">
          <div className="container">
            <div className="access-card">
              <div>
                <span className="section-kicker light">
                  REQUEST ACCESS
                </span>

                <h2>
                  Looking for the complete professional profile?
                </h2>

                <p>
                  Submit an access request to continue through the
                  secure visitor verification process.
                </p>
              </div>

              <a href="#" className="access-button">
                Start Access Request
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <span className="brand-mark small">P</span>

              <div>
                <strong>Professional Profile</strong>
                <p>Secure digital portfolio</p>
              </div>
            </div>

            <p className="footer-copyright">
              © {new Date().getFullYear()} Professional Profile.
              All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}