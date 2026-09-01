import type { Metadata } from "next";
import Link from "next/link";
import { BlogAuthorProvider } from "@/components/blog/BlogAuthorProvider";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { getBlogSite } from "@/lib/blog-api";
import type { BlogSite } from "@/types/blog";
import "../blog/blog.css";
import "../blog/community.css";
import "./privacy-policy.css";

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
  title: { absolute: "Privacy Policy | Anil Bhimani" },
  description:
    "Learn how Anil Bhimani collects, uses, protects, retains, and shares information when you use anilbhimani.com and its social-login features.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/privacy-policy",
    title: "Privacy Policy | Anil Bhimani",
    description:
      "How information is handled when you use anilbhimani.com, including its blog, authentication, and social-login features.",
  },
};

export default async function PrivacyPolicyPage() {
  let site = fallbackSite;

  try {
    const response = await getBlogSite();
    site = response.site;
  } catch {
    // The policy remains public and readable if the branding API is unavailable.
  }

  return (
    <div className="geeky-shell privacy-policy-shell">
      <BlogAuthorProvider>
        <BlogHeader site={site} />
        <main className="privacy-policy-page">
          <header className="privacy-policy-hero">
            <div className="geeky-container privacy-policy-hero-inner">
              <p className="privacy-policy-eyebrow">Legal</p>
              <h1>Privacy Policy</h1>
              <p>
                This policy explains how information is handled when you visit
                anilbhimani.com, read or contribute to the public blog, or use
                account and social-login features.
              </p>
              <p className="privacy-policy-updated">
                <strong>Last Updated:</strong> September 1, 2026
              </p>
            </div>
          </header>

          <div className="geeky-container privacy-policy-layout">
            <aside className="privacy-policy-nav" aria-label="Privacy policy sections">
              <h2>On this page</h2>
              <nav>
                <a href="#information-we-collect">Information We Collect</a>
                <a href="#social-login">Social Login / OAuth</a>
                <a href="#facebook-login">Facebook Login</a>
                <a href="#how-information-is-used">How Information Is Used</a>
                <a href="#cookies">Cookies and Authentication</a>
                <a href="#data-sharing">Data Sharing</a>
                <a href="#data-retention">Data Retention</a>
                <a href="#data-security">Data Security</a>
                <a href="#rights">User Rights and Choices</a>
                <a href="#data-deletion">Account / Data Deletion</a>
                <a href="#third-party-services">Third-Party Services</a>
                <a href="#children">Children&apos;s Privacy</a>
                <a href="#changes">Changes to This Policy</a>
                <a href="#contact">Contact</a>
              </nav>
            </aside>

            <article className="privacy-policy-content">
              <section aria-labelledby="introduction">
                <h2 id="introduction">Introduction</h2>
                <p>
                  This Privacy Policy applies to the website operated under the
                  Anil Bhimani name at <strong>anilbhimani.com</strong> and to
                  related requests made to <strong>api.anilbhimani.com</strong>.
                  It describes the types of information that may be processed,
                  why that information is used, and the choices available to you.
                </p>
              </section>

              <section id="information-we-collect">
                <h2>Information We Collect</h2>
                <p>The information processed depends on how you use the website:</p>
                <ul>
                  <li>
                    <strong>Information you provide:</strong> profile or account
                    details, blog posts, comments, and other information you
                    choose to submit through available forms or community features.
                  </li>
                  <li>
                    <strong>Social-login profile information:</strong> details
                    supplied by an OAuth provider, which may include your name,
                    email address, provider account identifier, username, and
                    profile image.
                  </li>
                  <li>
                    <strong>Technical and security information:</strong> IP
                    address, browser or device information, user-agent data,
                    request timestamps, authentication/session metadata, and
                    security events needed to operate and protect the website.
                  </li>
                  <li>
                    <strong>Public content:</strong> information you intentionally
                    publish, such as an approved blog article, author display
                    name, or approved comment, may be visible to other visitors.
                  </li>
                </ul>
              </section>

              <section id="social-login">
                <h2>Social Login / OAuth Information</h2>
                <p>
                  The blog may let you authenticate through Google, GitHub,
                  Facebook, X/Twitter, or another OAuth provider made available
                  on the sign-in screen. When you choose a provider, that provider
                  authenticates you and returns only the account information
                  permitted by you and made available under the requested scope.
                </p>
                <div className="privacy-policy-callout">
                  <strong>Your provider password stays with your provider.</strong>
                  <p>
                    This website does not collect or receive your Google, GitHub,
                    Facebook, or other OAuth-provider password or login credentials.
                    Authentication is performed by the respective provider. The
                    application uses the resulting provider identity and a local
                    session token to recognize your blog account.
                  </p>
                </div>
                <p>
                  The exact information received can vary according to the
                  provider, its policies, your provider settings, and the
                  permissions you grant. You may revoke the website&apos;s access
                  from your provider account settings, although revocation does
                  not automatically erase information already received and
                  retained by this website.
                </p>
              </section>

              <section id="facebook-login">
                <h2>Facebook Login</h2>
                <p>
                  If you choose Facebook Login, Meta authenticates your account.
                  Depending on the permissions you approve and the information
                  Facebook makes available, this website may receive your public
                  profile information, such as your name, Facebook account ID,
                  profile image, and email address when email permission is
                  granted and an email is available.
                </p>
                <p>
                  This information is used to create or connect your local blog
                  account, display appropriate author information, maintain your
                  authenticated session, and protect the community. The website
                  does not receive your Facebook password and does not post to
                  Facebook on your behalf unless a separate feature and permission
                  are clearly presented to you.
                </p>
              </section>

              <section id="how-information-is-used">
                <h2>How Information Is Used</h2>
                <p>Information may be used to:</p>
                <ul>
                  <li>provide public blog content and community features;</li>
                  <li>create, connect, and administer authenticated accounts;</li>
                  <li>display author names, profile images, posts, and approved comments;</li>
                  <li>maintain sessions and remember authentication state;</li>
                  <li>moderate submissions and respond to account or support requests;</li>
                  <li>detect abuse, investigate security events, and protect users and services;</li>
                  <li>debug, maintain, and improve the reliability of the website and API; and</li>
                  <li>comply with applicable legal obligations and enforce website rules.</li>
                </ul>
              </section>

              <section id="cookies">
                <h2>Cookies and Authentication</h2>
                <p>
                  The website and API may use essential cookies, session storage,
                  local storage, and server-side session records to complete OAuth
                  flows, maintain authentication, preserve authorized access, and
                  prevent fraud or misuse. For example, a temporary OAuth state
                  value may be maintained during provider authentication, while a
                  local blog session token may be stored in your browser&apos;s session
                  storage.
                </p>
                <p>
                  These mechanisms are functional and security-related. Blocking
                  or clearing them may sign you out or prevent authentication and
                  protected features from working correctly. This policy does not
                  represent that analytics or advertising cookies are in use where
                  such systems have not been implemented.
                </p>
              </section>

              <section id="data-sharing">
                <h2>Data Sharing</h2>
                <p>Information may be shared only as reasonably necessary with:</p>
                <ul>
                  <li>
                    OAuth providers when you initiate or manage social login;
                  </li>
                  <li>
                    hosting, infrastructure, security, and technical service
                    providers that help operate the website and API;
                  </li>
                  <li>
                    authorities or other parties when required by law, to protect
                    rights and safety, or to investigate fraud or security threats; and
                  </li>
                  <li>
                    other visitors when you intentionally publish content through
                    public blog features.
                  </li>
                </ul>
                <p>
                  Personal information is not offered for sale. Service providers
                  may process information only for operational purposes connected
                  with the services they supply.
                </p>
              </section>

              <section id="data-retention">
                <h2>Data Retention</h2>
                <p>
                  Information is retained for as long as reasonably necessary to
                  provide the relevant account or blog feature, maintain security,
                  resolve disputes, enforce agreements, and meet applicable legal
                  obligations. Retention periods vary by data type. Session records
                  may expire automatically, while published content, moderation
                  records, security logs, and records needed to document requests
                  may be kept for longer where there is a legitimate operational,
                  safety, or legal need.
                </p>
                <p>
                  When information is no longer needed, reasonable steps are taken
                  to delete, anonymize, or securely isolate it, subject to backup
                  cycles and legal requirements.
                </p>
              </section>

              <section id="data-security">
                <h2>Data Security</h2>
                <p>
                  Reasonable administrative and technical safeguards are used to
                  protect information, including limited API access, session-token
                  controls, expiration, and security logging. No internet service
                  or storage system can guarantee absolute security, so users
                  should also protect their provider accounts and sign out on
                  shared devices.
                </p>
              </section>

              <section id="rights">
                <h2>User Rights and Choices</h2>
                <p>
                  Depending on your location, you may have rights to request
                  access to, correction of, deletion of, restriction of, or a copy
                  of certain personal information, and to object to particular
                  processing. You may also:
                </p>
                <ul>
                  <li>sign out and clear website data stored by your browser;</li>
                  <li>revoke social-login access in your OAuth provider settings;</li>
                  <li>choose not to publish blog content or comments; and</li>
                  <li>request account or data deletion as described below.</li>
                </ul>
                <p>
                  A request may require reasonable identity verification. Some
                  information may be retained where required for security, legal
                  compliance, fraud prevention, or the protection of others&apos; rights.
                </p>
              </section>

              <section id="data-deletion">
                <h2>Account and Data Deletion</h2>
                <p>
                  You may request deletion of your account and information
                  associated with a Google, GitHub, Facebook, X/Twitter, or other
                  supported social-login identity. Use the current contact method
                  available on this website and state that you are requesting
                  <strong> social-login account deletion</strong>. Include the
                  provider you used and enough information to locate and verify
                  the account; do not send your provider password.
                </p>
                <p>
                  After verification, the request will be reviewed and eligible
                  profile, provider-association, and session information will be
                  deleted or de-identified. You may be asked whether public posts
                  or comments should also be removed or anonymized. Limited records
                  may be retained when necessary for legal compliance, security,
                  abuse prevention, dispute resolution, or to document completion
                  of the request.
                </p>
                <h3>Facebook data deletion</h3>
                <p>
                  Facebook users may follow the same process to request deletion
                  of information received through Facebook Login. You can also
                  remove this website from the Apps and Websites section of your
                  Facebook settings to revoke future access. Removing the app from
                  Facebook does not by itself delete data previously received by
                  this website, so submit a deletion request through the website&apos;s
                  contact method if you also want locally held account information
                  removed.
                </p>
              </section>

              <section id="third-party-services">
                <h2>Third-Party Services</h2>
                <p>
                  OAuth providers and infrastructure providers operate under their
                  own terms and privacy policies. This website may also link to
                  independent third-party websites. Their handling of information
                  is controlled by their policies, not this one. Review the privacy
                  settings and policies of Google, GitHub, Meta/Facebook,
                  X/Twitter, or any other provider you choose before authorizing access.
                </p>
              </section>

              <section id="children">
                <h2>Children&apos;s Privacy</h2>
                <p>
                  This website and its account features are not directed to
                  children under 13, and personal information is not knowingly
                  collected from children under 13. If you believe a child has
                  provided personal information, use the contact method below so
                  the matter can be reviewed and appropriate action taken.
                </p>
              </section>

              <section id="changes">
                <h2>Changes to This Privacy Policy</h2>
                <p>
                  This policy may be updated as the website, its providers, or
                  applicable requirements change. The revised version will be
                  posted on this page with an updated “Last Updated” date. Material
                  changes may also be highlighted through an appropriate website notice.
                </p>
              </section>

              <section id="contact">
                <h2>Contact</h2>
                <p>
                  For privacy questions, rights requests, or account/data deletion,
                  use the current contact method provided on the Anil Bhimani
                  website. Please describe your request clearly and identify the
                  social-login provider involved, if applicable. Never send an
                  OAuth-provider password or other private login credentials.
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
