"use client";

import Link from "next/link";
import AdminShell from "./_components/AdminShell";
import DashboardSection from "./_components/DashboardSection";
import DashboardStatCard from "./_components/DashboardStatCard";
import {
  ArrowRightIcon,
  CheckIcon,
  ExternalIcon,
  XIcon,
} from "./_components/icons";
import {
  accessRequests,
  dashboardStats,
  pendingComments,
  pendingSubmissions,
  recentBlogs,
  securityEvents,
} from "./_data/demo";

const statusLabels: Record<string, string> = {
  published: "Published",
  draft: "Draft",
  pending: "Pending",
  in_review: "In review",
  approved: "Approved",
  denied: "Denied",
};

export default function AdminDashboardClient() {
  return (
    <AdminShell
      title="Dashboard"
      subtitle="Manage your blog, community and visitor activity."
      activeHref="/admin"
    >
      {/* Summary cards */}
      <div className="adx-stats">
        {dashboardStats.map((stat) => (
          <DashboardStatCard key={stat.key} stat={stat} />
        ))}
      </div>

      {/* Recent blog posts (full-width table) */}
      <DashboardSection
        title="Recent Blog Posts"
        description="Latest articles across all authors"
        action={
          <Link href="/admin/blogs" className="adx-link-btn">
            View all blogs
            <ArrowRightIcon />
          </Link>
        }
      >
        <div className="adx-table-wrap">
          <table className="adx-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {recentBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="adx-cell-title">{blog.title}</td>
                  <td className="adx-cell-muted">{blog.author}</td>
                  <td className="adx-cell-muted">{blog.category}</td>
                  <td>
                    <span className={`adx-pill ${blog.status}`}>
                      {statusLabels[blog.status]}
                    </span>
                  </td>
                  <td className="adx-cell-mono">{blog.date}</td>
                  <td>
                    <div className="adx-row-actions">
                      <button type="button" className="adx-ghost-btn">
                        <ExternalIcon />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card fallback */}
        <div className="adx-cards">
          {recentBlogs.map((blog) => (
            <div className="adx-card-row" key={blog.id}>
              <div className="adx-card-line">
                <strong>{blog.title}</strong>
                <span className={`adx-pill ${blog.status}`}>
                  {statusLabels[blog.status]}
                </span>
              </div>
              <div className="adx-card-meta">
                <span>{blog.author}</span>
                <span>·</span>
                <span>{blog.category}</span>
                <span>·</span>
                <span>{blog.date}</span>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Submissions + comments */}
      <div className="adx-grid cols-2-even">
        <DashboardSection
          title="Pending Submissions"
          description="Community articles awaiting review"
        >
          <div className="adx-list">
            {pendingSubmissions.map((item) => (
              <div className="adx-list-row" key={item.id}>
                <div className="adx-list-main">
                  <strong>{item.title}</strong>
                  <div className="adx-list-meta">
                    <span>{item.author}</span>
                    <span className="sep" aria-hidden />
                    <span>{item.submitted}</span>
                    <span className={`adx-pill ${item.status}`}>
                      {statusLabels[item.status]}
                    </span>
                  </div>
                </div>
                <button type="button" className="adx-ghost-btn">
                  Review
                </button>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          id="comments"
          title="Comments Awaiting Moderation"
          description="Approve or reject reader comments"
        >
          <div className="adx-list">
            {pendingComments.map((comment) => (
              <div className="adx-comment" key={comment.id}>
                <span className="adx-avatar" aria-hidden>
                  {comment.initials}
                </span>
                <div className="adx-comment-body">
                  <div className="adx-comment-top">
                    <strong>{comment.author}</strong>
                    <time>{comment.time}</time>
                  </div>
                  <p className="adx-comment-text">{comment.preview}</p>
                  <p className="adx-comment-article">
                    on <span>{comment.article}</span>
                  </p>
                  <div className="adx-comment-actions">
                    <button type="button" className="adx-ghost-btn approve">
                      <CheckIcon />
                      Approve
                    </button>
                    <button type="button" className="adx-ghost-btn reject">
                      <XIcon />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>

      {/* Access requests (full-width table) */}
      <DashboardSection
        id="access"
        title="Recent Access Requests"
        description="Visitors requesting protected profile access"
        action={
          <Link href="/admin#access" className="adx-link-btn">
            View all
            <ArrowRightIcon />
          </Link>
        }
      >
        <div className="adx-table-wrap">
          <table className="adx-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Email</th>
                <th>Device / Browser</th>
                <th>Requested</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {accessRequests.map((req) => (
                <tr key={req.id}>
                  <td className="adx-cell-title">{req.name}</td>
                  <td className="adx-cell-muted">{req.email}</td>
                  <td className="adx-cell-muted">{req.device}</td>
                  <td className="adx-cell-mono">{req.requested}</td>
                  <td>
                    <span className={`adx-pill ${req.status}`}>
                      {statusLabels[req.status]}
                    </span>
                  </td>
                  <td>
                    <div className="adx-row-actions">
                      <button type="button" className="adx-ghost-btn">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="adx-cards">
          {accessRequests.map((req) => (
            <div className="adx-card-row" key={req.id}>
              <div className="adx-card-line">
                <strong>{req.name}</strong>
                <span className={`adx-pill ${req.status}`}>
                  {statusLabels[req.status]}
                </span>
              </div>
              <div className="adx-card-meta">
                <span>{req.email}</span>
              </div>
              <div className="adx-card-meta">
                <span>{req.device}</span>
                <span>·</span>
                <span>{req.requested}</span>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Security activity (full-width grid feed) */}
      <DashboardSection
        id="security"
        title="Security Activity"
        description="Recent authentication and access events"
      >
        <div className="adx-feed is-grid">
          {securityEvents.map((event) => (
            <div className="adx-feed-row" key={event.id}>
              <div className={`adx-feed-marker ${event.severity}`}>
                <span aria-hidden />
              </div>
              <div className="adx-feed-body">
                <strong>{event.title}</strong>
                <p>{event.detail}</p>
                <time>{event.time}</time>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </AdminShell>
  );
}
