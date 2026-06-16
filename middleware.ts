import { NextRequest, NextResponse } from "next/server";
import { verifySession, ADMIN_COOKIE } from "@/lib/auth";

/**
 * Protects /admin/* routes. Unauthenticated users are redirected to the admin
 * login page. The login page itself and the auth API are excluded via matcher.
 */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifySession(token);

  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Protect the admin root AND everything under /admin EXCEPT the login page.
  matcher: ["/admin", "/admin/((?!login).*)"],
};
