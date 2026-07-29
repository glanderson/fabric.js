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

This is a browser/Node canvas **library** (published as `fabric`), not a hosted app. The
standard commands live in `## Common Commands` above and in `CONTRIBUTING.md`; prefer those.
The startup update script already runs `pnpm install`.

- Node: `.nvmrc` pins `24`, but the repo only requires `>=20` and everything (build, unit,
  e2e) works fine on the preinstalled Node 22. No version switch is needed.
- `canvas` (node-canvas) installs from a prebuilt binary via `pnpm install`; no system build
  toolchain is required and it works out of the box in Node.
- Unit tests (`pnpm run test:vitest`) print expected `Error: Could not load img ...` /
  `Width and height must be set` lines to stderr — these come from intentional malformed-SVG
  security test cases and do not indicate failure. The run is green if the summary shows all
  files passed.
- E2E (`pnpm run test:e2e`) uses Playwright Chromium and serves the repo root on port `8080`
  (`pnpm run local-server`), loading Fabric from the committed `dist/`. Two gotchas:
  - The Playwright Chromium browser + its system libs must be present. They are cached in the
    VM snapshot at `~/.cache/ms-playwright`. If ever missing, run
    `pnpm exec playwright install --with-deps chromium` once (needs sudo for the `--deps`).
  - The e2e `globalSetup` only rebuilds the e2e test files, NOT Fabric itself. To exercise
    your source changes you must run `pnpm run build` (or `build:fast`) first so `dist/` is
    up to date; otherwise e2e runs against the previously built/committed `dist/`.
- Manual browser prototyping: `pnpm start vanilla` (parcel dev app) is the documented path,
  but it relies on `npm link` + `open-cli` + VS Code and is fragile headlessly. For a quick
  manual check, serve the repo root (`pnpm run local-server`) and load Fabric from
  `dist/index.min.js` — that is the UMD build exposing the global `fabric`. `dist/index.js`
  is an ES module, so the plain `<script src=".../dist/index.js">` snippet in `README.md`
  will not create a global.
- Default object `originX`/`originY` is `center`; pass `originX: 'left', originY: 'top'` when
  you want to position by the top-left corner.
- `pnpm run lint` runs eslint with `--fix`; it may rewrite files. It currently reports only
  warnings (0 errors). `pnpm run build` regenerates tracked files under `dist/` — do not
  commit those incidental rebuild diffs unless the build output is the intended change.
