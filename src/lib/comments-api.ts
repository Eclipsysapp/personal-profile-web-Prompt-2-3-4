import type {
  BlogCommentsResponse,
  BlogCommentSubmissionResponse,
} from "@/types/blog";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class CommentsApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody | null,
  ) {
    super(body?.message ?? `Comments request failed (${status})`);
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as
    | T
    | ApiErrorBody
    | null;

  if (!response.ok) {
    throw new CommentsApiError(
      response.status,
      body as ApiErrorBody | null,
    );
  }

  return body as T;
}

export async function getBlogComments(
  slug: string,
  signal?: AbortSignal,
): Promise<BlogCommentsResponse> {
  const response = await fetch(
    `${API_URL}/api/blogs/${encodeURIComponent(slug)}/comments`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    },
  );

  return readResponse<BlogCommentsResponse>(response);
}

export async function submitBlogComment(
  slug: string,
  token: string,
  body: string,
  parentId?: number,
): Promise<BlogCommentSubmissionResponse> {
  const response = await fetch(
    `${API_URL}/api/blogs/${encodeURIComponent(slug)}/comments`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
        ...(parentId === undefined ? {} : { parent_id: parentId }),
      }),
    },
  );

  return readResponse<BlogCommentSubmissionResponse>(response);
}
