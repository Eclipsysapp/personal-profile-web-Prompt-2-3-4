"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBlogAuthor } from "@/components/blog/BlogAuthorProvider";

const PROVIDERS: Array<[string, string]> = [
  ["google", "Google"],
  ["facebook", "Facebook"],
  ["github", "GitHub"],
  ["x", "X / Twitter"],
];

// Map the OAuth error codes a provider redirect may append to friendly copy.
// The redirect/callback contract itself is unchanged.
function friendlyError(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case "access_denied":
    case "cancelled":
    case "user_cancelled_login":
    case "user_cancelled_authorize":
      return "Sign in was cancelled. You can try again whenever you are ready.";
    default:
      return "We could not complete sign in. Please try another provider or try again.";
  }
}

export default function BlogLoginPage() {
  const { author, loading, signInUrl, signOut } = useBlogAuthor();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // One-time read of the OAuth error code from the return URL on mount.
    const params = new URLSearchParams(window.location.search);
    const message = friendlyError(params.get("error"));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (message) setErrorMessage(message);
  }, []);

  return (
    <section className="blog-login">
      <div className="blog-login-wrap">
        <div className="blog-login-brand">
          <div className="blog-login-brand-head">
            <p className="bl-kicker">Anil Bhimani &middot; The Journal</p>
            <h1>Write for the blog community</h1>
            <p>
              Independent ideas and useful perspectives on technology, building
              and business. Bring yours &mdash; draft an article, submit it for
              review, and join the conversation.
            </p>
          </div>
          <ul className="blog-login-points">
            <li>Draft with a focused, distraction-free writing studio.</li>
            <li>Add images, quotes, code and rich media blocks.</li>
            <li>Every submission is reviewed before it goes live.</li>
          </ul>
        </div>

        <div className="blog-login-auth">
          {loading ? (
            <>
              <p className="bl-kicker">Blog community</p>
              <h2>Checking your session</h2>
              <div className="blog-login-status" role="status">
                <span className="blog-login-spinner" aria-hidden="true" />
                One moment&hellip;
              </div>
            </>
          ) : author ? (
            <>
              <p className="bl-kicker">Welcome back</p>
              <h2>You&apos;re signed in</h2>
              <p className="blog-login-auth-intro">
                Continue where you left off or start a new article.
              </p>
              <div className="blog-login-welcome">
                {author.avatar_url ? (
                  <Image
                    unoptimized
                    src={author.avatar_url}
                    alt=""
                    width={46}
                    height={46}
                  />
                ) : (
                  <span className="blog-login-avatar" aria-hidden="true">
                    {(author.display_name || author.name).charAt(0)}
                  </span>
                )}
                <div className="blog-login-welcome-copy">
                  <strong>{author.display_name || author.name}</strong>
                  <small>Blog community author</small>
                </div>
              </div>
              <div className="blog-login-actions">
                <Link className="bl-btn bl-btn-primary" href="/blog/write">
                  Write an article
                </Link>
                <Link className="bl-btn bl-btn-ghost" href="/blog/my-posts">
                  View my posts
                </Link>
              </div>
              <button
                type="button"
                className="blog-login-signout"
                onClick={() => void signOut()}
              >
                Sign out of this account
              </button>
            </>
          ) : (
            <>
              <p className="bl-kicker">Blog community</p>
              <h2>Sign in to write</h2>
              <p className="blog-login-auth-intro">
                Choose a social provider to continue. This account is used only
                for the public blog community and is kept separate from any
                protected profile access.
              </p>

              {errorMessage ? (
                <div className="blog-login-alert blog-login-alert-error" role="alert">
                  {errorMessage}
                </div>
              ) : null}

              <div className="blog-login-providers">
                {PROVIDERS.map(([provider, label]) => (
                  <a key={provider} href={signInUrl(provider)}>
                    <b aria-hidden="true">{label.charAt(0)}</b>
                    <span>Continue with {label}</span>
                    <em aria-hidden="true">&rarr;</em>
                  </a>
                ))}
              </div>

              <p className="blog-login-legal">
                By continuing you agree to our{" "}
                <Link href="/terms-of-service">Terms of Service</Link> and{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>. You can
                request removal of your data anytime via{" "}
                <Link href="/data-deletion">Data Deletion</Link>.
              </p>
            </>
          )}

          <Link className="blog-login-back" href="/blog">
            Back to blog
          </Link>
        </div>
      </div>
    </section>
  );
}
