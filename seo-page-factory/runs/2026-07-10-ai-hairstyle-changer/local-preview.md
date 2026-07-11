# Local Preview

Status: implemented

## Route

- English: `/ai-hairstyle-changer`
- Localized: `/{locale}/ai-hairstyle-changer`

## Review Scope

The implemented route is the local content and layout preview. It includes the functional top tool, complete English content, nine locale files, 22 local hairstyle template placeholders, and all required page modules.

## Browser Acceptance

- Women: 11 visible hairstyle templates and no visible Prompt input.
- Men: 11 visible hairstyle templates, including Buzz Cut, Crew Cut, and Bald, with no visible Prompt input.
- Custom: no hairstyle template cards and one localized hairstyle description input.
- The page no longer renders the Prompt Examples module.
- Verified route: `http://localhost:3027/zh-TW/ai-hairstyle-changer`.

## Visual Limitation

The 22 template files are placeholders for structure review. The current 16:9 top preview uses two different portrait references and must not be treated as a same-person generated before/after result. Production publishing remains blocked until final hairstyle templates and an identity-preserving transformation demo are approved.
