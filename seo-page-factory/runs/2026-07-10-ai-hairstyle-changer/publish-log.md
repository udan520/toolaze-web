# Publish Log

Status: production_rolled_back_after_global_regression

## Approval

- Approved at: 2026-07-11 10:45:20 CST
- Approved by: Project owner
- Scope: Final assets, PM Visual Review, and production publishing.
- Decision: Approved for launch.

## Deployment Monitoring

- Production URL verified: `https://toolaze.com/ai-hairstyle-changer`
- Existing production deployment observed: `https://toolaze-8a3ezoknh-dianawu1202-7870s-projects.vercel.app`
- Previous production deployment observed: `https://toolaze-7kaucdsyn-dianawu1202-7870s-projects.vercel.app`
- Current Vercel list status at approval check: `UNKNOWN`
- Action: Do not start a duplicate production deployment while the latest production deployment status remains `UNKNOWN`.

## Verification Results

- `https://toolaze.com/ai-hairstyle-changer` returned HTTP 200 with title `Free AI Hairstyle Changer Online | No Signup | Toolaze`.
- Locale URLs returned HTTP 200 for `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt`, and `zh-TW`.
- The latest checked deployment URLs `toolaze-5zm13is0j`, `toolaze-8a3ezoknh`, and `toolaze-7kaucdsyn` still report Vercel CLI status `UNKNOWN`.
- A production deploy process was still observed locally during verification: `npm exec vercel deploy --prod --yes --scope team_400zWozDS6T2zCl3jq5Wimau`.

## Production Mismatch

- Reported by project owner: production page does not use the approved model images, examples differ from the approved version, and the SEO page is missing the prompt section.
- Confirmed by HTML comparison: local dev contains `Hairstyle Templates and Prompts`, while production does not.
- Local dev evidence: `Hairstyle Templates and Prompts` appears 2 times and the identity-preserving prompt text appears 56 times.
- Production evidence: `Hairstyle Templates and Prompts` appears 0 times and the identity-preserving prompt text appears 23 times.
- Current interpretation: production is live but is not the approved build; do not treat this release as complete.

## Pending Follow-up

- Do not submit GSC for `ai-hairstyle-changer`.
- Do not publish another production deployment from the current dirty workspace.
- Rebuild the page in an isolated clean publish path before any future launch attempt.

## Emergency Rollback

- Rollback requested by: Project owner
- Rollback reason: project owner reported the production release caused global site breakage and the Vercel dashboard undo action did not restore the expected state.
- Rollback executed at: 2026-07-11 14:09 CST
- Production before rollback: `https://toolaze-1lrb6i3af-dianawu1202-7870s-projects.vercel.app`
- Rollback target: `https://toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`
- Vercel result: rollback target promoted successfully; `toolaze.com`, `www.toolaze.com`, and `toolaze-web.vercel.app` now alias to `toolaze-29vmtct8d`.

## Rollback Smoke Check

- `/` returned 200 with title `Toolaze - Free AI Image Generator & AI Video Generator Online`.
- `/ai-image-generator` returned 200.
- `/ai-tools` returned 200.
- `/model` returned 200.
- `/world-cup-ai-image-generator` returned 200.
- `/ai-hairstyle-changer` returned 200, but this is the rolled-back pre-launch version and does not include the approved prompt section.
- `/image-compressor`, `/image-converter`, `/photo-restoration`, `/model/gpt-image-2`, `/model/seedream-4-5`, and `/model/wan-2-7-image` returned 200.
- `/sitemap.xml` returned 200 with 1302 URLs; the sampled homepage, localized homepages, about pages, and privacy pages returned 200.
- `/pricing` and `/ai-headshot-generator` were not present as route files in the current workspace, so their 404 responses are not sufficient evidence by themselves that the rollback target is broken.

## Current Release Decision

- The AI Hairstyle Changer production launch is rolled back and no longer considered live-complete.
- The previous `HTTP 200` and content-only checks were insufficient because the release affected broader site behavior.
- Next publish attempt must validate the whole production surface affected by the deployment, not only the target landing page.

## Isolated Candidate Attempt

- Candidate worktree: `/Users/neva/Desktop/workspace/toolaze-web/.worktrees/ai-hairstyle-changer-isolated-candidate`
- Candidate branch: `codex/ai-hairstyle-changer-isolated-candidate`
- Scope: isolated AI Hairstyle Changer route, locale JSON, local visual assets, page tests, and minimum shared page-rendering changes only.
- Local verification: `node --import tsx --test src/lib/ai-hairstyle-changer-landing.test.ts` passed 8/8.
- Local build verification: Vercel prebuilt output generated successfully at `.vercel/output` with 518 static pages and 245M output size.
- Preview attempt: `https://toolaze-1rvcszbfv-dianawu1202-7870s-projects.vercel.app` under Vercel project `toolaze-web`, target `preview`.
- Preview status: `UNKNOWN`; do not use this URL for human approval or production promotion.
- Vercel upload note: normal prebuilt upload hit `api-upload-free`; retry with `--archive=tgz` uploaded successfully but deployment remained `UNKNOWN`.
- Production safety check: `toolaze.com`, `www.toolaze.com`, and `toolaze-web.vercel.app` still alias to rollback target `toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`.

## Current Blocker

- The isolated candidate is locally valid but does not have a Ready Vercel Preview on the real `toolaze-web` project.
- Do not promote, submit GSC, or announce until a Ready Preview is available and manually reviewed.

