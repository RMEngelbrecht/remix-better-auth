// Creates or updates the better-auth tables in the configured database.
// Run as a deploy step in production: `npm run db:migrate`.
import { migrate } from '../app/data/auth.ts'

await migrate()
console.log('better-auth migrations are up to date')
