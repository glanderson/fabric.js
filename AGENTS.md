# AGENTS.md instructions for /Users/andreabogazzi/develop/fabric.js

This file defines how coding agents should operate in this repository.

## Project

- Repository: `fabricjs/fabric.js`
- Language: TypeScript/JavaScript
- Package manager: `npm`
- Runtime: Node `>=20`
- Main test stacks: `vitest` (unit) and `playwright` (e2e)

## Repository Priorities

- Keep changes focused and minimal.
- Preserve existing architecture and naming style.
- Avoid broad refactors unless explicitly requested.
- Prefer fixing root causes over adding workarounds.

## Setup

Run from repo root:

```bash
pnpm install
```

## Common Commands

- Build: `pnpm run build`
- Fast build: `pnpm run build:fast`
- Typecheck: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Format check: `pnpm run prettier:check`
- Format write: `pnpm run prettier:write`
- Unit tests (node): `pnpm run test:vitest`
- Unit tests with coverage: `pnpm run test:vitest:coverage`
- E2E tests: `pnpm run test:e2e`
- E2E typecheck: `pnpm run playwright:typecheck`

## Testing Expectations

- Add or update tests for behavior changes.
- Prefer targeted test runs while iterating, then run relevant full suites before finalizing.

## Code Style

- Follow existing project style and patterns.
- Keep imports stable; do not reorder unless necessary.
- Use concise comments only when code is not obvious.
- Avoid unrelated formatting-only diffs in touched files.

## PR and Changelog Workflow

- Use clear, short PR titles.
- Prefer conventional-commit style in titles when possible:
  - `feat`, `fix`, `docs`, `ci`, `test`, `refactor`, `chore`
- Add `close #<issue-num>` in PR body only when an issue number exists; if the user states there is no issue, omit it.
- Ensure `CHANGELOG.md` (`## [next]`) is updated for notable changes.
- Keep changelog entry style consistent with existing lines.

## In-Repo Skills

Agents should check and use repository skills when tasks match.

Available skill:

- `fabricjs-open-pr`
  - Path: `.codex/skills/fabricjs-open-pr/SKILL.md`
  - Use when opening PRs for this repository.
  - Handles PR title/body quality, optional `close #<issue-num>`, changelog entry, and predicted PR number flow.

## Skill Trigger Guidance

Use the `fabricjs-open-pr` skill when any of these apply:

- User asks to open/create a PR.
- User asks to prepare PR metadata (title/body/changelog).
- User asks to include issue-closing syntax like `close #123`.

## Git Safety

- Never discard user changes unless explicitly asked.
- Do not use destructive git commands without explicit instruction.
- Commit only files relevant to the requested task.

## Communication

- Be concise and factual.
- Surface assumptions and blockers early.
- When something cannot be verified locally, state that clearly.

## Cursor Cloud specific instructions

Durable, non-obvious notes for cloud agents. The startup update script already runs `pnpm install --frozen-lockfile`; standard commands live in "Common Commands" above.

- Package manager is **pnpm** (`pnpm@10.29.1`, already on PATH), not npm — ignore the stale "Package manager: npm" line above. Node 22 is used here and satisfies `engines.node >=20` (`.nvmrc` pins 24, but 22 works for build/test/lint).
- Unit tests (`pnpm run test:vitest`) print jsdom "Could not load img" / "Width and height must be set" errors — these are expected error-path assertions, not failures. Watch the final `Tests ... passed` summary.
- E2E (`pnpm run test:e2e`) needs the Playwright **Chromium** browser plus its system libs, which are provisioned in the VM snapshot (not by the update script). If missing after a cache reset, reinstall with `pnpm --dir packages/e2e exec playwright install chromium` and `sudo env "PATH=$PATH" npx --prefix packages/e2e playwright install-deps chromium` (plain `sudo pnpm ...` fails — pnpm is not on the root PATH). Run a subset with `pnpm --dir packages/e2e run test <path-substring>` (e.g. `controls/rendering`). E2E auto-starts the static server on :8080.
- Running the dev app (interactive canvas sandbox): the documented `pnpm start vanilla` uses global `npm link` + `open-cli` + `code .`, which is flaky headlessly. Instead: `pnpm run build:fast`, then from `.codesandbox/templates/vanilla` run `npm install` (the `fabric` dep is a `file:` symlink to the repo root, so rebuild the repo to pick up changes) and `npx parcel index.html --port 1234`. The default cropping-controls testcase loads images from `https://fabricjs.com` (needs network egress).
