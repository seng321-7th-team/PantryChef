// Demo role preview. There is no sign-in, sign-out, session or token storage in this build.
// The role only decides which menu and screens are shown; it is read from the page address.
// A real session provider (POST /auth/login, token handling) replaces this later.

/** Bearer token for the API. No token source exists in this build, so a real API answers 401. */
export function getDemoAccessToken(): string | null {
  return null;
}
