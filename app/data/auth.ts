import { mkdirSync } from 'node:fs'
import * as path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { betterAuth } from 'better-auth'
import { getMigrations } from 'better-auth/db/migration'

const nodeEnv = process.env.NODE_ENV ?? 'development'
const isProduction = nodeEnv === 'production'
const isTest = nodeEnv === 'test'

// When running behind `npm run hmr`, PORT is the internal app port and
// HMR_PROXY_PORT is the public one the browser talks to.
const publicPort = process.env.HMR_PROXY_PORT ?? process.env.PORT ?? '44100'

export const auth = betterAuth({
  appName: 'Remix App',
  baseURL: process.env.BETTER_AUTH_URL ?? `http://localhost:${publicPort}`,
  basePath: '/api/auth',
  secret: readSecret(),
  database: openDatabase(),
  emailAndPassword: {
    enabled: true,
  },
  // Add OAuth providers here, e.g.
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  // },
  // Their callbacks are served by the `/api/auth/*path` route.
})

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = AuthSession['user']

/** Creates or updates the better-auth tables. */
export async function migrate() {
  let { runMigrations } = await getMigrations(auth.options)
  await runMigrations()
}

// Keep local development and tests zero-config. In production, run
// `npm run db:migrate` as an explicit deploy step instead.
if (!isProduction) {
  await migrate()
}

function openDatabase() {
  let file = process.env.DATABASE_PATH ?? (isTest ? ':memory:' : 'db/app.sqlite')

  if (file !== ':memory:') {
    mkdirSync(path.dirname(path.resolve(file)), { recursive: true })
  }

  return new DatabaseSync(file)
}

function readSecret() {
  let secret = process.env.BETTER_AUTH_SECRET

  if (secret) return secret

  if (isProduction) {
    throw new Error('BETTER_AUTH_SECRET must be set in production')
  }

  return 'insecure-development-secret-change-me-before-deploying'
}
