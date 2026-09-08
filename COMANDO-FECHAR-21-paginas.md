# 🎯 COMANDO — FECHAR 21 PÁGINAS 100% (Palestras 360)

Objetivo desta rodada: entregar **20 LPs + a home** 100% prontas, premium, para
publicar amanhã. Prioridade máxima: **setembro-amarelo** (estamos em setembro).
Execute na ordem. Não pule etapas. Ao final, rode a VALIDAÇÃO e reporte.

Arquivos de dados atualizados (já no repo, use como fonte da verdade — NÃO reescreva):
- `assets/data/palestras.json` → 45 temas; os 20 fechados têm `"completo": true`
- `assets/data/galerias-fotos-reais.json` → fotos reais por LP fechada
- `assets/img/logo/` + `assets/img/favicon/` → logo oficial (já integrada)

---

## ETAPA 1 — Nomear as 21 imagens hero corretamente (SEO/GEO)

As imagens vêm de `Imagens-Hero/` com nomes crus e com 2 ARMADILHAS já conhecidas:
- `hero ergonomia` → o slug real é **`ergonomia-no-dia-a-dia`** (NÃO existe slug "ergonomia")
- `palestra-sipat-2027-empresas-hero-1920x1080` → o "2027" é lixo → slug real **`sipat`**

Use `scripts/rename-hero-drops.py` com o dicionário de ALIASES abaixo e strip de ano.
Se o arquivo não existir, crie-o exatamente assim:

```python
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
```
Rode: `python3 scripts/rename-hero-drops.py`
**Trave aqui se algo cair em "não reconhecido".** Esperado: 21 reconhecidos, 0 falhas.

---

## ETAPA 2 — Processar heros (crop 16:9 + 3 larguras + AVIF/WebP/JPG + grading)

Rode `scripts/process-images.py` apontando `INPUT_DIR` para `assets/img/_hero-staging/`.
Saída em `assets/img/hero/` no padrão final (SEM `-src`):
`palestra-<slug>-empresas-hero-{1920,1280,768}w.{avif,webp,jpg}`
(exceção: `palestra-saude-mental-trabalho-hero-*` e `home-hero-*`).
Gere também os thumbnails 4:3 (320/480/640) para os cards do catálogo.

---

## ETAPA 3 — Processar as fotos reais (galerias de autenticidade)

Extraia `Fotos_reais.zip`. Leia `assets/data/galerias-fotos-reais.json`: para cada
slug, processe as fotos listadas (crop 16:9, larguras 1280/768, AVIF/WebP/JPG,
mesmo grading) e salve em `assets/img/galeria/<slug>-01.<ext>`, `-02`, etc.
Use o `alt` do JSON literalmente (não invente). Regra: ≥2 fotos → bloco galeria
(grid responsivo); 1 foto → imagem única na seção "Sobre a palestra".
LPs com foto real nesta rodada: comportamento-seguro, pare-pense-aja,
seguranca-regras-de-ouro, assedio-zero, sipat, saude-mental.

---

## ETAPA 4 — Manifest `assets/data/images.json`

Para cada um dos 20 slugs `completo:true` + `home`, garanta entrada com
`hero_base`, `larguras`, `formatos`, `thumb` e `alt` — o `alt` deve vir de
`imagens.hero_alt` do `palestras.json` (nunca genérico).

---

## ETAPA 5 — Home: catálogo SÓ das 20 LPs fechadas

No `render-lp.js` / gerador da home, o catálogo deve iterar **apenas
`palestras.filter(p => p.completo === true)`** → 20 cards. Os outros 25 temas
NÃO aparecem na home nesta rodada (nem como "em breve"). Cada card usa o
thumbnail real do hero + título + `frase` + CTA, levando à LP.
- `sitemap.xml`: incluir apenas as 20 LPs fechadas + home.
- Hero da home usa `home-hero-*` (imagem real gerada), com `fetchpriority="high"`.

