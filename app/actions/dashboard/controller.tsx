import { createController } from 'remix/router'

import { requireUser } from '../../middleware/auth.ts'
import { routes } from '../../routes.ts'
import { DashboardPage } from './page.tsx'

export default createController(routes.dashboard, {
  // Every action in this controller requires a signed-in user.
  middleware: [requireUser],
  actions: {
    index(context) {
      let { user, session } = context.auth.identity
      return context.render(<DashboardPage user={user} session={session} />)
    },
  },
})
