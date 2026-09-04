# Performance (Core Web Vitals) e SEO On-Page

> Performance e SEO andam juntos: uma página rápida, semântica e bem estruturada
> ranqueia melhor e converte mais. As duas coisas dividem as mesmas causas
> (imagem pesada, fonte mal carregada, HTML confuso), por isso estão no mesmo
> arquivo.

## Índice
1. Core Web Vitals — metas e o que dirige cada uma
2. LCP — carregar o conteúdo principal rápido
3. CLS — zero saltos de layout
4. INP — resposta rápida à interação
5. Imagens
6. Fontes
7. CSS e JavaScript
8. Entrega (cache, compressão, HTTP)
9. SEO on-page (estrutura semântica)
10. Dados estruturados (JSON-LD)
11. Open Graph / social
12. E-E-A-T
13. WordPress (quando for o caso)

---

## 1. Core Web Vitals — metas

- **LCP** (Largest Contentful Paint) **< 2,5s** — rapidez do maior elemento visível.
- **INP** (Interaction to Next Paint) **< 200ms** — resposta às interações.
- **CLS** (Cumulative Layout Shift) **< 0,1** — estabilidade visual.

Questione sempre: **"Esta dependência/imagem/script é realmente necessária?"**

## 2. LCP

Geralmente o LCP é o headline do hero ou a imagem principal.
- **Sem render-blocking:** CSS crítico inline; o resto assíncrono. JS não
  bloqueante (`defer`).
- **Preload do recurso de LCP** (imagem/fonte do hero).
- **Imagem de LCP:** `fetchpriority="high"`, **sem** `loading="lazy"`, com
  `width/height` e formato moderno.
- **Fonte do LCP:** `preload` + `font-display: swap` (ver Fontes).
- CDN + compressão + servidor rápido ajudam o TTFB, que entra no LCP.

## 3. CLS (zero saltos)

- **Sempre** `width`/`height` (ou `aspect-ratio`) em imagens, vídeos, iframes e
  anúncios — reserva o espaço antes de carregar.
- Não injete conteúdo acima do que já está visível (banners, avisos) empurrando
  o layout.
- Fontes: use fallback métrica (`size-adjust`, `ascent-override`) para a troca
  não deslocar o texto (ver `tipografia.md`).
- Reserve espaço para elementos assíncronos (embeds, widgets).

## 4. INP

- **Menos JavaScript.** Cada script custa tempo de execução na thread principal.
- **Divida tarefas longas**; evite trabalho pesado no clique.
- **Delegação de eventos** em vez de centenas de listeners.
- `defer`/`async`; carregue não-crítico sob demanda (lazy/`import()`).

## 5. Imagens

- **Responsivas:** `srcset` + `sizes` para servir o tamanho certo por
  dispositivo.
- **Formatos modernos:** AVIF/WebP com fallback.
- **Lazy-load abaixo da dobra** (`loading="lazy"`); **eager + high priority** só
  no LCP.
- **Sempre com dimensões** (evita CLS).
```html
<img src="hero.avif" width="1200" height="675" fetchpriority="high"
     alt="Descrição objetiva e útil da imagem" decoding="async">
<img src="card.avif" width="640" height="360" loading="lazy" decoding="async"
     alt="...">
```

## 6. Fontes

Resumo (detalhes em `tipografia.md`): `preconnect`/`preload`, `font-display:
swap`, poucos pesos, **variable font**, subset (latin), self-host quando
possível, e fallback métrica para reduzir CLS. Stack de sistema como rede de
segurança.

## 7. CSS e JavaScript

- **CSS enxuto:** só o necessário; **crítico inline**, resto adiado. Evite
  frameworks pesados sem justificativa. Remova CSS não usado.
- **JS vanilla primeiro** (a stack padrão da LP). `defer` no `script`. Sem libs
  pesadas para o que dá para fazer nativo (IntersectionObserver para animações
  de scroll, por ex.). Sem dependências duplicadas.
- Cada biblioteca deve justificar o peso. Na dúvida, não inclua.

## 8. Entrega

- **Compressão** Brotli/Gzip. **HTTP/2 ou 3.**
- **Cache** de estáticos com hash no nome (cache longo + invalidação por versão).
- Minifique HTML/CSS/JS em produção.

## 9. SEO on-page (estrutura semântica)

Cada página deve ter:
- **URL amigável** (curta, com a intenção; ex.: `/palestras/setembro-amarelo`).
- **`title` único** (~≤ 60 caracteres, com a intenção comercial).
- **`meta description` única** (~≤ 155 caracteres, orientada a clique).
- **Um `h1` único**; `h2`/`h3` em hierarquia lógica.
- **HTML5 semântico:** `header`, `nav`, `main`, `section`, `article`, `footer`.
- **Links internos** (relacionados, catálogo) e **`canonical`**.
- **`alt`** descritivo em imagens.
- **Conteúdo específico e com intenção própria** por página — nunca troca de
  palavras em escala nem conteúdo duplicado. Texto natural, sem keyword
  stuffing.
```html
<head>
  <title>Palestra Setembro Amarelo para Empresas | Presencial e Online</title>
  <meta name="description" content="Palestra de Setembro Amarelo para empresas, presencial ou online, com conteúdo adaptado à sua equipe. Solicite um orçamento.">
  <link rel="canonical" href="https://exemplo.com.br/palestras/setembro-amarelo">
</head>
```

## 10. Dados estruturados (JSON-LD)

Adicione o que se aplica: `FAQPage`, `BreadcrumbList`, `Organization`/
`LocalBusiness`, `Service`, `Event` (para palestras/eventos), `Review`.
Exemplo — FAQ (casando com o acordeão da página):
```html
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[{
    "@type":"Question",
    "name":"A palestra pode ser adaptada ao nosso público?",
    "acceptedAnswer":{"@type":"Answer","text":"Sim, o conteúdo é ajustado ao perfil da equipe e ao objetivo do evento."}
  }]
}
</script>
```
Mantenha o JSON-LD **fiel ao conteúdo visível** da página (não invente dados).

## 11. Open Graph / social

```html
<meta property="og:title" content="Palestra Setembro Amarelo para Empresas">
<meta property="og:description" content="Presencial ou online, com conteúdo adaptado à sua equipe.">
<meta property="og:image" content="https://exemplo.com.br/og/setembro-amarelo.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```
Imagem OG 1200×630, texto legível em miniatura.

## 12. E-E-A-T

Experience, Expertise, Authoritativeness, Trust — sinais reais de credibilidade:
- Identidade/entidade clara (quem entrega, credenciais verdadeiras).
- Conteúdo específico e correto; cases e provas reais.
- Páginas de confiança (contato, sobre, políticas).
- Consistência de marca e dados. Nunca fabricar autoridade.

## 13. WordPress (quando for o caso)

- **Tema leve**; evite construtores pesados (Elementor/etc.) em páginas críticas
  de conversão — eles injetam CSS/JS que degradam CWV.
- **Mínimo de plugins**; cada plugin é peso e risco.
- **Cache** (plugin de cache/página) + **otimização de imagem** (AVIF/WebP,
  lazy) + **`defer`/combinação de JS**.
- Reaproveite os **mesmos tokens** (via CSS custom properties no tema) para
  consistência com o restante do ecossistema.
- Meça no PageSpeed/Lighthouse e trate os mesmos vitais (LCP/INP/CLS).
