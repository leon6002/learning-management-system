import { Session } from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_ROUTE,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    //req.auth, use !! to turn it into a boolean
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
      return;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }

    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL(LOGIN_ROUTE, nextUrl));
    }

    return;
  }
);

export function middleware(request: NextRequest) {
  // Middleware logic
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
