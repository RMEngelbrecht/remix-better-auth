import { createRouter, type RouterContext } from 'remix/router'
import { cop } from 'remix/middleware/cop'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import dashboardController from './actions/dashboard/controller.tsx'
import loginController from './actions/login/controller.tsx'
import signupController from './actions/signup/controller.tsx'
import { assets } from './assets.ts'
import { loadAuth } from './middleware/auth.ts'
import { routes } from './routes.ts'

export const router = createRouter({
  middleware: [
    staticFiles('./public', { index: false }),
    // Reject cross-origin form posts to our cookie-authenticated routes.
    cop(),
    loadAuth(),
    render({ assets }),
  ],
})

export type AppContext = RouterContext<typeof router>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

router.map(routes, controller)
router.map(routes.login, loginController)
router.map(routes.signup, signupController)
router.map(routes.dashboard, dashboardController)
