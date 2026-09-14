#!/usr/bin/env python3
"""
Palestras 360 — Pipeline de logos de prova social.

Entrada : assets/img/prova-social/_raw/*.png
Saida   : assets/img/prova-social/<mesmo-nome>.png  (160px de altura, fundo branco)
          assets/img/prova-social/<mesmo-nome>.webp

Uso: python scripts/process-logos.py
"""
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

from PIL import Image

ROOT    = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "assets" / "img" / "prova-social" / "_raw"
OUT_DIR = ROOT / "assets" / "img" / "prova-social"
TARGET_H = 160
QUALITY  = 85


def trim_transparent(img: Image.Image) -> Image.Image:
    if img.mode == "RGBA":
        bbox = img.split()[3].getbbox()
        if bbox:
            img = img.crop(bbox)
    return img


def on_white(img: Image.Image, size: tuple) -> Image.Image:
    bg = Image.new("RGBA", size, (255, 255, 255, 255))
    x = (size[0] - img.width) // 2
    y = (size[1] - img.height) // 2
    if img.mode == "RGBA":
        bg.paste(img, (x, y), img)
    else:
        bg.paste(img, (x, y))
    return bg.convert("RGB")


def process(src: Path) -> None:
    with Image.open(src) as img:
        img = img.convert("RGBA")
        img = trim_transparent(img)
        ratio = TARGET_H / img.height
        new_w = max(1, int(img.width * ratio))
        img = img.resize((new_w, TARGET_H), Image.LANCZOS)
        canvas_w = max(new_w + 40, int(TARGET_H * 4))
        final = on_white(img, (canvas_w, TARGET_H))
        stem = src.stem
        final.save(OUT_DIR / f"{stem}.png",  format="PNG",  optimize=True)
        final.save(OUT_DIR / f"{stem}.webp", format="WEBP", quality=QUALITY)


def main() -> int:
    if not RAW_DIR.exists():
        print(f"ERRO: {RAW_DIR} nao encontrado")
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(RAW_DIR.glob("*.png"))
    print(f"Processando {len(files)} logos...\n")
    for f in files:
        process(f)
        print(f"  [ok] {f.name}")
    print(f"\n-> {len(files)} logos em {OUT_DIR.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
