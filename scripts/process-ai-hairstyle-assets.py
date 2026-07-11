#!/usr/bin/env python3

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


WHITE = (250, 250, 250)
RESAMPLE = Image.Resampling.LANCZOS


def open_rgb(path: str) -> Image.Image:
    image = Image.open(path)
    image = ImageOps.exif_transpose(image)
    if image.mode == "RGBA":
        canvas = Image.new("RGB", image.size, WHITE)
        canvas.paste(image, mask=image.getchannel("A"))
        return canvas
    return image.convert("RGB")


def contain_on_canvas(image: Image.Image, size: tuple[int, int], padding: int = 0) -> Image.Image:
    width, height = size
    inner_size = (max(1, width - padding * 2), max(1, height - padding * 2))
    fitted = ImageOps.contain(image, inner_size, method=RESAMPLE)
    canvas = Image.new("RGB", size, WHITE)
    x = (width - fitted.width) // 2
    y = (height - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def save_preview(source: str, output: str) -> None:
    image = open_rgb(source)
    image.thumbnail((960, 960), RESAMPLE)
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "WEBP", quality=82, method=6)


def save_template(source: str, output: str) -> None:
    image = open_rgb(source)
    canvas = contain_on_canvas(image, (640, 640), padding=10)
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, "WEBP", quality=84, method=6)


def load_font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def draw_label(draw: ImageDraw.ImageDraw, text: str, x: int, y: int) -> None:
    font = load_font(28)
    box = draw.textbbox((x, y), text, font=font)
    padding_x = 14
    padding_y = 9
    background = (
        box[0] - padding_x,
        box[1] - padding_y,
        box[2] + padding_x,
        box[3] + padding_y,
    )
    draw.rounded_rectangle(background, radius=12, fill=(255, 255, 255), outline=(225, 228, 235))
    draw.text((x, y), text, font=font, fill=(31, 41, 55))


def save_hero(reference: str, result: str, png_output: str, webp_output: str) -> None:
    canvas = Image.new("RGB", (1600, 900), WHITE)
    left = contain_on_canvas(open_rgb(reference), (800, 900), padding=24)
    right = contain_on_canvas(open_rgb(result), (800, 900), padding=24)
    canvas.paste(left, (0, 0))
    canvas.paste(right, (800, 0))

    draw = ImageDraw.Draw(canvas)
    draw.line((799, 24, 799, 876), fill=(214, 219, 230), width=2)
    draw_label(draw, "Before", 48, 48)
    draw_label(draw, "After", 848, 48)

    Path(png_output).parent.mkdir(parents=True, exist_ok=True)
    Path(webp_output).parent.mkdir(parents=True, exist_ok=True)
    canvas.save(png_output, "PNG", optimize=True)
    canvas.save(webp_output, "WEBP", quality=86, method=6)


def main() -> None:
    if len(sys.argv) < 4:
        raise SystemExit(
            "Usage: process-ai-hairstyle-assets.py "
            "preview <source> <output> | "
            "template <source> <output> | "
            "hero <reference> <result> <png-output> <webp-output>"
        )

    mode = sys.argv[1]
    if mode == "preview" and len(sys.argv) == 4:
        save_preview(sys.argv[2], sys.argv[3])
        return
    if mode == "template" and len(sys.argv) == 4:
        save_template(sys.argv[2], sys.argv[3])
        return
    if mode == "hero" and len(sys.argv) == 6:
        save_hero(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
        return
    raise SystemExit(f"Unsupported arguments for mode: {mode}")


if __name__ == "__main__":
    main()
