---
name: palestras360-brand
description: >
  Camada de MARCA do projeto Palestras 360 (palestras360.com.br), a Central
  Nacional de Palestras Corporativas do cliente Jackson Baia. Use SEMPRE que a
  demanda envolver este projeto: criar, editar ou auditar qualquer página,
  landing page de palestra, homepage/catálogo, componente, copy, SEO, CTA ou
  token do repositório palestras-360; escrever HTML/CSS/JS puro para este
  cliente; definir a mensagem de WhatsApp por tema; ou trabalhar em temas como
  Setembro Amarelo, Outubro Rosa, Novembro Azul, SIPAT, Saúde Mental e afins.
  Carrega a identidade (navy #1B3A6A + ciano #00BCD4, Montserrat + Open Sans), o
  posicionamento nacional, o número de contato, o catálogo de temas e as regras
  de conversão do projeto. Pareia com a skill web-design-pro, que traz o método
  de design, performance e SEO.
---

# Palestras 360 — Camada de Marca

## Relação com o método (leia isto primeiro)

Esta skill é o **"quê"** (identidade, posicionamento e dados do projeto). O
**"como"** — design system, componentes, CRO, performance e SEO — vive na skill
**`web-design-pro`**. **Acione as duas juntas** ao trabalhar neste projeto e
não duplique aqui o que já está lá.

## Posicionamento (não alterar sem justificativa)

**Central Nacional de Palestras Corporativas para empresas de todo o Brasil.**
Não construir o projeto em torno da imagem de um único palestrante — a marca
pessoal é elemento **secundário**. A percepção desejada é de uma central
profissional com: +40 temas, palestras presenciais e online, atendimento
nacional, SIPAT, convenções, eventos corporativos, campanhas temáticas,
dinâmicas e palestras personalizadas.

## Identidade visual (tokens de marca)

| Papel | Valor | Token semântico |
|---|---|---|
| Institucional (wordmark "PALESTRAS") | `#1B3A6A` | `--color-brand` |
| Navy profundo (seções escuras) | `#0D2137` | `--color-brand-strong` |
| Ciano (mark "360") — **único acento de ação/CTA** | `#00BCD4` | `--color-action` |
| Display | **Montserrat** 700/800 | `--font-display` |
| Corpo | **Open Sans** 400/500/600 | `--font-body` |

**Fonte da verdade dos tokens:** `assets/css/tokens.css` no repositório. Não
crie uma segunda fonte de tokens — edite lá. Estes valores acima são referência
para novas páginas.

## Conversão (WhatsApp)

- Mecanismo: **WhatsApp com mensagem pré-preenchida por tema**, via o componente
  `data-wa` / `data-wa-theme` descrito em `web-design-pro`.
- Template da mensagem:
  > Olá! Tenho interesse na palestra sobre **[TEMA]** para minha empresa e
  > gostaria de solicitar um orçamento.
- Cada página passa seu tema em `data-wa-theme` — isso identifica de qual página
  o lead veio.
- ⚠️ **Atenção técnica (risco a confirmar):** o link `wa.me` exige um número de
  celular WhatsApp em formato internacional (`55` + DDD + número). O
  **0800 484 1234** é telefone/callback e **não funciona** em `wa.me`. Antes de
  publicar, confirme o **número WhatsApp comercial** e use-o no `--wa-phone`;
  mantenha o 0800 como telefone alternativo. Plano B: se não houver WhatsApp,
  usar formulário de baixa fricção como CTA.

## Regras visuais obrigatórias (registradas pelo cliente)

### Logo — tamanhos mínimos de exibição
- **Header:** altura de exibição **52-58px** (não menor). `width: auto`.
- **Footer:** **60-72px**. `width: auto`.
- Sempre usar o arquivo de logo real (transparente). **NUNCA** `filter: invert`.

### Botões — `--radius-btn: 10px`
**TODOS** os CTAs e botões usam `border-radius: var(--radius-btn)`. **NUNCA** pill/redondo em botão.
Aplica-se a: hero CTA, CTAs de meio e final, sticky mobile, botões de cards, filtros de categoria.

### Cards — `--radius-card: 14px`
Cards de conteúdo (`.talk-card`, `.related-card`) usam `border-radius: var(--radius-card)`.
Hover: `translateY(-4px)` + `shadow-lg` + zoom lento da imagem (`scale(1.06)`, `~600ms ease`).
Overlay premium: `linear-gradient(to top, rgba(13,33,55,.72) → transparent)` sobre a foto.
No hover o overlay intensifica. Cards "Em breve" têm o mesmo overlay e movimento.
Somente `transform/opacity`. Respeitar `prefers-reduced-motion`.

### Motion premium (com propósito — nunca exagerado)
- **Header elástico:** ao rolar — `backdrop-filter: blur`, bg semi-transparente, `padding` menor, logo sutilmente menor.
- **Hero Ken Burns:** zoom muito sutil na foto (`scale(1.04) → scale(1)`, ~14s, `forwards`).
- **Reveal on scroll:** `IntersectionObserver`, UMA vez, fade + `translateY(16px → 0)`, só `opacity/transform`.
- **Microinterações:** hover de card, estados hover/focus dos CTAs, acordeão FAQ, sticky CTA deslizante.
- **PROIBIDO:** animar todo elemento, parallax pesado, carrossel automático, partículas, contadores.
- **Sempre:** `prefers-reduced-motion` respeitado; sem prejuízo de LCP/INP/CLS.

## Anti-bug — aprendizados de auditoria premium (14/09)

Regras derivadas de bugs reais encontrados em produção. Valem para todas as
páginas (as 25+ existentes e futuras). **Não repetir esses erros.**

### Ícones SVG — tamanho obrigatório
- Todo SVG DEVE ter `viewBox` e uma classe com `width`/`height` FIXOS (24-32px).
- **PROIBIDO:** `svg { width: 100% }` sem `max-width` ou container limitado.
  → Bug real: ícones renderizaram a 400-500px ocupando a tela inteira.
- Ícone recomendado para seções de benefícios: classe `.pq-icon` com:
  ```css
  .pq-icon { width: 32px; height: 32px; flex-shrink: 0; color: var(--color-action); }
  .pq-icon svg { width: 100%; height: 100%; display: block; }
  ```

### Ícones — contextuais e únicos por item
- "Para quem é indicada" (e seções similares): cada card DEVE ter ícone **diferente
  e contextual**. Sugestões: `building-2` (empresa), `users` (equipe), `heart-pulse`
  (RH/QVT), `shield-check` (SIPAT), `megaphone` (campanha interna).
- **PROIBIDO:** repetir o mesmo ícone genérico (grade ⊞) em todos os cards.

### Marcadores de lista/tópico — com símbolo obrigatório
- Quadrado ou círculo colorido SEMPRE com símbolo dentro (check branco ou número
  sequencial 01, 02…).
- **PROIBIDO:** marcador colorido vazio — não comunica nada.
  ```css
  .topico-marker { display: flex; align-items: center; justify-content: center; }
  .topico-marker svg { width: 16px; height: 16px; color: #fff; }
  ```

### Grade de logos / prova social — SEMPRE grid
- Container obrigatório em CSS Grid:
  ```css
  .logos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-6);
    align-items: center;
  }
  .logos-grid img {
    height: 52px; width: auto; max-width: 100%;
    object-fit: contain; margin: 0 auto;
    filter: grayscale(100%); opacity: .75;
    transition: filter .3s, opacity .3s;
  }
  .logos-grid img:hover { filter: grayscale(0); opacity: 1; }
  ```
- Desktop: 4-6 logos por linha. Mobile: 2-3 por linha. Altura uniforme obrigatória.
- **PROIBIDO:** coluna única com logos de tamanhos diferentes.
- Aplica-se à faixa na home E à página `/empresas-atendidas/`.

### Header sobre hero — contraste AA
- Header sobre imagem no topo DEVE ter gradiente de proteção:
  ```css
  .site-header::before {
    content: ""; position: absolute; inset: 0; z-index: -1;
    background: linear-gradient(to bottom, rgba(13,33,55,.55), transparent);
    pointer-events: none;
  }
  .site-header.scrolled::before { background: var(--brand-900); }
  ```
- Contraste WCAG AA obrigatório em ambos os estados (topo e scrolled).

### Transição entre páginas
- Incluir `@view-transition { navigation: auto; }` + fade-in no `<body>`.
- **SEMPRE** dentro de `@media (prefers-reduced-motion: no-preference)`.
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @view-transition { navigation: auto; }
    body { animation: fadeIn .35s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  }
  ```

### Performance — não negociável
- Toda imagem de conteúdo em `<picture>`: AVIF → WebP → JPG, com `srcset`+`sizes`.
- Hero: `fetchpriority="high"`, **sem** `loading="lazy"`.
- Demais imagens: `loading="lazy" decoding="async"`.
- Todo `<img>` com `width` e `height` explícitos (CLS = 0).
- `.htaccess` com `mod_deflate` + `mod_expires` (cache longo para avif/webp/css/js).

### Gate visual — checklist antes de marcar página como "pronta"
Rodar este gate em cada página nova ou revisada:

1. Algum ícone/imagem em tamanho anormal? → corrigir com tamanho fixo
2. Ícones repetidos onde deviam ser distintos? → diferenciar contextualmente
3. Marcadores vazios (sem símbolo)? → adicionar check ou número
4. Grade de logos/cards alinhada e uniforme? → grid + altura fixa
5. Texto legível sobre imagem? → overlay/gradiente de contraste
6. Imagens em AVIF, hero priorizado, resto lazy? → confirmar no Network DevTools

---

## Rastreamento

Usar a **taxonomia de `web-design-pro`** (mesmos nomes em todas as páginas):
`view_page`, `view_talk`, `select_theme`, `scroll_depth`, `click_whatsapp`,
`generate_lead`. `cta_location` distingue Hero / Meio / Final / Sticky.

## Estrutura da LP

Seguir a **estrutura obrigatória de `web-design-pro`**: Hero → Sobre a Palestra →
Principais Temas Abordados → Para Quem É Indicada → Formatos (Presencial /
Online / Personalizada) → FAQ → CTA Final → Palestras Relacionadas. **Cada tema é
uma unidade independente** de SEO, intenção de busca, conversão e Google Ads.

## Catálogo de temas

- **Já com copy pronta (6 páginas):** homepage + Comportamento Seguro, Burnout
  Previna-se, Assédio Zero, Saúde Mental, Gestão do Tempo.
- **MVP prioritário (próximos):** Setembro Amarelo, Outubro Rosa, Novembro Azul,
  SIPAT, Saúde Mental.
- **Meta:** escalar para **40+ temas** via dados (JS/JSON) + componentes, **sem
  duplicar código**. Cada tema com slug próprio por intenção
  (ex.: `/palestras/setembro-amarelo`). A tabela completa de temas × slugs está
  na doc do projeto no Notion.

## Stack e repositório

- **HTML/CSS/JS puro** — sem frameworks, sem WordPress/Elementor.
- **Repo:** `github.com/edmarsantosai/palestras-360`
- **Núcleo:** `assets/css/tokens.css`, `assets/css/main.css`, `assets/js/main.js`.
- Escala **orientada a dados** (dados das palestras em JS/JSON) para gerar as 40+
  páginas a partir de templates.
- **Divisão de trabalho:** Edmar entrega LP + SEO + GEO; **o cliente gerencia o
  tráfego pago** de forma independente.

## Dados fixos

- **Cliente:** Jackson Baia (palestrante corporativo).
- **Domínio:** palestras360.com.br
- **Telefone/0800:** 0800 484 1234 (telefone — ver ressalva de WhatsApp acima).

## Regra

Ao tocar neste projeto: acionar **`web-design-pro`** (método) + **esta skill**
(marca). Preservar o que já funciona — **evoluir / reutilizar**, nunca recomeçar
sem justificativa.
