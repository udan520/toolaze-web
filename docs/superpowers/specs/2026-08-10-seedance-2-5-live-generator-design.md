# Seedance 2.5 Live Generator Design

## Goal

Replace the Seedance 2.5 launch-update placeholder with the shared live video generator, backed by KIE model `bytedance/seedance-2-5`.

## Product Contract

- Text-to-video and multimodal reference-to-video use 4-30 second output, 480p/720p, Adaptive plus six fixed aspect ratios, MP4 output, and optional native audio.
- Multimodal mode accepts up to 30 images, 10 MP4/MOV videos, and 10 WAV/MP3 audio files. Reference video clips are 2-30 seconds each and at most 30 seconds total.
- First/last-frame mode is mutually exclusive with all multimodal references. The UI clears the conflicting resource set when the user switches modes.
- Pricing follows the KIE Seedance 2.5 table. Without reference video, 480p/720p cost 56/126 Toolaze credits per output second. With reference video, 480p/720p cost 34/76 credits per input-plus-output second.
- History stores every image, video, and audio public URL. Recreate restores the original model, mode, prompt, settings, native-audio choice, and all reference resources.

## Implementation Shape

- Extend the shared model config rather than introduce a second generator.
- Keep Kling Motion Control's required single-video workflow separate from optional Seedance multimodal references.
- Add generic reference video/audio collections and use the existing upload route to create stable R2 URLs.
- Add a dedicated backend input schema so older Seedance payloads are unchanged.
- Keep all validation on both client and server. Server validation is authoritative.

## Content Scope

Remove waitlist/upcoming language. Describe only KIE-exposed capabilities: 30 images, 10 videos, 10 audio clips, 4-30 seconds, 480p/720p, native audio, multimodal/first-last-frame exclusivity, and no 4K claim. Preserve existing public routes, navigation, Footer, Model Hub, and sitemap entries.

