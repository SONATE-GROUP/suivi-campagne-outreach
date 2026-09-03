import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "lgm_session";

type SessionPayload =
  | { role: "admin" }
  | { role: "client"; clientId: string; slug: string };

async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await getSession(req);
    if (session?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  const clientPageMatch = pathname.match(/^\/([^/]+)(\/prospects)?$/);
  if (
    clientPageMatch &&
    !["admin", "login", "api", "_next"].includes(clientPageMatch[1])
  ) {
    const slug = clientPageMatch[1];
    const session = await getSession(req);
    const authorized =
      session?.role === "admin" ||
      (session?.role === "client" && session.slug === slug);

    if (!authorized) {
      return NextResponse.redirect(new URL(`/login/${slug}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next|login|favicon.ico).*)"],
};
