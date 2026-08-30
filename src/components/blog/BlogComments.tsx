"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CommentsApiError,
  getBlogComments,
  submitBlogComment,
} from "@/lib/comments-api";

import {
  getVisitorSessionToken,
  removeVisitorSessionToken,
} from "@/lib/visitor-session";

import type {
  BlogComment,
  BlogCommentsResponse,
} from "@/types/blog";

const MAX_LENGTH = 5000;
const MIN_LENGTH = 2;

type BlogCommentsProps = {
  slug: string;
};

type ComposerProps = {
  compact?: boolean;
  label: string;
  submitting: boolean;
  onCancel?: () => void;
  onSubmit: (body: string) => Promise<boolean>;
};

type SortOrder = "newest" | "oldest";

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "V";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatCommentDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function CommentComposer({
  compact = false,
  label,
  submitting,
  onCancel,
  onSubmit,
}: ComposerProps) {
  const [body, setBody] = useState("");
  const [validation, setValidation] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanBody = body.trim();

    if (cleanBody.length < MIN_LENGTH) {
      setValidation("Please enter at least 2 characters.");
      return;
    }

    if (cleanBody.length > MAX_LENGTH) {
      setValidation(
        "Comments cannot exceed 5,000 characters.",
      );
      return;
    }

    setValidation(null);

    const submitted = await onSubmit(cleanBody);

    if (submitted) {
      setBody("");
    }
  }

  return (
    <form
      className={`gos-comment-composer${
        compact ? " is-reply" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <label
        className="gos-visually-hidden"
        htmlFor={
          compact
            ? "gos-reply-body"
            : "gos-comment-body"
        }
      >
        {label}
      </label>

      <div className="gos-composer-row">
        <span
          className="gos-comment-avatar gos-composer-avatar"
          aria-hidden="true"
        >
          V
        </span>

        <textarea
          id={
            compact
              ? "gos-reply-body"
              : "gos-comment-body"
          }
          value={body}
          maxLength={MAX_LENGTH}
          rows={compact ? 3 : 4}
          placeholder={
            compact
              ? "Write a reply..."
              : "Join the discussion..."
          }
          disabled={submitting}
          onChange={(event) => {
            setBody(event.target.value);

            if (validation) {
              setValidation(null);
            }
          }}
        />
      </div>

      <div className="gos-composer-footer">
        <span
          className={
            body.length >= MAX_LENGTH
              ? "at-limit"
              : undefined
          }
        >
          {body.length.toLocaleString("en-US")} /{" "}
          {MAX_LENGTH.toLocaleString("en-US")}
        </span>

        <div>
          {onCancel ? (
            <button
              type="button"
              className="gos-comment-cancel"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          ) : null}

          <button
            type="submit"
            className="gos-comment-submit"
            disabled={
              submitting ||
              body.trim().length < MIN_LENGTH
            }
          >
            {submitting
              ? "Submitting…"
              : compact
                ? "Post Reply"
                : "Post Comment"}
          </button>
        </div>
      </div>

      {validation ? (
        <p
          className="gos-comment-message is-error"
          role="alert"
        >
          {validation}
        </p>
      ) : null}
    </form>
  );
}

export function BlogComments({
  slug,
}: BlogCommentsProps) {
  const [data, setData] =
    useState<BlogCommentsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [sessionToken, setSessionToken] =
    useState<string | null>(null);

  const [sessionChecked, setSessionChecked] =
    useState(false);

  const [replyingTo, setReplyingTo] =
    useState<number | null>(null);

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("newest");

  const [submittingFor, setSubmittingFor] =
    useState<"comment" | number | null>(null);

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
    parentId?: number;
  } | null>(null);

  const accessHref = `/access?next=${encodeURIComponent(
    `/blog/${slug}`,
  )}`;

  const loadComments = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setLoadError(false);

      try {
        const response = await getBlogComments(
          slug,
          signal,
        );

        setData(response);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setLoadError(true);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [slug],
  );

  /*
   * Session storage is browser-only.
   *
   * The state update runs inside a timer callback rather than
   * synchronously inside the effect body. This keeps the
   * component hydration-safe and satisfies React 19's
   * react-hooks/set-state-in-effect rule.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSessionToken(getVisitorSessionToken());
      setSessionChecked(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
  const controller = new AbortController();

  const fetchComments = async () => {
    try {
      const response = await getBlogComments(
        slug,
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setData(response);
        setLoadError(false);
        setLoading(false);
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      if (!controller.signal.aborted) {
        setLoadError(true);
        setLoading(false);
      }
    }
  };

  void fetchComments();

  return () => {
    controller.abort();
  };
}, [slug]);

  async function submit(
    body: string,
    parentId?: number,
  ): Promise<boolean> {
    if (
      !sessionToken ||
      submittingFor !== null
    ) {
      return false;
    }

    setSubmittingFor(parentId ?? "comment");
    setNotice(null);

    try {
      const response = await submitBlogComment(
        slug,
        sessionToken,
        body,
        parentId,
      );

      setNotice({
        type: "success",
        message: response.message,
        parentId,
      });

      if (parentId !== undefined) {
        setReplyingTo(null);
      }

      return true;
    } catch (error) {
      let message =
        "We couldn’t submit your comment. Please try again.";

      if (error instanceof CommentsApiError) {
        if (error.status === 401) {
          removeVisitorSessionToken();

          setSessionToken(null);
          setReplyingTo(null);

          message =
            "Your session has expired. Sign in with approved access to continue.";
        } else if (error.status === 403) {
          message =
            "You are currently unable to post comments.";
        } else if (error.status === 422) {
          message =
            error.body?.errors?.body?.[0] ??
            error.body?.message ??
            "Please check your comment and try again.";
        } else if (error.status === 429) {
          message =
            "You’ve posted several comments recently. Please wait a few minutes and try again.";
        }
      }

      setNotice({
        type: "error",
        message,
        parentId,
      });

      return false;
    } finally {
      setSubmittingFor(null);
    }
  }

  function renderComment(
    comment: BlogComment,
    reply = false,
  ) {
    const isReplying =
      !reply && replyingTo === comment.id;

    return (
      <li
        className={
          reply
            ? "gos-comment is-reply"
            : "gos-comment"
        }
        key={comment.id}
      >
        <div
          className="gos-comment-avatar"
          aria-hidden="true"
        >
          {initials(
            comment.commenter.display_name,
          )}
        </div>

        <div className="gos-comment-content">
          <div className="gos-comment-meta">
            <strong>
              {comment.commenter.display_name}
            </strong>

            <time dateTime={comment.created_at}>
              {formatCommentDate(
                comment.created_at,
              )}
            </time>
          </div>

          <p>{comment.body}</p>

          {!reply ? (
            sessionToken ? (
              <button
                type="button"
                className="gos-comment-reply-button"
                aria-expanded={isReplying}
                onClick={() => {
                  setNotice(null);

                  setReplyingTo(
                    isReplying
                      ? null
                      : comment.id,
                  );
                }}
              >
                Reply
              </button>
            ) : (
              <Link
                className="gos-comment-reply-link"
                href={accessHref}
              >
                Reply
              </Link>
            )
          ) : null}

          {isReplying ? (
            <CommentComposer
              compact
              label={`Reply to ${comment.commenter.display_name}`}
              submitting={
                submittingFor === comment.id
              }
              onCancel={() =>
                setReplyingTo(null)
              }
              onSubmit={(body) =>
                submit(body, comment.id)
              }
            />
          ) : null}

          {notice?.parentId === comment.id ? (
            <p
              className={`gos-comment-message is-${notice.type}`}
              role={
                notice.type === "error"
                  ? "alert"
                  : "status"
              }
            >
              {notice.message}
            </p>
          ) : null}

          {!reply &&
          comment.replies.length ? (
            <ul className="gos-comment-replies">
              {comment.replies.map((item) =>
                renderComment(item, true),
              )}
            </ul>
          ) : null}
        </div>
      </li>
    );
  }

  const count = data?.total ?? 0;

  const heading =
    loading && !data
      ? "Comments"
      : `${count} ${
          count === 1
            ? "Comment"
            : "Comments"
        }`;

  const sortedComments = data?.comments
    ? [...data.comments]
        .sort((left, right) => {
          const difference =
            Date.parse(left.created_at) -
            Date.parse(right.created_at);

          return sortOrder === "newest"
            ? -difference
            : difference;
        })
        .map((comment) => ({
          ...comment,

          replies: [...comment.replies].sort(
            (left, right) => {
              const difference =
                Date.parse(left.created_at) -
                Date.parse(
                  right.created_at,
                );

              return sortOrder === "newest"
                ? -difference
                : difference;
            },
          ),
        }))
    : [];

  return (
    <section
      className="gos-comments"
      aria-labelledby="comments-title"
    >
      <div className="gos-comments-toolbar">
        <h2 id="comments-title">
          {heading}
        </h2>

        <div
          className="gos-comment-sort"
          aria-label="Sort comments"
        >
          <button
            type="button"
            className={
              sortOrder === "newest"
                ? "is-active"
                : undefined
            }
            aria-pressed={
              sortOrder === "newest"
            }
            onClick={() =>
              setSortOrder("newest")
            }
          >
            Newest
          </button>

          <button
            type="button"
            className={
              sortOrder === "oldest"
                ? "is-active"
                : undefined
            }
            aria-pressed={
              sortOrder === "oldest"
            }
            onClick={() =>
              setSortOrder("oldest")
            }
          >
            Oldest
          </button>
        </div>
      </div>

      {sessionChecked &&
      !sessionToken ? (
        <div className="gos-comment-locked">
          <div className="gos-locked-composer">
            <span
              className="gos-comment-avatar gos-composer-avatar"
              aria-hidden="true"
            >
              V
            </span>

            <div>
              Join the discussion...
            </div>
          </div>

          <div className="gos-locked-footer">
            <p>
              Approved visitor access is
              required to comment.
            </p>

            <Link href={accessHref}>
              Continue to access
            </Link>
          </div>
        </div>
      ) : null}

      {sessionToken ? (
        <>
          <CommentComposer
            label="Join the discussion"
            submitting={
              submittingFor === "comment"
            }
            onSubmit={(body) =>
              submit(body)
            }
          />

          {notice &&
          notice.parentId === undefined ? (
            <p
              className={`gos-comment-message is-${notice.type}`}
              role={
                notice.type === "error"
                  ? "alert"
                  : "status"
              }
            >
              {notice.message}
            </p>
          ) : null}
        </>
      ) : null}

      <div
        className="gos-comments-list-wrap"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <p className="gos-comments-state">
            Loading comments…
          </p>
        ) : null}

        {!loading && loadError ? (
          <div className="gos-comments-state">
            <p>
              Comments couldn’t be loaded.
            </p>

            <button
              type="button"
              onClick={() =>
                void loadComments()
              }
            >
              Try again
            </button>
          </div>
        ) : null}

        {!loading &&
        !loadError &&
        data &&
        data.comments.length === 0 ? (
          <p className="gos-comments-state">
            No comments yet. Be the first
            to start the discussion.
          </p>
        ) : null}

        {!loadError &&
        sortedComments.length ? (
          <ul className="gos-comment-list">
            {sortedComments.map(
              (comment) =>
                renderComment(comment),
            )}
          </ul>
        ) : null}
      </div>
    </section>
  );
}