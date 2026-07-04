import { NextRequest, NextResponse } from "next/server";
import { adminCookie, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = request.cookies.get(adminCookie.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Force password change after first login with a temporary password.
  if (
    session.mustChangePassword &&
    isAdminPage &&
    pathname !== "/admin/change-password"
  ) {
    return NextResponse.redirect(new URL("/admin/change-password", request.url));
  }
  if (
    session.mustChangePassword &&
    isAdminApi &&
    pathname !== "/api/admin/change-password" &&
    pathname !== "/api/admin/logout"
  ) {
    return NextResponse.json(
      { error: "Password change required", mustChangePassword: true },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
