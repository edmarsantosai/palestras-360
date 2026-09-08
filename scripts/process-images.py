#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Palestras 360 — Pipeline de imagens.

ETAPA 2 — Heros:
  1. Lê originais em assets/img/_hero-staging/ (nomes: palestra-<slug>-*-src.ext ou home-hero-src.ext).
  2. Crop central 16:9 + grade cinematográfico sutil.
  3. Redimensiona para 1920 / 1280 / 768 px.
  4. Exporta AVIF + WebP + JPG em assets/img/hero/ (flat).
  5. Thumbnails 4:3 (640/480/320) em assets/img/thumb/ (flat).
  6. Escreve assets/data/images.json com alt vindo de palestras.json.

ETAPA 3 — Galerias de fotos reais:
  1. Lê assets/data/galerias-fotos-reais.json (src = nome em "Fotos reais/").
  2. Crop 16:9 + grading, larguras 1280/768.
  3. Salva em assets/img/galeria/<slug>-01-1280w.avif, -01-768w.avif, etc.

Uso: python scripts/process-images.py
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageEnhance

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    import pillow_avif  # noqa: F401
    AVIF_OK = True
except Exception:
    AVIF_OK = False

# ── Caminhos ──────────────────────────────────────────────────────────────────
ROOT          = Path(__file__).resolve().parent.parent
STAGING_DIR   = ROOT / "assets" / "img" / "_hero-staging"
HERO_OUT      = ROOT / "assets" / "img" / "hero"
THUMB_OUT     = ROOT / "assets" / "img" / "thumb"
GALERIA_OUT   = ROOT / "assets" / "img" / "galeria"
FOTOS_DIR     = ROOT / "Fotos reais"
DATA_DIR      = ROOT / "assets" / "data"
PALESTRAS_JSON = DATA_DIR / "palestras.json"
IMAGES_JSON    = DATA_DIR / "images.json"
GALERIAS_JSON  = DATA_DIR / "galerias-fotos-reais.json"

# ── Config ────────────────────────────────────────────────────────────────────
HERO_WIDTHS  = [1920, 1280, 768]
THUMB_WIDTHS = [640, 480, 320]
GAL_WIDTHS   = [1280, 768]
QUALITY      = 80

# ── Helpers ───────────────────────────────────────────────────────────────────

def kb(path: Path) -> float:
    return path.stat().st_size / 1024.0


def crop_16x9(im: Image.Image) -> Image.Image:
    w, h = im.size
    t = 16 / 9
    c = w / h
    if c > t:
        nw = int(round(h * t)); left = (w - nw) // 2; box = (left, 0, left + nw, h)
    else:
        nh = int(round(w / t)); top = (h - nh) // 2; box = (0, top, w, top + nh)
    return im.crop(box)


def crop_4x3(im: Image.Image) -> Image.Image:
    w, h = im.size
    t = 4 / 3
    c = w / h
    if c > t:
        nw = int(round(h * t)); left = (w - nw) // 2; box = (left, 0, left + nw, h)
    else:
        nh = int(round(w / t)); top = (h - nh) // 2; box = (0, top, w, top + nh)
    return im.crop(box)


def grade(im: Image.Image) -> Image.Image:
    """Grade cinematográfico sutil: contraste suave, tom frio navy/ciano."""
    im = im.convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(0.96)
    im = ImageEnhance.Brightness(im).enhance(1.01)
    im = ImageEnhance.Color(im).enhance(0.93)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 0.985)))
    g = g.point(lambda v: min(255, int(v * 0.997)))
    b = b.point(lambda v: min(255, int(v * 1.012 + 2)))
    return Image.merge("RGB", (r, g, b))


def export(im: Image.Image, out_base: Path) -> list:
    """Salva AVIF (se disponível) + WebP + JPG. Retorna formatos gerados."""
    fmts = []
    if AVIF_OK:
        try:
            im.save(out_base.with_suffix(".avif"), format="AVIF", quality=QUALITY)
            fmts.append("avif")
        except Exception as e:
            print(f"    [aviso] AVIF falhou ({e}); usando WebP+JPG.")
    im.save(out_base.with_suffix(".webp"), format="WEBP", quality=QUALITY, method=6)
    fmts.append("webp")
    im.save(out_base.with_suffix(".jpg"), format="JPEG", quality=QUALITY, optimize=True, progressive=True)
    fmts.append("jpg")
    return fmts


def load_palestras() -> tuple:
    """Retorna (hero_to_slug, slug_to_alt, slug_to_h1, all_slugs)."""
    import re as _re
    data = json.loads(PALESTRAS_JSON.read_text(encoding="utf-8"))
    hero_to_slug = {}
    slug_to_alt  = {}
    slug_to_h1   = {}
    all_slugs    = set()
    for p in data.get("palestras", []):
        all_slugs.add(p["slug"])
        img = p.get("imagens") or {}
        if "hero" in img:
            hero_to_slug[img["hero"]] = p["slug"]
        if "hero_alt" in img:
            slug_to_alt[p["slug"]] = img["hero_alt"]
        if "h1" in p:
            slug_to_h1[p["slug"]] = p["h1"]
    return hero_to_slug, slug_to_alt, slug_to_h1, all_slugs


