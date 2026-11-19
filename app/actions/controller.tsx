import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { assets } from '../assets.ts'
import { auth } from '../data/auth.ts'
import { redirectWithHeaders } from '../middleware/auth.ts'
import { routes } from '../routes.ts'
import { HomePage } from './home-page.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },
    betterAuth(context) {
      return auth.handler(context.request)
    },
    home(context) {
      let user = context.auth.ok ? context.auth.identity.user : null
      return context.render(<HomePage user={user} />)
    },
    async logout(context) {
      if (!context.auth.ok) return redirect(routes.home.href(), 303)

      let { headers } = await auth.api.signOut({
        headers: context.request.headers,
        returnHeaders: true,
      })
      return redirectWithHeaders(routes.home.href(), headers)
    },
  },
})