---

## ETAPA 6 — Renderizar as 20 LPs (conteúdo COMPLETO do Jackson)

`node assets/js/render-lp.js` gerando **apenas** as 20 `completo:true`.
Cada LP deve renderizar TODAS as seções, sem pular nenhuma e sem placeholder:
Hero (H1 + frase + 3 checks + CTA) → Sobre (renderize TODOS os parágrafos do
array `sobre`) → Principais Temas (`topicos`) → Para Quem É Indicada (`para_quem`)
→ [Galeria de fotos reais, se houver] → Formatos → FAQ (`faq` + JSON-LD FAQPage)
→ CTA final → Palestras Relacionadas (`relacionadas`, só as que também são
`completo:true`; se uma relacionada não estiver fechada, pule-a).

Confirme que a mensagem de WhatsApp de cada LP usa `tema_whatsapp` do slug e o
número **5508006055544** (formato `https://wa.me/5508006055544?text=...`).

---

## ETAPA 7 — Confirmar que os fixes anteriores continuam aplicados

Estes já foram entregues nos comandos anteriores — apenas CONFIRME que seguem no ar:
- [ ] WhatsApp = 5508006055544 em todos os CTAs (nenhum placeholder `55XXXX`)
- [ ] `.htaccess` com redirect http→https pronto (ativar AutoSSL no cPanel)
- [ ] Acentuação correta (charset utf-8; sem "ORCAMENTO"/"Assedio" no HTML)
- [ ] Botão flutuante WhatsApp verde `#25D366` em todas as páginas
- [ ] Logo oficial no header (cor) e rodapé (branca) + favicons
- [ ] Crédito "Desenvolvido por Edmar Santos" → https://edmarsantos.com.br
- [ ] Ícones com significado em "Para quem é indicada" e marcadores de tópico (não hífen)

---

## DESIGN PREMIUM 100 (barra de qualidade — não negociável)

- Hero: imagem real com overlay navy→transparente para contraste do H1 (LCP = imagem, `fetchpriority=high`, width/height setados → CLS 0).
- Zero placeholder de ícone nas 20 LPs (todas têm hero real agora).
- Ritmo vertical consistente (tokens de spacing), tipografia Montserrat/Open Sans, CTA ciano retangular 10px, cards radius 14px com overlay premium.
- `prefers-reduced-motion` respeitado; foco visível; contraste WCAG AA.
- Mobile-first: hero, cards, galeria, FAQ e CTA sticky sem overlap; áreas de toque ≥44px.
- Imagens responsivas com `<picture>` (AVIF→WebP→JPG) e `srcset` por largura.

---

## VALIDAÇÃO FINAL (rodar antes de dizer "pronto")

1. [ ] 21 heros processados; `assets/img/hero/` sem nenhum nome cru fora do padrão
2. [ ] `python3 scripts/rename-hero-drops.py` → 21 reconhecidos, 0 não reconhecidos
3. [ ] Home mostra exatamente 20 cards, todos com thumbnail real, todos clicáveis
4. [ ] As 20 LPs abrem com hero real (sem placeholder), todas as seções preenchidas
5. [ ] **setembro-amarelo**: abrir e revisar manualmente do topo ao rodapé (página prioritária)
6. [ ] LPs com galeria (comportamento-seguro, assedio-zero, sipat) exibem as fotos reais com alt correto
7. [ ] WhatsApp abre com 5508006055544 + mensagem do tema em 3 LPs testadas
8. [ ] `sitemap.xml` = 20 LPs + home (não as 45)
9. [ ] Lighthouse mobile em setembro-amarelo e home: Performance ≥90, LCP < 2.5s, CLS 0
10. [ ] Nenhum 404 de imagem/logo (checar Network)

Reporte: quantas páginas geradas, quais arquivos alterados, resultado do Lighthouse
em setembro-amarelo, e qualquer item do checklist que falhou.
