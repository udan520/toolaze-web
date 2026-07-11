# Asset Provenance

Status: local_preview_only

## Current Sources

- Default reference and Hero preview retain their existing local source files.
- Women template placeholders use one consistent female model source.
- Men template placeholders use one consistent male model source.
- The current run does not contain sufficient production-grade generation provenance, source hashes, or final visual approval for the 22 template images.

## Template Paths

- Women: `public/ai-hairstyle-changer/templates/women/*.webp`
- Men: `public/ai-hairstyle-changer/templates/men/*.webp`
- Count: 11 Women templates and 11 Men templates

## Processing

- Template display format: square WebP
- Default reference: PNG source retained for generation
- Hero preview: 16:9 WebP
- No text, logos, or watermarks are baked into template images

## Intended Replacement Workflow

1. Generate one clean female base model and one clean male base model.
2. Generate each hairstyle while preserving the model, angle, expression, clothing, lighting, and background.
3. Replace the current files using the same paths.
4. Record generation source, prompt, model approval, dimensions, size, and checksum.
5. Add each approved template path as its preset `referenceImage` when two-reference generation is enabled.

## Gate

The current files are suitable only for local structure and interaction review. They do not prove the requested hairstyle differences and must not pass the final Visual Gate. The Hero preview also remains blocked because it is not an identity-preserving same-person transformation.
