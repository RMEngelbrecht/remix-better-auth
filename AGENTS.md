# Remix Test Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
```

Use `npm run hmr` for live server and browser updates; `npm run dev` only watches and restarts the server. `npm run start` runs in production mode without a separate build step.

## Version Control

This repo uses [jj (Jujutsu)](https://jj-vcs.github.io/jj/), colocated with git. Use jj, not git, for version control:

- Inspect with `jj st`, `jj diff`, and `jj log`.
- jj snapshots the working copy automatically. To commit, run `jj describe -m "message"`, then `jj new` to start the next change.
- Use bookmarks instead of branches: `jj bookmark set <name> -r @`, then `jj git push --bookmark <name>`.
- For isolated parallel work, use `jj workspace add <path>` rather than `git worktree`, and clean up with `jj workspace forget`.
- Don't run git commands that change the repo (`commit`, `checkout`, `branch`, `rebase`, `stash`). Read-only git commands are fine.
- On Windows with git's `core.autocrlf=true`, run `jj config set --repo working-copy.eol-conversion input-output`. Otherwise jj reports every file as modified because of line endings.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs the standard Remix component renderer used by actions
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router smoke test
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI
- `app/actions/public/` contains the browser runtime entry and interactive prompt button
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `app/ui/`, and `test/` only when you need them.
