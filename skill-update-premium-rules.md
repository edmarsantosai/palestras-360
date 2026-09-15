# Regras a incorporar na skill `palestras360-brand` (references/premium-checklist.md)

Aprendizados da auditoria de 14/09 — vira padrão obrigatório para todas as páginas
(as 25 restantes e futuras) e para qualquer projeto que reuse a engine.

## Ícones — NUNCA errar de novo
- Todo ícone (SVG) DEVE ter `viewBox` e uma classe com `width`/`height` FIXOS
  (ex.: 24-32px). Proibido `svg { width: 100% }` sem `max-width`/container limitado.
  → Bug real: ícones renderizaram a 400-500px na home.
- "Para quem é indicada": ícones contextuais e DIFERENTES por item. Nunca repetir
  o mesmo ícone genérico (grade ⊞) em todos os cards.
- Marcadores de lista/tópico: quadrado/círculo SEMPRE com símbolo dentro (check
  branco ou número). Marcador colorido vazio é proibido — não comunica nada.

## Logo — tamanhos mínimos de exibição
- Header: altura de exibição 52-58px (não menor). Footer: 60-72px.
- Sempre usar o arquivo de logo real (transparente), `width:auto`. Nunca `filter:invert`.

## Prova social / grade de logos — SEMPRE grid
- Container em CSS Grid: `repeat(auto-fill, minmax(150px, 1fr))`, gap consistente.
- Imgs com ALTURA FIXA uniforme (~48-56px), `width:auto`, `object-fit:contain`.
- Padrão premium: `grayscale(100%)` + `opacity:.75`, cor no hover.
- Proibido: coluna única com logos de tamanhos diferentes.

## Header sobre hero — contraste
- Header sobre imagem no topo precisa de gradiente de proteção
  (navy→transparente) até o estado `.scrolled` (fundo sólido). Contraste AA sempre.

## Transição entre páginas
- Incluir `@view-transition { navigation: auto; }` + fade-in de `body`.
- Sempre dentro de `@media (prefers-reduced-motion: no-preference)`.

## Performance — não negociável
- Toda imagem de conteúdo em `<picture>`: AVIF → WebP → JPG, com `srcset`+`sizes`.
- Hero: `fetchpriority="high"`, sem lazy. Demais: `loading="lazy" decoding="async"`.
- Todo `<img>` com `width`/`height` explícitos (CLS 0).
- `.htaccess` com mod_deflate + mod_expires (cache longo para avif/webp/css/js).

## Gate visual antes de considerar página "pronta"
Rodar mentalmente (ou no navegador) esta checagem em cada página nova:
1. Algum ícone/imagem em tamanho anormal? → corrigir tamanho fixo
2. Ícones repetidos onde deviam ser distintos? → diferenciar
3. Marcadores vazios? → colocar símbolo
4. Grade de logos/cards alinhada e uniforme? → grid + altura fixa
5. Texto legível sobre imagem? → overlay/contraste
6. Imagens em AVIF, hero priorizado, resto lazy? → confirmar no Network
