#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Palestras 360 — Pipeline de imagens hero.

Fluxo:
  1. Lê os originais em _raw-img/hero/ (mapeados por slug).
  2. Crop central 16:9.
  3. Aplica grade cinematográfico PREMIUM, porém SUTIL (contraste suave,
     leve tom frio navy/ciano — sem exagero).
  4. Redimensiona para 1920 / 1280 / 768 px de largura.
  5. Exporta AVIF + WebP + JPG (qualidade ~80).
     Se AVIF falhar, gera só WebP + JPG e avisa.
  6. Nomeia <nome-final>-<largura>w.<ext> em assets/img/<slug>/.
  7. Atualiza assets/data/images.json com o alt vindo de palestras.json
     (imagens.hero_alt — não inventa texto).
  8. Imprime antes/depois (dimensões, KB) e a árvore de assets/img/.

Uso:  python scripts/process-images.py
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageEnhance

# Console Windows costuma ser cp1252 — força UTF-8 para não quebrar nos prints.
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:  # pragma: no cover
    pass

# AVIF é opcional — degrada graciosamente para WebP + JPG.
try:
    import pillow_avif  # noqa: F401  (registra o encoder AVIF no Pillow)
    AVIF_OK = True
except Exception:  # pragma: no cover
    AVIF_OK = False

# ── Caminhos ──────────────────────────────────────────────────────────────────
ROOT     = Path(__file__).resolve().parent.parent
RAW_DIR  = ROOT / "_raw-img" / "hero"
OUT_DIR  = ROOT / "assets" / "img"
DATA_DIR = ROOT / "assets" / "data"
PALESTRAS_JSON = DATA_DIR / "palestras.json"
IMAGES_JSON    = DATA_DIR / "images.json"

# ── Configuração do pipeline ──────────────────────────────────────────────────
WIDTHS       = [1920, 1280, 768]
QUALITY      = 80
ASPECT       = (16, 9)
THUMB_WIDTHS = [640, 480, 320]
THUMB_ASPECT = (4, 3)

# Mapa: slug → (arquivo de origem, nome-final).
# Confirmado com o cliente. Nomes finais sem sufixo de dimensão nem ano.
SOURCES = {
    "setembro-amarelo": (
        "palestra-setembro-amarelo-empresas-hero-1920x1080.jpeg",
        "palestra-setembro-amarelo-empresas-hero",
    ),
    "outubro-rosa": (
        "palestra-outubro-rosa-empresas-hero-1920x1080.jpeg",
        "palestra-outubro-rosa-empresas-hero",
    ),
    "novembro-azul": (
        "palestra-novembro-azul-empresas-hero-1920x1080.jpeg",
        "palestra-novembro-azul-empresas-hero",
    ),
    "sipat": (
        "palestra-sipat-2027-empresas-hero-1920x1080.jpeg",
        "palestra-sipat-empresas-hero",  # sem ano no nome final
    ),
    "saude-mental": (
        "palestra-saude-mental-trabalho-hero-1920x1080.jpeg",
        "palestra-saude-mental-trabalho-hero",
    ),
}


# ── Helpers ───────────────────────────────────────────────────────────────────
def kb(path: Path) -> float:
    return path.stat().st_size / 1024.0


def load_alts() -> dict:
    """Extrai imagens.hero_alt de cada palestra do palestras.json."""
    data = json.loads(PALESTRAS_JSON.read_text(encoding="utf-8"))
    alts = {}
    for p in data.get("palestras", []):
        img = p.get("imagens") or {}
        if "hero_alt" in img:
            alts[p["slug"]] = img["hero_alt"]
    return alts


def crop_center_4x3(im: Image.Image) -> Image.Image:
    """Corta o retângulo central com proporção 4:3 (thumbnail de card)."""
    w, h = im.size
    target = THUMB_ASPECT[0] / THUMB_ASPECT[1]
    current = w / h
    if current > target:
        new_w = int(round(h * target))
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        new_h = int(round(w / target))
        top = (h - new_h) // 2
        box = (0, top, w, top + new_h)
    return im.crop(box)


def crop_center_16x9(im: Image.Image) -> Image.Image:
    """Corta o retângulo central com proporção 16:9."""
    w, h = im.size
    target = ASPECT[0] / ASPECT[1]
    current = w / h
    if current > target:          # largo demais → corta laterais
        new_w = int(round(h * target))
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:                          # alto demais → corta topo/base
        new_h = int(round(w / target))
        top = (h - new_h) // 2
        box = (0, top, w, top + new_h)
    return im.crop(box)


def apply_cinematic_grade(im: Image.Image) -> Image.Image:
    """
    Grade cinematográfico PREMIUM e SUTIL:
      - contraste levemente suavizado (menos "duro", mais filme);
      - leve dessaturação para tom editorial;
      - deslocamento frio muito discreto rumo a navy/ciano nas sombras/realces.
    Nada de exagero — os deltas ficam em ±3–5%.
    """
    im = im.convert("RGB")

    # 1) Contraste suave (curva mais macia) + micro-lift de brilho.
    im = ImageEnhance.Contrast(im).enhance(0.96)
    im = ImageEnhance.Brightness(im).enhance(1.01)

    # 2) Dessaturação editorial discreta.
    im = ImageEnhance.Color(im).enhance(0.93)

    # 3) Tom frio navy/ciano por canal (multiplicadores muito próximos de 1).
    #    Reduz vermelho, mantém verde, valoriza azul de leve.
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 0.985)))
    g = g.point(lambda v: min(255, int(v * 0.997)))
    b = b.point(lambda v: min(255, int(v * 1.012 + 2)))
    im = Image.merge("RGB", (r, g, b))

    return im


