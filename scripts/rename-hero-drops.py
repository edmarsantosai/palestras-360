#!/usr/bin/env python3
import json, re, shutil, sys
from pathlib import Path

DROP_DIR   = Path("Imagens-Hero")
STAGING    = Path("assets/img/_hero-staging"); STAGING.mkdir(parents=True, exist_ok=True)
DATA       = json.loads(Path("assets/data/palestras.json").read_text(encoding="utf-8"))
SLUGS      = {p["slug"] for p in DATA["palestras"]}

ALIASES = {                      # nomes crus que NÃO batem por semelhança
    "ergonomia": "ergonomia-no-dia-a-dia",
    "sipat-2027": "sipat",
}

def normalize(name: str) -> str:
    s = name.lower()
    s = re.sub(r"\.(png|jpe?g|webp|avif)$", "", s)
    s = re.sub(r"^(hero[-_ ]+|palestra[-_ ]+)+", "", s)     # tira prefixo hero/palestra
    s = re.sub(r"(-empresas-hero.*|-trabalho-hero.*|-hero-\d+x\d+.*|[-_ ]*hero$)", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    s = re.sub(r"-20\d\d$", "", s)                          # tira ano no fim (sipat-2027)
    return s

matched, unmatched = [], []
for f in sorted(DROP_DIR.iterdir()):
    if not f.is_file(): continue
    stem = f.stem.lower().strip()
    if stem in ("home-hero","home_hero","home hero","herohome"):
        slug = "__home__"
    else:
        norm = normalize(f.name)
        norm = ALIASES.get(norm, norm)
        slug = norm if norm in SLUGS else None
    if slug is None:
        unmatched.append(f.name); continue
    if slug == "__home__":
        new = f"home-hero-src{f.suffix.lower()}"
    elif slug == "saude-mental":
        new = f"palestra-saude-mental-trabalho-hero-src{f.suffix.lower()}"  # exceção SEO já em produção
    else:
        new = f"palestra-{slug}-empresas-hero-src{f.suffix.lower()}"
    shutil.copy2(f, STAGING/new); matched.append((f.name, new))

print(f"\n✅ {len(matched)} reconhecidos:")
for o,n in matched: print(f"   {o}  →  {n}")
if unmatched:
    print(f"\n⚠️  {len(unmatched)} NÃO reconhecidos (revise antes de seguir):")
    for n in unmatched: print("   ", n)
    sys.exit(1)
