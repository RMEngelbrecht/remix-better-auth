import { form, get, post, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  // better-auth's HTTP API (sign-in/up, sign-out, session, OAuth callbacks, ...).
  // Any method is accepted; better-auth routes the request internally.
  betterAuth: '/api/auth/*path',
  home: '/',
  login: form('/login'),
  signup: form('/signup'),
  logout: post('/logout'),
  // Everything under /dashboard requires a signed-in user.
  dashboard: route('/dashboard', {
    index: get('/'),
  }),
})
