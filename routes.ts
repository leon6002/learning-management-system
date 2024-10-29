/**
 * An array of public routes that do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/", "/pricing", "/api/uploadthing"];

export const authRoutes = ["/auth/login", "/auth/register"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";

export const LOGIN_ROUTE = "/auth/login";

export const TEACHER_ROUTE = "/teacher/courses";

export const HOME_ROUTE = "/";
