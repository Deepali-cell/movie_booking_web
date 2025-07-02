import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk SDK to fetch full user
const CLERK_API_URL = "https://api.clerk.com/v1/users";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY!;

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // ✅ Fetch full user to access publicMetadata
  const userRes = await fetch(`${CLERK_API_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${CLERK_SECRET_KEY}`,
    },
  });

  const userData = await userRes.json();
  const role = userData?.public_metadata?.role;
  const path = req.nextUrl.pathname;

  // 🔒 Role-based protection
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/theaterOwner") && role !== "owner") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next|api/public).*)"], // All pages except static/public/_next
};
