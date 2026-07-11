# Final Decision

Status: production_rolled_back_after_global_regression

## Decision

The AI Hairstyle Changer production launch remains rolled back and is not approved for a new production promotion yet.

The project owner approved creating an isolated candidate. The isolated candidate now exists, passes local tests, and has a Ready `toolaze-web` Git Preview. It is ready for human visual review, but not for production promotion until the project owner explicitly approves the Preview.

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

## Ready Preview Evidence

- Blocked Preview root cause: invalid Git author email `neva@nevadeMacBook-Air.local`.
- Fixed candidate commit: `cfae9946340019847dbe28a33439cdb7df2d7dbd`
- Commit author and committer: `udan520 <udan981202@gmail.com>`
- Ready Preview URL: `https://toolaze-web-git-codex-ai-hair-145c11-dianawu1202-7870s-projects.vercel.app/ai-hairstyle-changer`
- Vercel deployment URL: `https://toolaze-nxq0phhla-dianawu1202-7870s-projects.vercel.app`
- Vercel status: `READY`
- English Preview verification: title, H1, prompt module, Use Prompt, Copy Prompt, identity-preserving prompt text, hero asset, women short-bob asset, and men buzz-cut asset are present.
- Production aliases still remain on rollback target `toolaze-29vmtct8d-dianawu1202-7870s-projects.vercel.app`.