def slug_from_final_name(final_name: str, all_slugs: set) -> str | None:
    """Extrai slug de 'palestra-<slug>-empresas-hero' ou 'palestra-<slug>-trabalho-hero'."""
    import re as _re
    s = _re.sub(r'^palestra-', '', final_name)
    s = _re.sub(r'-(?:empresas|trabalho)-hero$', '', s)
    s = _re.sub(r'-hero$', '', s)
    return s if s in all_slugs else None


# ── ETAPA 2: heros ────────────────────────────────────────────────────────────

def process_heroes() -> dict:
    if not STAGING_DIR.exists():
        print(f"[aviso] Staging não encontrado: {STAGING_DIR} — pulando heros.")
        return {}

    HERO_OUT.mkdir(parents=True, exist_ok=True)
    THUMB_OUT.mkdir(parents=True, exist_ok=True)

    if not AVIF_OK:
        print("[aviso] pillow-avif-plugin indisponível — gerando apenas WebP + JPG.\n")

    hero_to_slug, slug_to_alt, slug_to_h1, all_slugs = load_palestras()
    images_manifest = {}

    for f in sorted(STAGING_DIR.iterdir()):
        if not f.is_file() or f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".avif"}:
            continue

        stem = f.stem
        if not stem.endswith("-src"):
            print(f"[pulado] sem sufixo -src: {f.name}")
            continue

        final_name = stem[:-4]  # ex: "palestra-setembro-amarelo-empresas-hero"
        is_home = (final_name == "home-hero")

        if is_home:
            slug = "home"
            alt  = "Central de palestras corporativas presenciais e online para empresas de todo o Brasil"
        else:
            slug = hero_to_slug.get(final_name) or slug_from_final_name(final_name, all_slugs)
            if not slug:
                print(f"[pulado] slug nao encontrado para: {final_name}")
                continue
            alt = slug_to_alt.get(slug, "") or slug_to_h1.get(slug, "")
            if not alt:
                print(f"[aviso] sem alt para slug '{slug}'")

        with Image.open(f) as original:
            cropped = crop_16x9(original)
            graded  = grade(cropped)

            hero_fmts = []
            for w in HERO_WIDTHS:
                h   = int(round(w * 9 / 16))
                out = HERO_OUT / f"{final_name}-{w}w"
                hero_fmts = export(graded.resize((w, h), Image.LANCZOS), out)

            if is_home:
                images_manifest["home"] = {
                    "hero_base": final_name,
                    "larguras":  HERO_WIDTHS,
                    "formatos":  hero_fmts,
                    "alt":       alt,
                }
                print(f"[ok] home hero: {len(HERO_WIDTHS)}w × {len(hero_fmts)} formatos")
                continue

            thumb_name    = f"{final_name}-thumb"
            thumb_cropped = crop_4x3(graded)
            thumb_fmts    = []
            for tw in THUMB_WIDTHS:
                th_h = int(round(tw * 3 / 4))
                out  = THUMB_OUT / f"{thumb_name}-{tw}w"
                thumb_fmts = export(thumb_cropped.resize((tw, th_h), Image.LANCZOS), out)

            images_manifest[slug] = {
                "hero_base": final_name,
                "larguras":  HERO_WIDTHS,
                "formatos":  hero_fmts,
                "alt":       alt,
                "thumb": {
                    "base":     thumb_name,
                    "larguras": THUMB_WIDTHS,
                    "formatos": thumb_fmts,
                },
            }
            print(f"[ok] {slug}: {len(HERO_WIDTHS)}w × {len(hero_fmts)} formatos + thumb")

    return images_manifest


# ── ETAPA 3: galerias de fotos reais ─────────────────────────────────────────

def process_galleries():
    if not FOTOS_DIR.exists():
        print(f"[aviso] Pasta 'Fotos reais' não encontrada: {FOTOS_DIR} — pulando galerias.")
        return

    if not GALERIAS_JSON.exists():
        print(f"[aviso] {GALERIAS_JSON} não encontrado — pulando galerias.")
        return

    GALERIA_OUT.mkdir(parents=True, exist_ok=True)
    galerias = json.loads(GALERIAS_JSON.read_text(encoding="utf-8"))

    for slug, fotos in galerias.items():
        if slug == "_obs":
            continue
        for i, foto in enumerate(fotos):
            src_path = FOTOS_DIR / foto["src"]
            if not src_path.exists():
                print(f"[pulado] foto não encontrada: {src_path.name}")
                continue

            num = str(i + 1).zfill(2)

            with Image.open(src_path) as original:
                cropped = crop_16x9(original)
                graded  = grade(cropped)

                for w in GAL_WIDTHS:
                    h   = int(round(w * 9 / 16))
                    out = GALERIA_OUT / f"{slug}-{num}-{w}w"
                    export(graded.resize((w, h), Image.LANCZOS), out)

            print(f"[ok] galeria {slug}-{num}: {len(GAL_WIDTHS)}w")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> int:
    print("\n=== ETAPA 2: Heros ===\n")
    images_manifest = process_heroes()

    if images_manifest:
        existing = {}
        if IMAGES_JSON.exists():
            try:
                existing = json.loads(IMAGES_JSON.read_text(encoding="utf-8"))
            except Exception:
                pass
        existing.update(images_manifest)
        IMAGES_JSON.write_text(
            json.dumps(existing, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"\n→ images.json atualizado: {len(existing)} entradas")

    print("\n=== ETAPA 3: Galerias de fotos reais ===\n")
    process_galleries()

    print("\n✅ Pipeline concluído.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
