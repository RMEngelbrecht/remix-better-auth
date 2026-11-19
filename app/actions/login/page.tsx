import type { Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { AuthLayout, FormError, buttonStyle, formStyle, mutedStyle } from '../../ui/auth-layout.tsx'

export interface LoginPageProps {
  email?: string
  error?: string | null
  redirectTo?: string | null
}

export function LoginPage(handle: Handle<LoginPageProps>) {
  return () => {
    let { email = '', error, redirectTo } = handle.props
    let signupHref = routes.signup.index.href()
    if (redirectTo) signupHref += `?${new URLSearchParams({ redirectTo })}`

    return (
      <AuthLayout title="Sign in">
        <FormError message={error} />
        <form method="POST" action={routes.login.action.href()} mix={formStyle}>
          {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
          <label>
            Email
            <input type="email" name="email" autoComplete="email" required value={email} />
          </label>
          <label>
            Password
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          <button type="submit" mix={buttonStyle}>
            Sign in
          </button>
        </form>
        <p mix={mutedStyle}>
          No account yet? <a href={signupHref}>Create one</a>
        </p>
      </AuthLayout>
    )
  }
}
