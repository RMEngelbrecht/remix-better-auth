import { auth, requireAuth, type AuthScheme } from 'remix/middleware/auth'
import { redirect } from 'remix/response/redirect'

import { auth as betterAuth, type AuthSession } from '../data/auth.ts'
import { routes } from '../routes.ts'

export type AuthIdentity = AuthSession

/**
 * Resolves the better-auth session cookie into `context.auth`.
 * Requests without a valid session are treated as anonymous.
 */
const betterAuthScheme: AuthScheme<AuthIdentity> = {
  name: 'better-auth',
  async authenticate(context) {
    let session = await betterAuth.api.getSession({ headers: context.request.headers })
    if (!session) return

    return { status: 'success', identity: session }
  },
}

export function loadAuth() {
  return auth({ schemes: [betterAuthScheme] })
}

/** Redirects anonymous visitors to the login page, then back again after login. */
export const requireUser = requireAuth<AuthIdentity>({
  onFailure(context) {
    let redirectTo = context.url.pathname + context.url.search
    return redirect(loginHref(redirectTo), 303)
  },
})

export function loginHref(redirectTo?: string) {
  let href = routes.login.index.href()
  return redirectTo ? `${href}?${new URLSearchParams({ redirectTo })}` : href
}

/** Only allow same-origin relative paths to avoid open redirects. */
export function safeRedirect(value: FormDataEntryValue | string | null | undefined) {
  let fallback = routes.dashboard.index.href()
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}

/** Builds a 303 redirect that carries better-auth's Set-Cookie headers. */
export function redirectWithHeaders(location: string, headers: Headers) {
  let response = redirect(location, 303)
  for (let cookie of headers.getSetCookie()) {
    response.headers.append('Set-Cookie', cookie)
  }
  return response
}
