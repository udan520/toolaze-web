# Publish Readiness

Status: production_rolled_back_after_global_regression

## Human Approval

- Approved at: 2026-07-11 10:45:20 CST
- Approved by: Project owner
- Scope: Final assets, PM Visual Review, and production publishing.
- Decision: Approved for launch. Earlier visual blockers are accepted by the project owner for this release.

## Passed

- Keyword, competitor, capability, content, functional acceptance, and localization artifacts exist.
- Page implementation and all supported locale files exist.
- Core tests and AI tool entry-point checks pass.
- Sitemap entries are implemented.

## Previously Blocked

- Final Women and Men hairstyle template images are not available.
- Final identity-preserving hairstyle transformation asset is not available.
- PM Visual Review is blocked.
- Human approval is not recorded.
- Vercel production deployment has not been requested or performed.
- Google Search Console submission has not been requested or performed.

## Decision

Production has been rolled back after project owner reported global breakage from the release. Treat the AI Hairstyle Changer launch as not published. Do not submit GSC or announce the release until the page is rebuilt, isolated from unrelated workspace changes, and reviewed with full-site smoke checks.

## Production Verification

- Checked at: 2026-07-11 10:50:00 CST
- Production URL: `https://toolaze.com/ai-hairstyle-changer`
- Locale routes checked: `en`, `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt`, `zh-TW`
- Result: All checked production routes returned HTTP 200 with expected page titles/content hits.
- Vercel CLI status: latest production deployments remain `UNKNOWN`.
- Follow-up: Recheck Vercel deployment status before GSC submission or release announcement.

## Rollback Verification

- Rechecked at: 2026-07-11 14:09 CST
- Production before rollback: `https://toolaze-1lrb6i3af-dianawu1202-7870s-projects.vercel.app`
- Rollback target: `https://toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`
- Final Vercel status: `Ready`
- Confirmed aliases: `https://toolaze.com`, `https://www.toolaze.com`, and `https://toolaze-web.vercel.app`
- Smoke check result: core routes and sitemap sample returned 200 after rollback.
- Release status: rollback complete; AI Hairstyle Changer remains blocked from GSC and release announcement.

## Isolated Candidate Status

- Isolated worktree candidate exists and local tests pass 8/8.
- Local Vercel prebuild output exists at `.vercel/output`.
- Real `toolaze-web` Preview deployment URL `https://toolaze-1rvcszbfv-dianawu1202-7870s-projects.vercel.app` remains `UNKNOWN`.
- Current release state: blocked before human visual review because there is no Ready Preview URL.
- Production remains rolled back to `toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`.

## Ready Preview Status

- Ready Preview URL: `https://toolaze-web-git-codex-ai-hair-145c11-dianawu1202-7870s-projects.vercel.app/ai-hairstyle-changer`
- Vercel deployment URL: `https://toolaze-nxq0phhla-dianawu1202-7870s-projects.vercel.app`
- Vercel project: `toolaze-web`
- Vercel target: `preview`
- Vercel status: `READY`
- Commit: `cfae9946340019847dbe28a33439cdb7df2d7dbd`
- Commit author: `udan520 <udan981202@gmail.com>`
- Verification: English route contains the prompt module, Use Prompt, Copy Prompt, identity-preserving prompt text, hero asset, women short-bob asset, and men buzz-cut asset.
- Current release state: ready for project owner visual review only.
- Production remains rolled back to `toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`; no production promotion has been performed.
