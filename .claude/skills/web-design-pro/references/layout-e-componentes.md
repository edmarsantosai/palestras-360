# Layout, Hierarquia e Biblioteca de Componentes

> Como organizar o espaço para o olho seguir a ordem certa até a ação — e os
> componentes canônicos, consistentes e reutilizáveis, que compõem uma LP de
> conversão. Estrutura é informação: bordas, divisores, numeração e rótulos
> **codificam significado**, não decoram.

## Índice
1. Grid e container
2. Ritmo vertical e espaçamento de seção
3. Hierarquia visual (as 5 alavancas)
4. Above-the-fold: o que o hero deve resolver
5. Padrões de leitura (F / Z)
6. Mobile-first (toque, thumb zone, sticky CTA)
7. Biblioteca de componentes
   - Header / Nav
   - Hero
   - Botão / CTA + botão WhatsApp com tracking
   - Card (talk/feature) — evitando "cards idênticos"
   - Lista de benefícios
   - FAQ (acordeão acessível)
   - Prova social
   - Formulário
   - Footer
   - Relacionados

---

## 1. Grid e container

- **12 colunas** com gutter consistente (ex.: `--space-5`). Container geral
  `max-width: var(--container)` (~1200px), centralizado, com padding lateral
  fluido: `padding-inline: clamp(1rem, 4vw, 2rem)`.
- **Largura de leitura** separada: blocos de texto corrido em
  `--container-narrow` (~720px / `65ch`).
- Prefira **CSS Grid** para layout de seção e **Flexbox** para alinhamento
  interno. `gap` no lugar de margens manuais reduz bugs de espaçamento.

## 2. Ritmo vertical e espaçamento de seção

- Padding de seção **fluido**: `padding-block: var(--space-section)`
  (`clamp(3rem, 8vw, 8rem)`). Consistente entre seções = ordem.
- Espaço **dentro** da seção segue a mesma escala de tokens. Evite valores
  soltos; evite empilhar margens que colapsam de forma imprevisível.
- **Cuidado com especificidade de CSS:** seletores por tipo (`.section`) podem
  cancelar os de elemento (`.cta`) em `padding`/`margin`. Mantenha regras
  previsíveis.

## 3. Hierarquia visual (as 5 alavancas)

Para guiar o olho, module: **tamanho, peso, cor, espaço e posição**. O elemento
mais importante da seção deve vencer em pelo menos duas dessas. O CTA primário
vence pela cor de ação + espaço ao redor + posição.

## 4. Above-the-fold: o que o hero deve resolver

Em segundos, sem rolar, o hero responde:
- **O quê** é esta página (headline orientado a benefício/oferta).
- **Para quem** é.
- **Formato / onde** (presencial · online · atendimento nacional, quando aplicável).
- **Ação primária** visível (CTA).
- **Faixa de confiança** curta (números/logos/garantia) reforçando credibilidade.

Menos é mais: **evite excesso de texto no hero**.

## 5. Padrões de leitura (F / Z)

- Páginas densas de texto → o olho faz **F** (topo e lateral esquerda). Ponha o
  essencial à esquerda/topo.
- Páginas visuais/hero → **Z** (canto sup. esq. → sup. dir. → diagonal). Alinhe
  headline e CTA a esse fluxo.

## 6. Mobile-first (não desktop-first)

- **Alvos de toque ≥ 44–48px**, com espaço entre eles. Nada de links minúsculos
  colados.
- **Thumb zone:** ações primárias ao alcance do polegar. Considere **CTA sticky**
  no rodapé em mobile (barra fixa com o botão de WhatsApp).
- Tipografia e espaçamento fluidos (`clamp`) evitam refazer tudo por breakpoint.
- Teste hero, cards, menu, catálogo, leitura, espaçamento e o botão de WhatsApp
  no mobile **antes** do desktop.
- Nunca resolva um problema de desktop quebrando mobile (e vice-versa).

---

## 7. Biblioteca de componentes

Padrões canônicos, reutilizáveis, consumindo tokens. Adapte o visual à marca; a
**estrutura e a acessibilidade** são o padrão.

### Header / Nav
- `header` sticky com `z-index: var(--z-header)`; logo à esquerda, poucos links,
  **CTA no header**. Colapsa em menu no mobile (botão com `aria-expanded`).
- Semântica: `header > nav`. Link ativo identificável. Contraste do menu ok.

```html
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="Página inicial">LOGO</a>
    <nav aria-label="Principal">
      <button class="nav-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
      <ul id="menu" class="nav-list">
        <li><a href="#temas">Temas</a></li>
        <li><a href="#formatos">Formatos</a></li>
        <li><a class="btn btn--action" data-wa="Header">Solicitar orçamento</a></li>
      </ul>
    </nav>
  </div>
</header>
```

