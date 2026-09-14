# 🏁 COMANDO FINAL — Palestras 360 · Fechar 100% do site (Premium Score 100)

Objetivo: finalizar TODO o site com excelência de agência premium. Nada de
placeholder, nada de meia-entrega. Trabalhe com rigor máximo. Se o ambiente
suportar **subagentes**, paralelize pelos 5 streams abaixo e consolide num
relatório único. Se não, execute os streams em ordem.

## Fonte da verdade (não reescrever, apenas consumir)
- `assets/data/palestras.json` — 45 temas (20 com `completo:true`, 25 a fechar)
- `assets/data/galerias-fotos-reais.json` — fotos reais por LP
- `assets/img/logo/` + `assets/img/favicon/` — logo oficial

## ⛔ DECISÃO TRAVADA — número de contato (aplicar em TODO o site)
O número **0800 484 1234** é o oficial e único. Faça:
```
grep -rn "5508006055544\|605 5544\|6055544" . --include="*.html" --include="*.js" --include="*.json" --include="*.css"
```
Troque **todas** as ocorrências:
- dígitos wa.me: `5508006055544` → **`5508004841234`** (mesmo formato, só muda o número)
- texto exibido: `0800 605 5544` → **`0800 484 1234`**
- garanta que NÃO sobrou nenhum `605 5544` nem nenhum `484 1234` isolado/divergente fora do padrão.
Deve existir UMA constante única (`PHONE = "5508004841234"`) e um único display.

---

## STREAM 1 — Correções globais de copy + bugs de UI (auditoria mobile)

**1.1 Título (global).** Toda ocorrência de `de Todo o Brasil` → `em Todo o Brasil`
e `de todo o Brasil` → `em todo o Brasil`. H1 da home passa a ser exatamente:
`Palestras Corporativas para Empresas em Todo o Brasil`.

**1.2 Espaçamento de parágrafos nas LPs (bug do "texto corrido").** Hoje os 4
parágrafos do `sobre` saem grudados (muro de texto). Corrija a renderização e o
CSS: cada item do array `sobre` vira um `<p class="sobre__body">` SEPARADO, com:
```css
.sobre__body { margin-bottom: 1.25em; line-height: 1.75; max-width: 68ch; text-align: left; }
.sobre__body:first-of-type { font-size: 1.075em; }  /* lead */
.sobre__body:last-child { margin-bottom: 0; }
```
Nunca justificar. Confirme visualmente que há respiro entre os parágrafos.

**1.3 CTA cortado no mobile.** O botão "Solicitar orçamento pelo WhatsApp" está
truncando o texto no mobile (overflow). Corrija: permitir quebra/dimensionamento
responsivo (`white-space: normal`, `font-size` responsivo com `clamp()`,
`padding` adequado, largura 100% no mobile). O texto deve aparecer inteiro em
telas de 360px.

**1.4 Ícones com significado em "Para quem é indicada".** Remova o ícone genérico
de grade (⊞) repetido. Use ícones monoline contextuais (lucide-style) coerentes
com cada item: empresa/prédio, indústria/capacete, pessoas/equipe, RH, calendário/evento.

**1.5 Marcadores de "Principais Temas".** Troque o traço `—` (parece "menos") por
um marcador real: bullet circular preenchido na cor de ação OU número. Nunca hífen solto.

**1.6 Logo maior (pedido do cliente).** Aumente a logo: **+30% no header** e
**+70% no rodapé**. Ajuste o alinhamento vertical para não quebrar o header.
Use os arquivos reais (`header-logo-*`, `footer-logo-white@2x.png`) — sem `filter: invert`.

**1.7 "Grupos de qualquer tamanho" (card Presencial).** Troque
`Palestra ao vivo na sua empresa, para grupos de qualquer tamanho.`
por:
`Palestra ao vivo na sua empresa, adaptada ao perfil e ao número de participantes.`

**1.8 E-mail de contato.** Adicione `contato@palestras360.com.br` na seção de
formatos/contato e no rodapé (mailto:), ao lado do 0800 e do WhatsApp.

**1.9 Redundância na home.** Existem duas listas de checks quase iguais coladas
(a escura "Palestras para todas as temáticas…" e a faixa ciano "Mais de 40 temas…").
Mantenha só UMA (a mais forte visualmente) para não poluir. Decida pela que tem melhor hierarquia.

---

## STREAM 2 — Novas seções da HOME (textos do cliente, já aprovados)

**2.1 Seção "Por que contratar" — logo abaixo do hero.**
- Eyebrow: `A CENTRAL NACIONAL DE PALESTRAS`
- H2 (otimizado SEO/GEO): `Por que contratar a Palestras 360 para a sua empresa`
- 5 cards/itens (ícone + título + descrição):
  1. **Atendimento em todo o Brasil** — Rede de profissionais para palestras presenciais e online.
  2. **Mais de 40 temas** — Saúde, segurança, comportamento, liderança, campanhas e desenvolvimento humano.
  3. **Palestras personalizadas** — Conteúdo adequado ao perfil, público e objetivo da empresa.
  4. **Agilidade no atendimento** — Informe tema, cidade e data. Nossa equipe encontra a melhor solução.
  5. **Nota fiscal** — Contratação empresarial com emissão de documentação fiscal.
- Frase de destaque (bloco com ênfase visual, logo após os 5 itens):
  `Você não precisa procurar dezenas de palestrantes. Diga o que sua empresa precisa e a Palestras 360 cuida do restante.`
- GEO: marque os 5 itens como lista semântica real (`<ul>`/definition list) para extração por buscadores e LLMs.

