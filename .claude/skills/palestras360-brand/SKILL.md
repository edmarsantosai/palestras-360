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
