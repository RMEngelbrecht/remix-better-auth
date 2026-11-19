import { APIError } from 'better-auth/api'
import { formData } from 'remix/middleware/form-data'
import { redirect } from 'remix/response/redirect'
import { createController } from 'remix/router'

import { auth } from '../../data/auth.ts'
import { redirectWithHeaders, safeRedirect } from '../../middleware/auth.ts'
import { routes } from '../../routes.ts'
import { LoginPage } from './page.tsx'

export default createController(routes.login, {
  // GET requests get an empty FormData, so this is cheap for the page too.
  middleware: [formData()],
  actions: {
    index(context) {
      let redirectTo = context.url.searchParams.get('redirectTo')
      if (context.auth.ok) return redirect(safeRedirect(redirectTo), 303)

      return context.render(<LoginPage redirectTo={redirectTo} />)
    },
    async action(context) {
      let email = String(context.formData.get('email') ?? '').trim()
      let password = String(context.formData.get('password') ?? '')
      let redirectTo = context.formData.get('redirectTo')

      try {
        let { headers } = await auth.api.signInEmail({
          body: { email, password },
          headers: context.request.headers,
          returnHeaders: true,
        })
        return redirectWithHeaders(safeRedirect(redirectTo), headers)
      } catch (error) {
        if (!(error instanceof APIError)) throw error

        return context.render(
          <LoginPage
            email={email}
            error={error.body?.message ?? 'Unable to sign in'}
            redirectTo={typeof redirectTo === 'string' ? redirectTo : null}
          />,
          { status: error.statusCode },
        )
      }
    },
  },
})
