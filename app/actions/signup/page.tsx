import type { Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { AuthLayout, FormError, buttonStyle, formStyle, mutedStyle } from '../../ui/auth-layout.tsx'

export interface SignupPageProps {
  name?: string
  email?: string
  error?: string | null
  redirectTo?: string | null
}

export function SignupPage(handle: Handle<SignupPageProps>) {
  return () => {
    let { name = '', email = '', error, redirectTo } = handle.props
    let loginHref = routes.login.index.href()
    if (redirectTo) loginHref += `?${new URLSearchParams({ redirectTo })}`

    return (
      <AuthLayout title="Create an account">
        <FormError message={error} />
        <form method="POST" action={routes.signup.action.href()} mix={formStyle}>
          {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
          <label>
            Name
            <input type="text" name="name" autoComplete="name" required value={name} />
          </label>
          <label>
            Email
            <input type="email" name="email" autoComplete="email" required value={email} />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <button type="submit" mix={buttonStyle}>
            Create account
          </button>
        </form>
        <p mix={mutedStyle}>
          Already have an account? <a href={loginHref}>Sign in</a>
        </p>
      </AuthLayout>
    )
  }
}
