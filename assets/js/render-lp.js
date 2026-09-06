#!/usr/bin/env node
'use strict';

/**
 * Palestras 360 — Gerador de páginas estáticas.
 * Lê assets/data/palestras.json + assets/data/images.json e gera:
 *   - /palestra-<slug>/index.html  (palestras com status "publicar")
 *   - /index.html                  (catálogo home)
 *   - /sitemap.xml
 *   - /robots.txt
 *
 * Uso: node assets/js/render-lp.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT     = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'assets', 'data');

const PALESTRAS = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'palestras.json'), 'utf-8'));
const IMAGES    = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'images.json'),    'utf-8'));

const { meta, categorias, palestras: TALKS } = PALESTRAS;
const { whatsapp: WA_PHONE, whatsapp_exibicao: WA_DISPLAY } = meta.contato;
const DOMAIN   = `https://${meta.dominio}`;
const CAT_MAP  = Object.fromEntries(categorias.map(c => [c.id, c.nome]));
const TALK_MAP = Object.fromEntries(TALKS.map(t => [t.slug, t]));

// ── SVG ícones por categoria ──────────────────────────────────────────────

const CAT_ICON = {
  campanhas:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  'saude-mental':    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3A5.5 5.5 0 0 0 4 8.5c0 2.3 1.3 4.3 3.2 5.4V20h9v-6.1c1.9-1.1 3.2-3.1 3.2-5.4A5.5 5.5 0 0 0 14 3a5.5 5.5 0 0 0-4.5 0z"/></svg>`,
  seguranca:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4v6c0 4.4-3.8 8.5-9 10C6.8 20.5 3 16.4 3 12V6l9-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
  'saude-qualidade': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z"/></svg>`,
  ergonomia:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><path d="M12 7.5v6M7.5 16h9M8 16l-1.5 5h11L16 16"/></svg>`,
  lideranca:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  diversidade:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="15" cy="7" r="3"/><path d="M3 19c0-3 2.7-5 6-5h6c3.3 0 6 2 6 5"/></svg>`,
};

const FORMAT_DATA = {
  presencial:    {
    title: 'Presencial',
    desc:  'Palestra ao vivo na sua empresa, para grupos de qualquer tamanho.',
    icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  },
  online:        {
    title: 'Online ao Vivo',
    desc:  'Realizada via Zoom, Teams ou Meet — sem deslocamento, com a mesma experiência.',
    icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="15" height="10" rx="2"/><polygon points="17 9 22 6 22 18 17 15"/></svg>`,
  },
  personalizada: {
    title: 'Personalizada',
    desc:  'Conteúdo e dinâmica adaptados ao seu público, setor e objetivo corporativo.',
    icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/></svg>`,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function waLink(theme) {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse na palestra sobre ${theme} para minha empresa e gostaria de solicitar um orçamento.`
  );
  return `https://wa.me/${WA_PHONE}?text=${msg}`;
}

const SVG_WA = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.6-.8-2.7-1.8-3.6-3.3-.3-.5.3-.4.8-1.5.1-.2 0-.3 0-.5-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.6.2-1.1.1-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.4 5.2L2 22l4.9-1.3C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`;

const SVG_CHECK = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SVG_ARROW = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SVG_PLUS = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 2v8M2 6h8"/></svg>`;

const SVG_BUILDING = `<svg class="audience-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`;

// ── Header ────────────────────────────────────────────────────────────────

function buildHeader() {
  return `  <header class="site-header" role="banner">
    <div class="container">
      <div class="header__inner">
        <a href="/" class="logo" aria-label="Palestras 360 — Página inicial">
          <span class="logo__palestras">PALESTRAS</span>
          <span class="logo__360">360</span>
        </a>
        <nav class="header__nav" aria-label="Navegação principal">
          <a href="/" class="nav__link">Catálogo</a>
          <a href="/palestra-sipat/" class="nav__link">SIPAT</a>
          <a href="tel:08006055544" class="nav__phone">${WA_DISPLAY}</a>
        </nav>
      </div>
    </div>
  </header>`;
}

// ── Footer ────────────────────────────────────────────────────────────────

function buildFooter() {
  const year = new Date().getFullYear();
  return `  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="/" class="logo" aria-label="Palestras 360">
            <span class="logo__palestras">PALESTRAS</span>
            <span class="logo__360">360</span>
          </a>
          <p class="footer__tagline">Central Nacional de Palestras Corporativas. Mais de 40 temas, presencial ou online, em todo o Brasil.</p>
          <p class="footer__phone"><a href="tel:08006055544">${WA_DISPLAY}</a></p>
        </div>
        <div>
          <p class="footer__col-title">Palestras</p>
          <ul class="footer__links">
            <li><a href="/palestra-setembro-amarelo/">Setembro Amarelo</a></li>
            <li><a href="/palestra-outubro-rosa/">Outubro Rosa</a></li>
            <li><a href="/palestra-novembro-azul/">Novembro Azul</a></li>
            <li><a href="/palestra-saude-mental/">Saúde Mental</a></li>
            <li><a href="/palestra-sipat/">SIPAT</a></li>
            <li><a href="/">Ver catálogo completo</a></li>
          </ul>
        </div>
        <div>
          <p class="footer__col-title">Contato</p>
          <ul class="footer__links">
            <li><a href="tel:08006055544">${WA_DISPLAY}</a></li>
            <li><a href="${waLink('Palestras Corporativas')}" target="_blank" rel="noopener">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; ${year} Palestras 360. Todos os direitos reservados.</span>
        <span>Palestras corporativas para empresas de todo o Brasil.</span>
      </div>
    </div>
  </footer>`;
}

// ── Hero picture ──────────────────────────────────────────────────────────

function heroPicture(slug, imgData) {
  const base   = `/assets/img/${slug}/${imgData.hero_base}`;
  const widths  = imgData.larguras;
  const fmts    = imgData.formatos;
  let s = '    <picture>\n';
  if (fmts.includes('avif')) {
    s += `      <source type="image/avif" srcset="${widths.map(w => `${base}-${w}w.avif ${w}w`).join(', ')}" sizes="100vw">\n`;
  }
  if (fmts.includes('webp')) {
    s += `      <source type="image/webp" srcset="${widths.map(w => `${base}-${w}w.webp ${w}w`).join(', ')}" sizes="100vw">\n`;
  }
  s += `      <img class="hero__img" src="${base}-1920w.jpg" alt="${esc(imgData.alt)}" fetchpriority="high" decoding="async" width="1920" height="1080">\n    </picture>`;
  return s;
}

function preloadHero(slug, imgData) {
  if (!imgData) return '';
  const base   = `/assets/img/${slug}/${imgData.hero_base}`;
  const widths  = imgData.larguras;
  const srcset  = widths.map(w => `${base}-${w}w.avif ${w}w`).join(', ');
  return `  <link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="100vw" type="image/avif">`;
}

// ── Thumb picture ─────────────────────────────────────────────────────────

function thumbPicture(slug, imgData, sizes) {
  if (!imgData || !imgData.thumb) return null;
  const th   = imgData.thumb;
  const base = `/assets/img/${slug}/thumb/${th.base}`;
  const fmts = th.formatos;
  const sz   = sizes || '(max-width:639px) calc(100vw - 3rem),(max-width:1023px) calc(50vw - 3rem),320px';
  const w0   = th.larguras[0];
  const h0   = Math.round(w0 * 3 / 4);
  let s = '<picture>\n';
  if (fmts.includes('avif')) {
    s += `          <source type="image/avif" srcset="${th.larguras.map(w => `${base}-${w}w.avif ${w}w`).join(', ')}" sizes="${sz}">\n`;
  }
  if (fmts.includes('webp')) {
    s += `          <source type="image/webp" srcset="${th.larguras.map(w => `${base}-${w}w.webp ${w}w`).join(', ')}" sizes="${sz}">\n`;
  }
  s += `          <img class="talk-card__thumb-img" src="${base}-${w0}w.jpg" alt="${esc(imgData.alt)}" loading="lazy" width="${w0}" height="${h0}">\n        </picture>`;
  return s;
}

function catPlaceholder(catId) {
  return `<div class="thumb-placeholder" aria-hidden="true">${CAT_ICON[catId] || CAT_ICON.campanhas}</div>`;
}

// ── JSON-LD ───────────────────────────────────────────────────────────────

function jsonLdLP(talk, imgData) {
  const url   = `${DOMAIN}/palestra-${talk.slug}/`;
  const ogImg = imgData ? `${DOMAIN}/assets/img/${talk.slug}/${imgData.hero_base}-1920w.jpg` : null;

  const graph = [
    {
      '@type': 'Service',
      '@id':   `${url}#service`,
      name:    talk.h1,
      description: talk.meta_description,
      provider: { '@type': 'Organization', name: 'Palestras 360', url: DOMAIN },
      areaServed: { '@type': 'Country', name: 'Brazil' },
      url,
      ...(ogImg ? { image: ogImg } : {}),
    },
  ];

  if (talk.faq && talk.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id':   `${url}#faq`,
      mainEntity: talk.faq.map(item => ({
        '@type': 'Question',
        name:    item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function jsonLdHome() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type':    'Organization',
    '@id':      `${DOMAIN}/#org`,
    name:       'Palestras 360',
    url:        DOMAIN,
    description:'Central Nacional de Palestras Corporativas para Empresas de Todo o Brasil.',
    areaServed: { '@type': 'Country', name: 'Brazil' },
    contactPoint: {
      '@type':           'ContactPoint',
      telephone:         '+55-0800-605-5544',
      contactType:       'customer service',
      availableLanguage: 'Portuguese',
    },
  }, null, 2);
}

// ── GTM placeholder ───────────────────────────────────────────────────────

const GTM_HEAD = `  <!-- Google Tag Manager — substituir GTM-XXXXXXX pelo ID real antes de publicar -->
  <!--
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  -->`;

const GTM_BODY = `  <!-- Google Tag Manager (noscript) — substituir GTM-XXXXXXX antes de publicar -->
  <!--
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  -->`;

// ── LP sections ───────────────────────────────────────────────────────────

function sectionHero(talk, imgData) {
  const catNome = CAT_MAP[talk.categoria] || '';
  const twa     = talk.tema_whatsapp;
  const checks  = meta.hero_padrao.checks;

  const bg = imgData
    ? `    <div class="hero__bg">\n${heroPicture(talk.slug, imgData)}\n      <div class="hero__overlay" aria-hidden="true"></div>\n    </div>`
    : '';

  return `  <section class="hero" id="topo" aria-label="Apresentação da palestra">
${bg}
    <div class="container">
      <div class="hero__content">
        <nav class="breadcrumb" aria-label="Localização">
          <a href="/">Palestras 360</a>
          <span class="breadcrumb__sep" aria-hidden="true">›</span>
          <span>${esc(catNome)}</span>
          <span class="breadcrumb__sep" aria-hidden="true">›</span>
          <span class="breadcrumb__current">${esc(talk.titulo)}</span>
        </nav>
        <div class="hero__badge" aria-hidden="true">
          <span class="hero__badge-icon">✦</span>
          PALESTRAS CORPORATIVAS · NACIONAL
        </div>
        <h1 class="hero__h1">${esc(talk.h1)}</h1>
        <p class="hero__subtitle">${esc(meta.hero_padrao.subtitulo)}</p>
        <div class="hero__actions">
          <a href="${waLink(twa)}" class="btn btn--action btn--lg" data-wa data-wa-theme="${esc(twa)}" data-wa-location="Hero" target="_blank" rel="noopener noreferrer">
            ${SVG_WA} ${esc(meta.hero_padrao.cta)}
          </a>
        </div>
        <ul class="hero__trust" role="list">
          ${checks.map(c => `<li class="hero__trust-item">
            <span class="hero__trust-check" aria-hidden="true">${SVG_CHECK}</span>
            ${esc(c)}
          </li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>`;
}

function sectionSobre(talk) {
  return `  <section class="section" id="sobre" aria-labelledby="sobre-h2">
    <div class="container--narrow">
      <div class="section__header">
        <span class="section__label">Sobre a Palestra</span>
        <h2 class="section__title" id="sobre-h2">O que é esta palestra</h2>
      </div>
      <p class="sobre__lead">${esc(talk.frase)}</p>
      <p class="sobre__body">${esc(talk.intro)}</p>
      ${talk.sobre ? `<p class="sobre__body" style="margin-top:var(--space-4)">${esc(talk.sobre)}</p>` : ''}
    </div>
  </section>`;
}

function sectionTopicos(talk) {
  const cards = talk.topicos.map((t, i) => `        <div class="topic-card" role="listitem">
          <span class="topic-card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <span class="topic-card__text">${esc(t)}</span>
        </div>`).join('\n');

  return `  <section class="section" style="background-color:var(--color-surface)" id="topicos" aria-labelledby="topicos-h2">
    <div class="container">
      <div class="section__header">
        <span class="section__label">Conteúdo</span>
        <h2 class="section__title" id="topicos-h2">Principais Temas Abordados</h2>
      </div>
      <div class="topics__grid" role="list">
${cards}
      </div>
    </div>
  </section>`;
}

function sectionParaQuem(talk) {
  const cards = talk.para_quem.map(pq => `        <div class="audience-card" role="listitem">
          ${SVG_BUILDING}
          <p class="audience-card__title">${esc(pq)}</p>
        </div>`).join('\n');

  return `  <section class="section" id="para-quem" aria-labelledby="paraquem-h2">
    <div class="container">
      <div class="section__header">
        <span class="section__label">Público-Alvo</span>
        <h2 class="section__title" id="paraquem-h2">Para Quem é Indicada</h2>
        <p class="section__subtitle">Palestra indicada para empresas que valorizam saúde, segurança e qualidade de vida.</p>
      </div>
      <div class="audience__grid" role="list">
${cards}
      </div>
    </div>
  </section>`;
}

function sectionFormatos(talk) {
  const fmts = (talk.formatos || ['presencial', 'online', 'personalizada'])
    .map(f => FORMAT_DATA[f])
    .filter(Boolean);

  const cards = fmts.map(f => `        <div class="format-card" role="listitem">
          <div class="format-card__icon" aria-hidden="true">${f.icon}</div>
          <h3 class="format-card__title">${esc(f.title)}</h3>
          <p class="format-card__desc">${esc(f.desc)}</p>
        </div>`).join('\n');

  return `  <section class="section section--brand" id="formatos" aria-labelledby="formatos-h2">
    <div class="container">
      <div class="section__header">
        <span class="section__label">Modalidades</span>
        <h2 class="section__title" id="formatos-h2">Formatos Disponíveis</h2>
      </div>
      <div class="formats__grid" role="list">
${cards}
      </div>
    </div>
  </section>`;
}

function sectionFAQ(talk) {
  const twa   = talk.tema_whatsapp;
  const items = talk.faq.map(item => `        <div class="faq__item" role="listitem">
          <button class="faq__question" type="button">
            ${esc(item.q)}
            <span class="faq__icon">${SVG_PLUS}</span>
          </button>
          <div class="faq__answer">${esc(item.a)}</div>
        </div>`).join('\n');

  return `  <section class="section" id="faq" aria-labelledby="faq-h2">
    <div class="container">
      <div class="section__header" style="text-align:center">
        <span class="section__label">Dúvidas Frequentes</span>
        <h2 class="section__title" id="faq-h2">FAQ</h2>
      </div>
      <div class="faq__list" role="list">
${items}
      </div>
      <div class="faq__cta">
        <p style="font-size:var(--text-base);color:var(--color-text-2);margin-bottom:var(--space-5)">Tem outra dúvida? Fale pelo WhatsApp:</p>
        <a href="${waLink(twa)}" class="btn btn--ghost-dark" data-wa data-wa-theme="${esc(twa)}" data-wa-location="FAQ" target="_blank" rel="noopener noreferrer">
          ${SVG_WA} Tirar dúvida pelo WhatsApp
        </a>
      </div>
    </div>
  </section>`;
}

function sectionCTA(talk) {
  const twa = talk.tema_whatsapp;
  return `  <section class="section section--dark cta-section" id="orcamento" aria-labelledby="cta-h2">
    <div class="container--narrow">
      <p class="cta-section__eyebrow">Próximo passo</p>
      <h2 class="cta-section__title" id="cta-h2">Leve esta palestra para sua empresa</h2>
      <p class="cta-section__sub">Atendimento nacional — presencial ou online. Solicite seu orçamento agora.</p>
      <a href="${waLink(twa)}" class="btn btn--action btn--lg" data-wa data-wa-theme="${esc(twa)}" data-wa-location="Final" target="_blank" rel="noopener noreferrer">
        ${SVG_WA} ${esc(meta.hero_padrao.cta)}
      </a>
      <p class="cta-section__phone">Ou ligue: <a href="tel:08006055544">${WA_DISPLAY}</a></p>
    </div>
  </section>`;
}

function sectionRelacionadas(talk) {
  if (!talk.relacionadas || !talk.relacionadas.length) return '';

  const related = talk.relacionadas.slice(0, 3).map(s => TALK_MAP[s]).filter(Boolean);
  if (!related.length) return '';

  const cards = related.map(r => {
    const imgR    = IMAGES[r.slug];
    const isPubl  = r.status === 'publicar';
    const catNome = CAT_MAP[r.categoria] || '';

    let thumbHtml;
    if (imgR && imgR.thumb) {
      const th   = imgR.thumb;
      const base = `/assets/img/${r.slug}/thumb/${th.base}`;
      const sz   = '(max-width:767px) 100vw,(max-width:1023px) 50vw,33vw';
      const w0   = th.larguras[0];
      const h0   = Math.round(w0 * 3 / 4);
      thumbHtml = `<picture>
          ${th.formatos.includes('avif') ? `<source type="image/avif" srcset="${th.larguras.map(w => `${base}-${w}w.avif ${w}w`).join(', ')}" sizes="${sz}">` : ''}
          ${th.formatos.includes('webp') ? `<source type="image/webp" srcset="${th.larguras.map(w => `${base}-${w}w.webp ${w}w`).join(', ')}" sizes="${sz}">` : ''}
          <img src="${base}-${w0}w.jpg" alt="${esc(imgR.alt)}" loading="lazy" width="${w0}" height="${h0}" style="width:100%;height:100%;object-fit:cover">
        </picture>`;
    } else {
      thumbHtml = catPlaceholder(r.categoria);
    }

    const soonBadge = !isPubl
      ? `<span class="related-card__tag" style="left:auto;right:var(--space-3);background:rgba(0,188,212,.85);color:#04222A">Em breve</span>`
      : '';

    const inner = `
      <div class="related-card__img-wrap">
        ${thumbHtml}
        <span class="related-card__tag">${esc(catNome)}</span>
        ${soonBadge}
      </div>
      <div class="related-card__body">
        <h3 class="related-card__title">${esc(r.titulo)}</h3>
        ${r.resumo ? `<p class="related-card__desc">${esc(r.resumo.substring(0, 100))}…</p>` : ''}
        ${isPubl ? `<span class="related-card__link">Ver palestra ${SVG_ARROW}</span>` : ''}
      </div>`;

    return isPubl
      ? `      <a href="/palestra-${r.slug}/" class="related-card" data-theme-card="${esc(r.slug)}">${inner}</a>`
      : `      <div class="related-card" data-theme-card="${esc(r.slug)}">${inner}</div>`;
  }).join('\n');

  return `  <section class="section" style="background-color:var(--color-surface)" id="relacionadas" aria-labelledby="rel-h2">
    <div class="container">
      <div class="section__header">
        <span class="section__label">Veja também</span>
        <h2 class="section__title" id="rel-h2">Palestras Relacionadas</h2>
      </div>
      <div class="related__grid">
${cards}
      </div>
    </div>
  </section>`;
}

function buildStickyCTA(twa) {
  return `  <div class="sticky-cta" aria-hidden="true">
    <a href="${waLink(twa)}" class="btn btn--action btn--full" data-wa data-wa-theme="${esc(twa)}" data-wa-location="Sticky">
      ${SVG_WA} SOLICITAR ORÇAMENTO
    </a>
  </div>`;
}

// ── LP completo ───────────────────────────────────────────────────────────

function buildLP(talk) {
  const imgData  = IMAGES[talk.slug] || null;
  const url      = `${DOMAIN}/palestra-${talk.slug}/`;
  const ogImg    = imgData ? `${DOMAIN}/assets/img/${talk.slug}/${imgData.hero_base}-1920w.jpg` : '';
  const keywords = (talk.keywords || []).join(', ');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${GTM_HEAD}
  <title>${esc(talk.meta_title)}</title>
  <meta name="description" content="${esc(talk.meta_description)}">
  ${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ''}
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(talk.meta_title)}">
  <meta property="og:description" content="${esc(talk.meta_description)}">
  ${ogImg ? `<meta property="og:image" content="${ogImg}">
  <meta property="og:image:width" content="1920">
  <meta property="og:image:height" content="1080">` : ''}
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Palestras 360">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/montserrat-700-800-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/open-sans-400-600-latin.woff2" crossorigin>
  ${preloadHero(talk.slug, imgData)}
  <link rel="stylesheet" href="/assets/css/main.css">
  <script type="application/ld+json">
${jsonLdLP(talk, imgData)}
  </script>
</head>
<body>
${GTM_BODY}

${buildHeader()}

  <main id="main" tabindex="-1">
${sectionHero(talk, imgData)}
${sectionSobre(talk)}
${sectionTopicos(talk)}
${sectionParaQuem(talk)}
${sectionFormatos(talk)}
${sectionFAQ(talk)}
${sectionCTA(talk)}
${sectionRelacionadas(talk)}
  </main>

${buildFooter()}

${buildStickyCTA(talk.tema_whatsapp)}

  <script src="/assets/js/main.js" defer></script>
  <script>document.addEventListener('DOMContentLoaded',()=>P360.init('${esc(talk.tema_whatsapp)}'));</script>
</body>
</html>`;
}

// ── Talk card (grid home) ─────────────────────────────────────────────────

function talkCard(talk) {
  const isPubl  = talk.status === 'publicar';
  const imgData = IMAGES[talk.slug];
  const catNome = CAT_MAP[talk.categoria] || '';
  const sz      = '(max-width:639px) calc(100vw - 3rem),(max-width:1023px) calc(50vw - 3rem),320px';

  let thumbHtml;
  if (imgData && imgData.thumb) {
    const th   = imgData.thumb;
    const base = `/assets/img/${talk.slug}/thumb/${th.base}`;
    const w0   = th.larguras[0];
    const h0   = Math.round(w0 * 3 / 4);
    thumbHtml = `<picture>
          ${th.formatos.includes('avif') ? `<source type="image/avif" srcset="${th.larguras.map(w => `${base}-${w}w.avif ${w}w`).join(', ')}" sizes="${sz}">` : ''}
          ${th.formatos.includes('webp') ? `<source type="image/webp" srcset="${th.larguras.map(w => `${base}-${w}w.webp ${w}w`).join(', ')}" sizes="${sz}">` : ''}
          <img class="talk-card__thumb-img" src="${base}-${w0}w.jpg" alt="${esc(imgData.alt)}" loading="lazy" width="${w0}" height="${h0}">
        </picture>`;
  } else {
    thumbHtml = catPlaceholder(talk.categoria);
  }

  const badge = isPubl
    ? `<span class="talk-card__badge talk-card__badge--new">Disponível</span>`
    : `<span class="talk-card__badge talk-card__badge--soon">Em breve</span>`;

  const inner = `
      <div class="talk-card__thumb">
        ${thumbHtml}
        ${badge}
      </div>
      <div class="talk-card__body">
        <span class="talk-card__cat">${esc(catNome)}</span>
        <h3 class="talk-card__title">${esc(talk.titulo)}</h3>
        ${isPubl ? `<span class="talk-card__link-hint">Ver palestra ${SVG_ARROW}</span>` : ''}
      </div>`;

  if (isPubl) {
    return `        <a href="/palestra-${talk.slug}/" class="talk-card" data-category="${talk.categoria}" data-theme-card="${esc(talk.slug)}" aria-label="Ver palestra: ${esc(talk.titulo)}">${inner}</a>`;
  }
  return `        <div class="talk-card talk-card--soon" data-category="${talk.categoria}" data-theme-card="${esc(talk.slug)}" aria-label="${esc(talk.titulo)} — em breve" aria-disabled="true">${inner}</div>`;
}

// ── Home ──────────────────────────────────────────────────────────────────

function buildHome() {
  const title = 'Palestras Corporativas para Empresas de Todo o Brasil | Palestras 360';
  const desc  = 'Central de palestras corporativas com mais de 40 temas: saúde, segurança, diversidade, liderança e mais. Presencial ou online. Atendimento nacional.';

  const filterBtns = [
    { id: 'all', nome: 'Todos os temas' },
    ...categorias,
  ].map((c, i) =>
    `          <button class="cat-filter__btn${i === 0 ? ' is-active' : ''}" data-filter="${c.id}" type="button">${esc(c.nome)}</button>`
  ).join('\n');

  const cards = TALKS.map(talkCard).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${GTM_HEAD}
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${DOMAIN}/">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${DOMAIN}/">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Palestras 360">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/montserrat-700-800-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/open-sans-400-600-latin.woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/main.css">
  <script type="application/ld+json">
${jsonLdHome()}
  </script>
</head>
<body>
${GTM_BODY}

${buildHeader()}

  <main id="main" tabindex="-1">

    <section class="hero hero--home" id="topo" aria-label="Palestras 360 — Central Nacional">
      <div class="container">
        <div class="hero__content">
          <div class="hero__badge" aria-hidden="true">
            <span class="hero__badge-icon">✦</span>
            PALESTRAS CORPORATIVAS · MAIS DE 40 TEMAS
          </div>
          <h1 class="hero__h1">Palestras Corporativas para Empresas de Todo o Brasil</h1>
          <p class="hero__subtitle">Presencial ou online. Temas de saúde, segurança, campanhas e muito mais — atendimento nacional o ano inteiro.</p>
          <div class="hero__actions">
            <a href="#catalogo" class="btn btn--ghost">Ver Catálogo</a>
            <a href="${waLink('Palestras Corporativas')}" class="btn btn--action btn--lg" data-wa data-wa-theme="Palestras Corporativas" data-wa-location="Hero" target="_blank" rel="noopener noreferrer">
              ${SVG_WA} Solicitar Orçamento
            </a>
          </div>
          <ul class="hero__trust" role="list">
            ${meta.value_props_home.slice(0, 4).map(v => `<li class="hero__trust-item">
            <span class="hero__trust-check" aria-hidden="true">${SVG_CHECK}</span>
            ${esc(v)}
          </li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </section>

    <div class="value-band" role="complementary" aria-label="Destaques">
      <div class="container">
        <ul class="value-band__inner" role="list">
          <li class="value-band__item">${SVG_CHECK} Mais de 40 temas</li>
          <li class="value-band__sep" aria-hidden="true"></li>
          <li class="value-band__item">${SVG_CHECK} Presencial ou Online</li>
          <li class="value-band__sep" aria-hidden="true"></li>
          <li class="value-band__item">${SVG_CHECK} O ano todo</li>
          <li class="value-band__sep" aria-hidden="true"></li>
          <li class="value-band__item">${SVG_CHECK} Atendimento nacional</li>
        </ul>
      </div>
    </div>

    <section class="catalogue" id="catalogo" aria-labelledby="catalogo-h2">
      <div class="container">
        <div class="section__header">
          <span class="section__label">Catálogo Completo</span>
          <h2 class="section__title" id="catalogo-h2">Mais de 40 Temas Disponíveis</h2>
          <p class="section__subtitle">Selecione uma categoria para filtrar:</p>
        </div>
        <div class="cat-filter" role="group" aria-label="Filtro por categoria">
${filterBtns}
        </div>
        <div class="catalogue__grid" id="catalogue-grid">
${cards}
        </div>
      </div>
    </section>

    <section class="section section--dark cta-section" aria-labelledby="home-cta-h2">
      <div class="container--narrow">
        <p class="cta-section__eyebrow">Solicite sua proposta</p>
        <h2 class="cta-section__title" id="home-cta-h2">Pronto para contratar uma palestra?</h2>
        <p class="cta-section__sub">Atendimento nacional, presencial ou online. Fale agora pelo WhatsApp e receba uma proposta personalizada.</p>
        <a href="${waLink('Palestras Corporativas')}" class="btn btn--action btn--lg" data-wa data-wa-theme="Palestras Corporativas" data-wa-location="Final" target="_blank" rel="noopener noreferrer">
          ${SVG_WA} SOLICITAR ORÇAMENTO PELO WHATSAPP
        </a>
        <p class="cta-section__phone">Ou ligue: <a href="tel:08006055544">${WA_DISPLAY}</a></p>
      </div>
    </section>

  </main>

${buildFooter()}

  <div class="sticky-cta" aria-hidden="true">
    <a href="${waLink('Palestras Corporativas')}" class="btn btn--action btn--full" data-wa data-wa-theme="Palestras Corporativas" data-wa-location="Sticky">
      ${SVG_WA} SOLICITAR ORÇAMENTO
    </a>
  </div>

  <script src="/assets/js/main.js" defer></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      P360.init('Palestras Corporativas');

      const btns  = document.querySelectorAll('.cat-filter__btn');
      const cards = document.querySelectorAll('#catalogue-grid [data-category]');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const filter = btn.dataset.filter;
          cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
        });
      });
    });
  </script>
</body>
</html>`;
}

// ── Sitemap + Robots ──────────────────────────────────────────────────────

function buildSitemap(publicar) {
  const today = new Date().toISOString().split('T')[0];
  const urls  = [
    `  <url>\n    <loc>${DOMAIN}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n    <lastmod>${today}</lastmod>\n  </url>`,
    ...publicar.map(t =>
      `  <url>\n    <loc>${DOMAIN}/palestra-${t.slug}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
    ),
  ].join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  const publicar = TALKS.filter(t => t.status === 'publicar');
  console.log(`\nGerando ${publicar.length} LPs + home + sitemap + robots...\n`);

  for (const talk of publicar) {
    const dir = path.join(ROOT, `palestra-${talk.slug}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildLP(talk), 'utf-8');
    console.log(`[ok] palestra-${talk.slug}/index.html`);
  }

  fs.writeFileSync(path.join(ROOT, 'index.html'),   buildHome(),          'utf-8');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),  buildSitemap(publicar),'utf-8');
  fs.writeFileSync(path.join(ROOT, 'robots.txt'),   buildRobots(),         'utf-8');
  console.log('[ok] index.html');
  console.log('[ok] sitemap.xml');
  console.log('[ok] robots.txt');
  console.log('\nPronto!\n');
}

main();