def export(im: Image.Image, out_base: Path) -> list:
    """Salva AVIF (se disponível) + WebP + JPG. Retorna lista de formatos ok."""
    formats = []

    if AVIF_OK:
        try:
            im.save(out_base.with_suffix(".avif"), format="AVIF", quality=QUALITY)
            formats.append("avif")
        except Exception as e:  # pragma: no cover
            print(f"    [aviso] AVIF falhou ({e}); seguindo com WebP+JPG.")

    im.save(out_base.with_suffix(".webp"), format="WEBP", quality=QUALITY, method=6)
    formats.append("webp")

    im.save(out_base.with_suffix(".jpg"), format="JPEG",
            quality=QUALITY, optimize=True, progressive=True)
    formats.append("jpg")

    return formats


# ── Pipeline principal ────────────────────────────────────────────────────────
def main() -> int:
    if not RAW_DIR.exists():
        print(f"ERRO: pasta de originais não encontrada: {RAW_DIR}")
        return 1

    if not AVIF_OK:
        print("[aviso] pillow-avif-plugin indisponível — gerando apenas WebP + JPG.\n")

    alts = load_alts()
    images_manifest = {}
    report_rows = []  # (slug, largura, antes_dims, antes_kb, depois_dims, depois_kb)

    for slug, (src_name, final_name) in SOURCES.items():
        src = RAW_DIR / src_name
        if not src.exists():
            print(f"[pulado] origem ausente para '{slug}': {src_name}")
            continue

        alt = alts.get(slug)
        if not alt:
            print(f"[aviso] sem hero_alt em palestras.json para '{slug}' — alt ficará vazio.")
            alt = ""

        out_slug_dir = OUT_DIR / slug
        out_slug_dir.mkdir(parents=True, exist_ok=True)

        with Image.open(src) as original:
            src_dims = original.size
            src_kb = kb(src)
            cropped = crop_center_16x9(original)
            graded = apply_cinematic_grade(cropped)

            formats_final = []
            for w in WIDTHS:
                h = int(round(w * ASPECT[1] / ASPECT[0]))
                resized = graded.resize((w, h), Image.LANCZOS)
                out_base = out_slug_dir / f"{final_name}-{w}w"
                formats_final = export(resized, out_base)

                # Reporta o JPG do width como referência de tamanho.
                jpg_path = out_base.with_suffix(".jpg")
                report_rows.append(
                    (slug, w, f"{src_dims[0]}x{src_dims[1]}", src_kb,
                     f"{w}x{h}", kb(jpg_path))
                )

        # ── Thumbnails 4:3 ───────────────────────────────────────────────────
        thumb_dir  = out_slug_dir / "thumb"
        thumb_dir.mkdir(exist_ok=True)
        thumb_name = f"{final_name}-thumb"
        thumb_cropped = crop_center_4x3(graded)
        thumb_formats: list = []
        for tw in THUMB_WIDTHS:
            th_h = int(round(tw * THUMB_ASPECT[1] / THUMB_ASPECT[0]))
            resized_thumb = thumb_cropped.resize((tw, th_h), Image.LANCZOS)
            out_thumb_base = thumb_dir / f"{thumb_name}-{tw}w"
            thumb_formats = export(resized_thumb, out_thumb_base)

        images_manifest[slug] = {
            "hero_base": final_name,
            "larguras": WIDTHS,
            "formatos": formats_final,
            "alt": alt,
            "thumb": {
                "base": thumb_name,
                "larguras": THUMB_WIDTHS,
                "formatos": thumb_formats,
            },
        }
        print(f"[ok] {slug}: {len(WIDTHS)} larguras × {len(formats_final)} formatos "
              f"({', '.join(formats_final)}) + thumb {len(THUMB_WIDTHS)}w")

    # Escreve o manifesto.
    IMAGES_JSON.write_text(
        json.dumps(images_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\n→ manifesto escrito: {IMAGES_JSON.relative_to(ROOT)}")

    # ── Relatório antes/depois ────────────────────────────────────────────────
    print("\n" + "=" * 78)
    print("ANTES / DEPOIS  (JPG como referência de tamanho por largura)")
    print("=" * 78)
    print(f"{'slug':<18}{'largura':<9}{'origem':<14}{'orig KB':>9} "
          f"{'saída':<12}{'out KB':>9}")
    print("-" * 78)
    for slug, w, sdim, skb, ddim, dkb in report_rows:
        print(f"{slug:<18}{str(w)+'w':<9}{sdim:<14}{skb:>8.0f} "
              f"{ddim:<12}{dkb:>8.0f}")
    print("=" * 78)

    return 0


if __name__ == "__main__":
    sys.exit(main())
