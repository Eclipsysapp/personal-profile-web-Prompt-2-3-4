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
  title: { absolute: "Data Deletion Instructions | Anil Bhimani" },
  description:
    "Instructions for requesting deletion of personal data associated with Facebook Login and other social-login accounts on anilbhimani.com.",
  alternates: { canonical: "/data-deletion" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/data-deletion",
    title: "Data Deletion Instructions | Anil Bhimani",
    description:
      "How to request deletion of information associated with Facebook Login on anilbhimani.com.",
  },
};

export default async function DataDeletionPage() {
  let site = fallbackSite;

  try {
    const response = await getBlogSite();
    site = response.site;
  } catch {
    // Keep these public instructions available if the branding API is unavailable.
  }

  return (
    <div className="geeky-shell privacy-policy-shell">
      <BlogAuthorProvider>
        <BlogHeader site={site} />
        <main className="privacy-policy-page">
          <header className="privacy-policy-hero">
            <div className="geeky-container privacy-policy-hero-inner">
              <p className="privacy-policy-eyebrow">Privacy</p>
              <h1>Data Deletion Instructions</h1>
              <p>
                Follow these instructions to request deletion of personal data
                associated with Facebook Login or another supported social-login
                account used on anilbhimani.com.
              </p>
              <p className="privacy-policy-updated">
                <strong>Last Updated:</strong> September 1, 2026
              </p>
            </div>
          </header>

          <div className="geeky-container privacy-policy-layout">
            <aside className="privacy-policy-nav" aria-label="Data deletion sections">
              <h2>On this page</h2>
              <nav>
                <a href="#request-deletion">Request deletion</a>
                <a href="#include">What to include</a>
                <a href="#what-happens">What happens next</a>
                <a href="#facebook-access">Remove Facebook access</a>
                <a href="#important-notes">Important notes</a>
                <a href="#privacy-policy">Privacy Policy</a>
              </nav>
            </aside>

            <article className="privacy-policy-content">
              <section aria-labelledby="overview">
                <h2 id="overview">Overview</h2>
                <p>
                  If you used Facebook Login to access the blog community, you may
                  request deletion of the information associated with that login.
                  This may include the local account profile, Facebook provider
                  association, profile details supplied through Facebook, and
                  active authentication sessions held by this application.
                </p>
                <div className="privacy-policy-callout">
                  <strong>Never send your Facebook password.</strong>
                  <p>
                    Facebook authenticates your account directly. Anil Bhimani
                    does not need your Facebook password or private Facebook login
                    credentials to process a deletion request.
                  </p>
                </div>
              </section>

              <section id="request-deletion">
                <h2>How to Request Deletion</h2>
                <ol>
                  <li>
                    Open the current contact section on the Anil Bhimani website
                    using the button below.
                  </li>
                  <li>
                    State clearly that you are requesting <strong>Facebook Login
                    data deletion</strong> or <strong>social-login account
                    deletion</strong>.
                  </li>
                  <li>
                    Provide the account-identifying information described in the
                    next section so the correct record can be located.
                  </li>
                  <li>
                    Respond to any reasonable identity-verification request. This
                    protects accounts from unauthorized deletion requests.
                  </li>
                </ol>
                <Link className="privacy-policy-contact" href="/#contact">
                  Go to the website contact section
                </Link>
              </section>

              <section id="include">
                <h2>What to Include in Your Request</h2>
                <p>Where applicable, include:</p>
                <ul>
                  <li>the name shown on your blog or social-login account;</li>
                  <li>
                    the email address used with Facebook Login or the application;
                  </li>
                  <li>that Facebook was the login provider you used;</li>
                  <li>
                    any public author name, post, or comment that helps identify
                    the correct account; and
                  </li>
                  <li>
                    whether you also want eligible public posts or comments
                    removed or anonymized.
                  </li>
                </ul>
                <p>
                  Send only the information reasonably needed to identify your
                  account. Do not provide a password, access token, payment detail,
                  or unrelated sensitive information.
                </p>
              </section>

              <section id="what-happens">
                <h2>What Happens After a Request</h2>
                <p>
                  The request will be reviewed and the account may be verified
                  before deletion is performed. Once verified, eligible local
                  profile information, the Facebook account association, and
                  active session information will be deleted or de-identified.
                  Public blog posts or comments will be handled according to the
                  scope of the request and any applicable moderation, legal, or
                  security requirements.
                </p>
                <p>
                  Deletion is not represented as instantaneous. Time may be needed
                  to identify the correct records, verify the request, process
                  related content, and allow protected backup copies to cycle out.
                  A response or confirmation may be provided through the contact
                  channel used for the request.
                </p>
              </section>

              <section id="facebook-access">
                <h2>Removing Facebook Access</h2>
                <p>
                  You can separately revoke this website&apos;s future access from
                  the <strong>Apps and Websites</strong> section of your Facebook
                  settings. Removing the application there prevents continued use
                  of the Facebook authorization, but it does not necessarily
                  delete information that this application previously received.
                </p>
                <p>
                  To request deletion of information already associated with your
                  local account, complete the request process described on this page.
                </p>
              </section>

              <section id="important-notes">
                <h2>Important Notes</h2>
                <ul>
                  <li>
                    Certain limited records may be retained where reasonably
                    necessary for legal compliance, security, abuse prevention,
                    dispute resolution, or documenting completion of the request.
                  </li>
                  <li>
                    Information in protected backups may remain until the relevant
                    backup retention cycle completes.
                  </li>
                  <li>
                    Revoking Facebook access and requesting local data deletion are
                    separate actions; you may choose to do both.
                  </li>
                  <li>
                    These instructions do not delete information held independently
                    by Facebook. Requests concerning Facebook&apos;s own records must
                    be directed to Facebook under its policies and account controls.
                  </li>
                </ul>
              </section>

              <section id="privacy-policy">
                <h2>Privacy Policy</h2>
                <p>
                  For more information about the categories of data processed,
                  why information is used, retention, sharing, security, and your
                  choices, review the full Privacy Policy.
                </p>
                <Link className="privacy-policy-contact" href="/privacy-policy">
                  Read the Privacy Policy
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