### Hero
- `h1` único; subhead curto; **CTA primário** (+ secundário opcional discreto);
  faixa de confiança; visual de apoio opcional (a imagem de LCP precisa ser
  otimizada e com `width/height` — ver `performance-e-seo.md`).

```html
<section class="hero">
  <div class="container">
    <h1 class="hero__title">Promessa clara e orientada à oferta</h1>
    <p class="hero__sub">Para quem é, formato e onde atende — em uma linha.</p>
    <div class="hero__actions">
      <a class="btn btn--action btn--lg" data-wa="Hero">Solicitar orçamento no WhatsApp</a>
    </div>
    <ul class="trust-strip">
      <li>Presencial e online</li><li>Atendimento nacional</li><li>+40 temas</li>
    </ul>
  </div>
</section>
```

### Botão / CTA
- **Diga o que acontece** ("Solicitar orçamento no WhatsApp"). Hierarquia clara:
  `.btn--action` (primário, cor de ação) vs. `.btn--ghost` (secundário).
- Estados: `:hover`, `:focus-visible` (contorno visível), `:active`, disabled.
- Alvo ≥ 44px de altura; padding generoso.

```css
.btn{ display:inline-flex; align-items:center; gap:.5rem; min-height:44px;
  padding:.75rem 1.25rem; border-radius:var(--radius-md); font-weight:700;
  text-decoration:none; transition:background var(--duration-base) var(--ease-out); }
.btn--action{ background:var(--color-action); color:var(--color-on-action); }
.btn--action:hover{ background:var(--color-action-hover); }
.btn:focus-visible{ outline:3px solid var(--color-action); outline-offset:2px; }
```

**Botão WhatsApp com mensagem contextual + rastreamento** (padrão do projeto):
o mesmo componente serve todas as páginas; o link é montado por JS a partir de
atributos `data-*`, mantendo a mensagem específica do tema e permitindo saber de
onde veio o lead.
```html
<a class="btn btn--action"
   data-wa="Hero"
   data-wa-theme="Setembro Amarelo"
   href="#">Solicitar orçamento no WhatsApp</a>
```
```js
const PHONE = "550800XXXXXXX"; // número no formato internacional
document.querySelectorAll("[data-wa]").forEach(a => {
  const theme = a.dataset.waTheme || document.title;
  const msg = `Olá! Tenho interesse na palestra sobre ${theme} para minha empresa e gostaria de solicitar um orçamento.`;
  a.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  a.addEventListener("click", () => {
    // evento com taxonomia consistente (ver cro-e-copy.md)
    window.dataLayer?.push({ event: "click_whatsapp", cta_location: a.dataset.wa, theme });
  });
});
```

### Card (talk / feature)
- Cards **consistentes** em espaçamento e tokens — mas **não idênticos e
  chapados**: use hierarquia (o card em destaque pode ter tratamento diferente).
  Um único raio + a mesma sombra cinza em todo card é tell de template.
- Card clicável inteiro? Torne o card um link ou use "stretched link" acessível
  (o `a` do título cobre o card via `::after`), preservando foco no link real.

### Lista de benefícios
- Ícone monoline + título curto + 1 linha de apoio. Alinhamento consistente.
- **Numeração (01/02/03) só se for sequência real** (processo/etapas). Caso
  contrário, não numere.

### FAQ (acordeão acessível)
- Cada pergunta é um `button` com `aria-expanded`; a resposta é a região
  controlada. Funciona por teclado (Enter/Espaço). As perguntas matam objeções
  **e** capturam intenção de busca (ver `cro-e-copy.md` e schema FAQ em
  `performance-e-seo.md`).
```html
<div class="faq">
  <h3><button class="faq__q" aria-expanded="false" aria-controls="a1" id="q1">
    A palestra pode ser adaptada ao nosso público?</button></h3>
  <div class="faq__a" id="a1" role="region" aria-labelledby="q1" hidden>
    <p>Sim — o conteúdo é ajustado ao perfil da equipe e ao objetivo do evento.</p>
  </div>
</div>
```

### Prova social
- Números, logos de clientes, depoimentos — **sempre honestos e específicos**
  (número real > adjetivo vago). Depoimento com nome/cargo/empresa vale mais.

### Formulário (quando houver)
- Poucos campos (cada campo extra reduz conversão). `label` sempre associado.
  Validação **inline** e clara. Mensagens de erro dizem o que houve e como
  corrigir — na voz da interface, sem pedir desculpa nem ser vagas. Estado de
  sucesso confirma a ação.
- Em muitos casos, o **WhatsApp com mensagem pré-preenchida** é a via de menor
  fricção — prefira-o à conversão por formulário quando fizer sentido.

### Footer
- `footer` com navegação secundária, dados de contato/marca, links legais.
  Repita o CTA principal quando fizer sentido. Contraste e hierarquia mantidos.

### Relacionados / Próximo passo
- Grade de itens relacionados (outras páginas/temas) para navegação por
  intenção e reforço de SEO interno. Reaproveita o componente de card.
