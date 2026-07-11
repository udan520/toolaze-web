# Final Decision

Status: production_rolled_back_after_global_regression

## Decision

The AI Hairstyle Changer production launch remains rolled back and is not approved for a new production promotion yet.

The project owner approved creating an isolated candidate. The isolated candidate now exists and passes local tests/build checks, but the real `toolaze-web` Vercel Preview is still `UNKNOWN`, so it is not ready for human visual approval or production.

## Next Required Action

The production launch has been rolled back after global site breakage was reported. Block GSC and release announcement. The next required action is to rebuild the launch from an isolated clean state and run full-site smoke checks before asking for a new production approval.

## Rollback Evidence

- Rollback executed at: 2026-07-11 14:09 CST
- Production before rollback: `https://toolaze-1lrb6i3af-dianawu1202-7870s-projects.vercel.app`
- Rollback target: `https://toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`
- Vercel status after rollback: `Ready`
- Production smoke checks passed for homepage, AI image generator, AI tools hub, model index, World Cup generator, AI Hairstyle Changer rolled-back page, image compressor, image converter, photo restoration, and sampled sitemap URLs.

## Preview Blocker Evidence

- Candidate Preview URL: `https://toolaze-1rvcszbfv-dianawu1202-7870s-projects.vercel.app`
- Vercel project: `toolaze-web`
- Vercel target: `preview`
- Vercel status: `UNKNOWN`
- Local test evidence: 8/8 AI Hairstyle Changer landing tests passed.
- Production aliases remain on rollback target `toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`.