**2.2 Seção "Como Funciona" — 4 passos numerados (na home).**
- Eyebrow: `SIMPLES E RÁPIDO` · H2: `Como Funciona`
- Passos:
  1. **Conte o que sua empresa precisa** — Tema, data, cidade, público e formato.
  2. **Encontramos a melhor solução** — Selecionamos o profissional e o formato adequados à necessidade da sua empresa.
  3. **Você recebe a proposta** — Tudo de maneira simples e rápida.
  4. **Nós cuidamos da palestra** — Presencial ou online, em qualquer região do Brasil.
- CTA ao final: "Solicitar orçamento pelo WhatsApp".

**2.3 Faixa de prova social na home** (ver Stream 3 para a página completa).
- H2: `Empresas que já contrataram a Palestras 360`
- Faixa de logos padronizados (grid responsivo ou marquee sutil), **grayscale** por
  padrão e cor no hover (consistência premium). Link "Ver todas" → `/prova-social/`.

---

## STREAM 3 — Prova social (página dedicada + pipeline de logos)

**Contexto:** +78 logos de empresas atendidas. Os arquivos estão no Google Drive
do Edmar (Claude Code NÃO acessa Drive — os logos serão colocados localmente em
`assets/img/prova-social/_raw/`; se a pasta estiver vazia, gere a estrutura e o
pipeline, e deixe a seção pronta para popular).

**3.1 Pipeline de padronização** (`scripts/process-logos.py`):
- Entrada: `assets/img/prova-social/_raw/*` (png/jpg)
- Recorte da borda vazia (trim), fundo transparente quando possível, normaliza para
  **altura uniforme** (ex.: 80px de exibição → exporta @2x 160px), padding lateral consistente.
- Exporta WebP + PNG em `assets/img/prova-social/` com nome sequencial ou slug da empresa.
- Gera `assets/data/prova-social.json` (lista: arquivo + nome da empresa + alt).

**3.2 Página `/prova-social/`:**
- Hero curto + H1 `Empresas que confiam na Palestras 360`
- Grid responsivo com todos os logos (grayscale→cor no hover), lazy-load.
- CTA final "Solicitar orçamento pelo WhatsApp".
- Meta/OG próprios + entrada no sitemap.

**3.3 Depoimentos em vídeo:** NÃO hospedar vídeo no site (peso/performance).
Incluir botões/links para Instagram e LinkedIn onde os vídeos estão centralizados.

---

## STREAM 4 — Fechar as 25 LPs restantes

**4.1 Heroes.** As 25 imagens serão geradas e colocadas em `Imagens-Hero/`.
Rode o fluxo: `rename-hero-drops.py` → `process-images.py`. Confirme que o
`rename` reconheceu todos os 25 slugs (o dicionário de ALIASES já cobre casos
como `ergonomia`; se algum cair em "não reconhecido", pare e reporte).

**4.2 Fotos reais.** Reanalise `galerias-fotos-reais.json` e as fotos reais
disponíveis e encaixe nas páginas onde fazem sentido — inclusive nas que agora
serão criadas (ex.: `ergonomia-escritorio-home-office` → foto 10;
`inteligencia-emocional` → fotos 15/16). Aplique a regra ≥2 fotos → galeria; 1 → imagem única.

**4.3 Render + completo.** Marque as 25 como `completo:true` conforme cada uma
tiver hero processado, e rode `render-lp.js`. Ao final, a home deve listar os
**45 temas** (não mais só 20) e o sitemap conter as 45 LPs + home + /prova-social/.

**4.4 Palestras relacionadas: 3 a 6 por página.** Hoje são 3. Ajuste o gerador
para exibir de **3 a 6** relacionadas por LP, priorizando mesma categoria e
depois temas correlatos. Só linkar para LPs `completo:true`.

---

## STREAM 5 — QA Premium (gate final, Score 100)

Rode e me reporte:
- **Consistência de número:** grep confirma 0 ocorrências de `605 5544`/`5508006055544`.
- **Mobile (360px):** hero, "Por que contratar", "Como funciona", cards, formatos,
  "para quem", FAQ, relacionadas, prova social, CTA e botão flutuante — sem overflow,
  sem texto cortado, sem sobreposição. Áreas de toque ≥44px.
- **Parágrafos do `sobre`:** respiro visível entre os 4 parágrafos em 3 LPs de amostra.
- **Lighthouse mobile** em `setembro-amarelo` E na `home`: Performance ≥90, LCP <2.5s,
  CLS 0, SEO 100, Best Practices ≥95, Acessibilidade ≥95.
- **Links:** nenhum 404 (imagens, logos, favicons, âncoras, wa.me, mailto).
- **SEO/GEO:** cada página com title/description/H1 únicos, JSON-LD (FAQPage nas LPs,
  Organization na home com o 0800 e e-mail corretos), OG tags, sitemap + robots atualizados.

## Barra Premium Score 100 (não negociável)
- Hierarquia tipográfica consistente (Montserrat/Open Sans), ritmo vertical por tokens.
- CTA ciano retangular (10px) como ação primária; WhatsApp flutuante verde `#25D366`.
- Imagens `<picture>` AVIF→WebP→JPG com `srcset`, `width/height` (CLS 0), hero `fetchpriority=high`.
- `prefers-reduced-motion` respeitado; foco visível; contraste WCAG AA.
- Zero placeholder, zero lorem, zero texto cortado, zero número/informação divergente.

---

## Relatório final (obrigatório)
Ao terminar, reporte por stream: o que mudou, arquivos afetados, resultado do
Lighthouse (home + setembro-amarelo), quantas LPs ficaram `completo:true`,
e QUALQUER item que não passou no QA. Liste o que (se algo) depende de input
externo (ex.: logos ainda não colocados em `_raw/`, prints de FAQ do cliente).
