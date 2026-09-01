import { ProtectedLink } from "@/components/security/ProtectedLink";
import type { BlogSite } from "@/types/blog";

const PROTECTED_SECTIONS = [
  {
    href: "/about",
    title: "About",
    description: "Background, focus areas and the story so far.",
  },
  {
    href: "/experience",
    title: "Experience",
    description: "Roles, responsibilities and professional history.",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Selected work, case studies and things I have built.",
  },
];

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfilePreview({ site }: { site: BlogSite }) {
  const name = site.full_name?.trim() || "Anil Bhimani";
  const intro =
    site.short_intro?.trim() ||
    "Ideas, technology, business observations and practical perspectives.";

  return (
    <section className="home-profile">
      <div className="home-container home-profile-grid">
        <div className="home-profile-copy">
          <span className="home-kicker">The profile</span>
          <h2 className="home-profile-heading">
            Public introduction. Private detail.
          </h2>
          <p>{intro}</p>
          <p className="home-profile-secondary">
            The complete profile — experience, projects and personal detail —
            stays behind a verified access request. Choose a section to continue
            through the secure flow.
          </p>
        </div>

        <div className="home-profile-list">
          {PROTECTED_SECTIONS.map((section, index) => (
            <ProtectedLink
              key={section.href}
              href={section.href}
              className="home-profile-item"
              title={`${section.title} — protected section`}
            >
              <span className="home-profile-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </span>
              <span className="home-profile-lock">
                <LockIcon />
                Verify
              </span>
            </ProtectedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
