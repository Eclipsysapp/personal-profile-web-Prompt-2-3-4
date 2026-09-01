import type { Metadata } from "next";
import Link from "next/link";
import { BlogAuthorProvider } from "@/components/blog/BlogAuthorProvider";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { getBlogSite } from "@/lib/blog-api";
import type { BlogSite } from "@/types/blog";
import "../blog/blog.css";
import "../blog/community.css";
import "../privacy-policy/privacy-policy.css";

const fallbackSite: BlogSite = {
  full_name: "Anil Bhimani",
  professional_title: null,
  short_intro:
    "Ideas, technology, business observations and practical perspectives.",
  welcome_message: null,
  website_title: null,
  profile_image: null,
  social_links: {},
};

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | Anil Bhimani" },
  description:
    "Terms governing use of the Anil Bhimani website, public blog, social-login accounts, and community article submissions.",
  alternates: { canonical: "/terms-of-service" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/terms-of-service",
    title: "Terms of Service | Anil Bhimani",
    description:
      "Terms for using anilbhimani.com and its blog community features.",
  },
};

export default async function TermsOfServicePage() {
  let site = fallbackSite;

  try {
    const response = await getBlogSite();
    site = response.site;
  } catch {
    // Keep the public terms readable if the branding API is unavailable.
  }

  return (
    <div className="geeky-shell privacy-policy-shell">
      <BlogAuthorProvider>
        <BlogHeader site={site} />
        <main className="privacy-policy-page">
          <header className="privacy-policy-hero">
            <div className="geeky-container privacy-policy-hero-inner">
              <p className="privacy-policy-eyebrow">Legal</p>
              <h1>Terms of Service</h1>
              <p>
                These terms govern your use of anilbhimani.com, its public blog,
                and its social-login and community publishing features.
              </p>
              <p className="privacy-policy-updated">
                <strong>Last Updated:</strong> September 1, 2026
              </p>
            </div>
          </header>

          <div className="geeky-container privacy-policy-layout">
            <aside className="privacy-policy-nav" aria-label="Terms of service sections">
              <h2>On this page</h2>
              <nav>
                <a href="#acceptance">Acceptance of Terms</a>
                <a href="#services">Website and Blog Services</a>
                <a href="#accounts">Accounts / Social Login</a>
                <a href="#submissions">User-Submitted Articles</a>
                <a href="#ownership">Ownership and License</a>
                <a href="#prohibited-conduct">Prohibited Conduct</a>
                <a href="#moderation">Moderation and Removal</a>
                <a href="#third-parties">Third-Party Providers</a>
                <a href="#availability">Availability and Changes</a>
                <a href="#disclaimers">Disclaimers</a>
                <a href="#liability">Limitation of Liability</a>
                <a href="#termination">Suspension / Termination</a>
                <a href="#privacy">Privacy</a>
                <a href="#changes">Changes to Terms</a>
                <a href="#contact">Contact</a>
              </nav>
            </aside>

            <article className="privacy-policy-content">
              <section id="acceptance">
                <h2>Acceptance of Terms</h2>
                <p>
                  By accessing or using anilbhimani.com (the “Website”), including
                  its blog and community features, you agree to these Terms of
                  Service. If you do not agree, do not use the Website or submit
                  content. Additional notices presented with a particular feature
                  also apply to your use of that feature.
                </p>
              </section>

              <section id="services">
                <h2>Website and Blog Services</h2>
                <p>
                  The Website provides public articles, professional profile
                  information, and related content. It may also allow eligible
                  users to sign in, prepare articles, submit articles for review,
                  and participate in blog discussions. The supporting API is
                  operated through api.anilbhimani.com.
                </p>
                <p>
                  Community publishing is a moderated feature. Creating an account
                  or submitting material does not guarantee that it will be
                  reviewed by a particular date, accepted, or published.
                </p>
              </section>

              <section id="accounts">
                <h2>User Accounts and Social Login</h2>
                <p>
                  Blog author accounts may be created or accessed through supported
                  OAuth providers, including Google, GitHub, Facebook, and X. You
                  are responsible for maintaining the security of the provider
                  account you use and for activity conducted through your resulting
                  Website account.
                </p>
                <p>
                  You must provide accurate information, use only an account you
                  are authorized to use, and promptly report suspected unauthorized
                  access through the Website&apos;s current contact method. Provider
                  passwords are handled by the respective provider and should never
                  be sent to this Website.
                </p>
              </section>

              <section id="submissions">
                <h2>User-Submitted Articles and Content</h2>
                <p>
                  You may be able to submit draft articles, images, titles,
                  descriptions, comments, profile details, and other material
                  (“Submitted Content”). You are responsible for your Submitted
                  Content and must have all rights and permissions necessary to
                  provide it and permit its use under these Terms.
                </p>
                <p>
                  Submitted articles generally remain non-public unless and until
                  they are approved and published. You must not submit confidential
                  information belonging to another person or material that you are
                  not entitled to publish.
                </p>
              </section>

              <section id="ownership">
                <h2>Content Ownership and License</h2>
                <p>
                  You retain ownership of the original content you create and
                  submit. These Terms do not transfer ownership of your original
                  articles to Anil Bhimani.
                </p>
                <p>
                  By submitting content, you grant Anil Bhimani a non-exclusive,
                  worldwide, royalty-free license to host, store, reproduce,
                  format, adapt for display and accessibility, review, moderate,
                  publish, display, distribute, and promote that content as
                  reasonably necessary to operate the Website and blog. This
                  license includes creating technical copies, previews, excerpts,
                  thumbnails, and backups.
                </p>
                <p>
                  The license continues while content is hosted or published and
                  for a reasonable period afterward for backups, security records,
                  and legal compliance. A removal request may be made through the
                  contact method described below, subject to legitimate retention
                  requirements and the rights of others.
                </p>
              </section>

              <section id="prohibited-conduct">
                <h2>Prohibited Conduct</h2>
                <p>You must not use the Website to:</p>
                <ul>
                  <li>violate applicable law or another person&apos;s rights;</li>
                  <li>
                    submit infringing, deceptive, defamatory, abusive, hateful,
                    harassing, sexually exploitative, or unlawfully discriminatory content;
                  </li>
                  <li>impersonate another person or misrepresent affiliation;</li>
                  <li>
                    publish personal, confidential, or sensitive information
                    without appropriate authorization;
                  </li>
                  <li>distribute malware, harmful code, spam, or fraudulent links;</li>
                  <li>
                    bypass access controls, probe security, disrupt service, scrape
                    excessively, or attempt unauthorized access; or
                  </li>
                  <li>use automated means in a manner that burdens or harms the Website.</li>
                </ul>
              </section>

              <section id="moderation">
                <h2>Moderation, Rejection, and Removal</h2>
                <p>
                  Submitted posts and comments may be reviewed before or after
                  publication. Content may be edited for formatting with the
                  author&apos;s substance preserved, returned with feedback, rejected,
                  unpublished, restricted, or removed when it violates these Terms,
                  creates legal or security risk, is unsuitable for the Website,
                  or for other reasonable editorial or operational reasons.
                </p>
                <p>
                  Publication decisions remain editorial decisions. No payment,
                  publication, audience, ranking, permanence, or response is
                  promised merely because content was submitted or previously published.
                </p>
              </section>

              <section id="third-parties">
                <h2>Third-Party OAuth Providers and Links</h2>
                <p>
                  OAuth authentication is provided by independent services such as
                  Google, GitHub, Meta/Facebook, and X. Their availability, account
                  controls, and processing of information are governed by their own
                  terms and policies. The Website is not responsible for a
                  provider&apos;s services or actions.
                </p>
                <p>
                  The Website may link to other third-party sites or resources.
                  Links do not constitute an endorsement, and use of third-party
                  resources is at your own discretion and subject to their terms.
                </p>
              </section>

              <section id="availability">
                <h2>Availability and Service Changes</h2>
                <p>
                  The Website, API, content, and community features may be changed,
                  suspended, limited, or discontinued at any time. Maintenance,
                  security events, provider outages, or technical issues may cause
                  temporary interruptions. Reasonable efforts may be made to keep
                  services available, but uninterrupted or permanent availability
                  is not guaranteed.
                </p>
              </section>

              <section id="disclaimers">
                <h2>Disclaimer of Warranties</h2>
                <p>
                  To the extent permitted by applicable law, the Website and its
                  content are provided “as is” and “as available,” without warranties
                  of any kind, whether express or implied. No warranty is made that
                  content is complete, current, error-free, fit for a particular
                  purpose, or that the Website will be secure or uninterrupted.
                </p>
                <p>
                  Blog and professional content is provided for general
                  informational purposes. You remain responsible for evaluating it
                  and obtaining appropriate professional advice where needed.
                </p>
              </section>

              <section id="liability">
                <h2>Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, Anil Bhimani
                  will not be liable for indirect, incidental, special,
                  consequential, exemplary, or punitive damages, or for loss of
                  data, opportunity, goodwill, or profits arising from or related
                  to your use of, or inability to use, the Website, its content,
                  third-party services, or user submissions.
                </p>
                <p>
                  Nothing in these Terms excludes or limits liability that cannot
                  lawfully be excluded or limited.
                </p>
              </section>

              <section id="termination">
                <h2>Account Suspension and Termination</h2>
                <p>
                  Access to an account or community feature may be suspended or
                  terminated when these Terms are violated, an account poses a
                  security or legal risk, activity appears abusive or fraudulent,
                  or suspension is reasonably necessary to protect the Website or
                  others. Content may also be restricted during an investigation.
                </p>
                <p>
                  You may stop using the Website at any time. To request deletion
                  of social-login account information, follow the public Data
                  Deletion Instructions.
                </p>
                <Link className="privacy-policy-contact" href="/data-deletion">
                  View Data Deletion Instructions
                </Link>
              </section>

              <section id="privacy">
                <h2>Privacy</h2>
                <p>
                  The Privacy Policy explains how personal and technical
                  information is collected, used, retained, secured, and shared in
                  connection with the Website and social login. It forms an
                  important part of your understanding of these services.
                </p>
                <Link className="privacy-policy-contact" href="/privacy-policy">
                  Read the Privacy Policy
                </Link>
              </section>

              <section id="changes">
                <h2>Changes to These Terms</h2>
                <p>
                  These Terms may be updated to reflect changes to the Website,
                  community features, providers, or applicable requirements. The
                  revised Terms will be posted here with an updated “Last Updated”
                  date. Continued use after revised Terms take effect constitutes
                  acceptance of those Terms to the extent permitted by law.
                </p>
              </section>

              <section id="contact">
                <h2>Contact</h2>
                <p>
                  For questions about these Terms, account concerns, or content
                  requests, use the current contact method provided on the Anil
                  Bhimani website. Describe the request clearly and do not send
                  passwords or private OAuth credentials.
                </p>
                <Link className="privacy-policy-contact" href="/#contact">
                  Go to the website contact section
                </Link>
              </section>
            </article>
          </div>
        </main>
        <BlogFooter site={site} />
      </BlogAuthorProvider>
    </div>
  );
}
