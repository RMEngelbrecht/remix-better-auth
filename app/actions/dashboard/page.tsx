import type { Handle } from 'remix/component'

import type { AuthSession } from '../../data/auth.ts'
import { routes } from '../../routes.ts'
import { AuthLayout, buttonStyle, mutedStyle } from '../../ui/auth-layout.tsx'

export interface DashboardPageProps {
  user: AuthSession['user']
  session: AuthSession['session']
}

export function DashboardPage(handle: Handle<DashboardPageProps>) {
  return () => {
    let { user, session } = handle.props

    return (
      <AuthLayout title="Dashboard">
        <p>
          Signed in as <strong>{user.name}</strong> ({user.email}).
        </p>
        <p mix={mutedStyle}>Session expires {session.expiresAt.toUTCString()}.</p>
        <form method="POST" action={routes.logout.href()}>
          <button type="submit" mix={buttonStyle}>
            Sign out
          </button>
        </form>
        <p mix={mutedStyle}>
          <a href={routes.home.href()}>Back home</a>
        </p>
      </AuthLayout>
    )
  }
}
