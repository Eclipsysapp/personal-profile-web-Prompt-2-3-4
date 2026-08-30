import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const UNDER_CONSTRUCTION =
  process.env.NEXT_PUBLIC_SITE_UNDER_CONSTRUCTION === "true";

export function proxy(request: NextRequest) {
  if (!UNDER_CONSTRUCTION) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(
    new URL("/coming-soon", request.url),
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|coming-soon|.*\\.[^/]+$).*)",
  ],
};
