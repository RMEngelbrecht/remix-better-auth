// Loads and validates env vars against `.env.schema` (plus `.env`, `.env.local`)
// before anything else reads them. Import `ENV` from here for typed access.
import 'varlock/auto-load'

export { ENV } from 'varlock/env'
