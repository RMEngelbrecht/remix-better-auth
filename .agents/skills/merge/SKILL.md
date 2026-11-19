---
name: merge
description: >-
  Merges the current change in the remix-better-auth project into main on
  origin (GitHub RMEngelbrecht/remix-better-auth) and fast-forwards main on the
  local remote. Only invoke when the user has explicitly requested merging or
  landing the change; do not invoke for review, preparation, running checks,
  or skill installation.
disable-model-invocation: true
metadata:
  delta-action: land
---

# Merge into main

This skill applies only to the `remix-better-auth` project (remotes `origin` =
`https://github.com/RMEngelbrecht/remix-better-auth.git`, `local` = the user's
`remix-test` checkout). If the current repository is not this project, stop and
say so.

Invoking this skill (including via `/merge`) **is** the explicit merge request.
Do not reply that you are waiting for permission to merge, and do not ask again
whether to merge. Stop only for genuine blockers or unclear scope, described below.

Success means the change is on `origin/main` and `local/main`, verified by SHA.
Committing the change, pushing a branch, or starting checks alone does not count.
If you cannot finish, report clearly that the changes have **not** been merged
and explain the blocker.

## Facts about this repo

- No CI, no PR template, and no contribution policy exist (`.github/` is absent).
  `gh` is not installed. Merging is a direct fast-forward push to `main`.
- The repo is colocated with jj (`.jj/`). The git HEAD is usually detached at the
  jj parent. `core.autocrlf=true` and jj's `working-copy.eol-conversion` is
  `none`, so `jj` reports many files as modified only because of CRLF line
  endings. **Use plain `git` for staging, committing, rebasing and pushing.** Do
  not use `jj commit`, `jj describe`, `jj squash` or `jj git push` here.
- Node is not on PATH by default. It is provided by fnm (default v26.3.1,
  satisfying `engines.node >=24.3.0` in `package.json`). Package manager: pnpm
  (`pnpm-lock.yaml`).
- Ignored paths (`.gitignore`): `node_modules/`, `db/*.sqlite`, `tmp/`.
- There is no commit-message convention. Use a short imperative subject line plus
  a body when useful.

## Workflow

Run commands from the worktree root in Git Bash (or PowerShell where noted). All
commands are non-interactive. Never use `-i` flags, editors, `--force`, or
`--no-verify`.

### 1. Preflight

```sh
git remote -v                      # expect origin (GitHub) and local
git config user.name && git config user.email   # stop if either is unset
git fetch origin
git fetch local
git status --short
git log --oneline origin/main..HEAD
```

- Determine the change to merge: commits on top of `origin/main` plus any
  uncommitted work in the worktree that belongs to the requested change.
- If the scope is unclear, stop and ask. Examples: unrelated edits, stray files,
  secrets or `.env`-style files, databases.
- If `origin/main` and `local/main` have diverged from each other, stop and
  report. Do not pick one over the other.

### 2. Commit uncommitted work

If HEAD is detached, create a working branch first:
`git switch -c merge/<short-topic>`.

Stage explicit paths only (`git add <path> ...`). Never use `git add -A` blindly,
and never stage ignored files. Check with `git diff --cached --stat`, then commit:

```sh
git commit -m "<imperative subject>" -m "<optional body>"
```

### 3. Rebase onto the latest main

```sh
git fetch origin
git rebase origin/main
```

Conflict preference: **resolve automatically when the intended result is
clear.**
- Resolve the conflicted files, `git add` them, then
  `GIT_EDITOR=true git rebase --continue`.
- Preserve unrelated work from both sides.
- If the intent is ambiguous or a resolution would drop someone's changes, run
  `git rebase --abort`. Then stop and report the conflict, saying that nothing
  was merged.

### 4. Required checks (on the exact commit to be pushed)

There is no remote CI. These local checks are the required gate, and they must
pass on the rebased HEAD. Re-run them whenever HEAD changes, for example after
any later rebase.

```sh
fnm exec --using=default pnpm install --frozen-lockfile   # only if node_modules is missing or the lockfile changed
fnm exec --using=default pnpm run typecheck               # package.json "typecheck": tsc --noEmit
NODE_ENV=test fnm exec --using=default pnpm exec remix test   # package.json "test": NODE_ENV=test remix test
```

- Run the test command from Git Bash. `pnpm run test` fails on Windows because
  the script's POSIX `NODE_ENV=` prefix runs under cmd.exe. The command above is
  the equivalent invocation.
- If a check fails, is pending, or cannot run, do **not** push. You may fix a
  failure only when the fix is clearly part of the requested change, then
  re-run all checks. Otherwise stop and report.
- Confirm the working tree is clean afterwards (`git status --short`), apart
  from ignored files.

### 5. Push (fast-forward only)

```sh
git merge-base --is-ancestor origin/main HEAD   # must succeed
git push origin HEAD:refs/heads/main
```

- If the push is rejected because `main` moved, return to step 3 (fetch, rebase,
  re-run all checks) and try again.
- Never force-push.
- If authentication fails, stop and report. Git Credential Manager is the
  configured helper.

Then update the user's local checkout to match:

```sh
git fetch local
git merge-base --is-ancestor local/main HEAD && git push local HEAD:refs/heads/main
```

If `local/main` is not an ancestor, do not force it. Report that `origin/main`
was merged but `local/main` needs attention.

### 6. Verify

```sh
git rev-parse HEAD
git ls-remote origin refs/heads/main
git ls-remote local refs/heads/main
```

All three SHAs must match. Report the merged commit SHA and subject. If you
created a temporary `merge/*` branch, delete it with `git branch -d` once it has
merged.
