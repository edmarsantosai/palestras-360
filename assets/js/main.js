/**
 * Palestras 360 — main.js
 * WhatsApp por tema · FAQ accordion · tracking (GA4/dataLayer) · scroll depth · sticky CTA
 *
 * Uso: P360.init('Outubro Rosa')  — chamar no DOMContentLoaded com o tema da página.
 *
 * ⚠️  ANTES DE PUBLICAR: substitua waPhone pelo número WhatsApp comercial
 *     no formato internacional: 55 + DDD + número (sem espaços ou traços).
 *     O 0800 484 1234 é telefone e NÃO funciona em links wa.me.
 */

'use strict';

const P360 = (() => {

  /* ── Configuração ─────────────────────────────────────────────────────────── */

  const cfg = {
    waPhone: '55XXXXXXXXXXX',  // <-- Substituir antes de publicar
    waTpl: (theme) =>
      `Olá! Tenho interesse na palestra sobre ${theme} para minha empresa e gostaria de solicitar um orçamento.`,
  };

  /* ── Tracking (GA4 / dataLayer) ───────────────────────────────────────────── */

  function track(event, params = {}) {
    if (!window.dataLayer) window.dataLayer = [];
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  }

  /* ── WhatsApp ─────────────────────────────────────────────────────────────── */

  function buildWALink(theme) {
    const msg = encodeURIComponent(cfg.waTpl(theme));
    return `https://wa.me/${cfg.waPhone}?text=${msg}`;
  }

  function initWAButtons() {
    document.querySelectorAll('[data-wa]').forEach((el) => {
      const theme    = el.dataset.waTheme    || 'Palestras Corporativas';
      const location = el.dataset.waLocation || 'page';
      const link     = buildWALink(theme);

      /* Atualiza href para acessibilidade e fallback sem JS */
      if (el.tagName === 'A') el.href = link;

      el.addEventListener('click', (e) => {
        if (el.tagName === 'A') e.preventDefault();
        track('click_whatsapp', { theme, cta_location: location });
        track('generate_lead',  { theme, source: 'whatsapp' });
        window.open(link, '_blank', 'noopener,noreferrer');
      });
    });
  }

  /* ── FAQ accordion ─────────────────────────────────────────────────────────── */

  function initFAQ() {
    document.querySelectorAll('.faq__item').forEach((item, i) => {
      const btn    = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      const answerId = `faq-answer-${i}`;
      answer.id = answerId;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', answerId);

      /* Estado inicial: fechado */
      answer.style.maxHeight  = '0';
      answer.style.overflow   = 'hidden';
      answer.style.opacity    = '0';
      answer.style.transition = [
        `max-height var(--duration-slow) var(--ease-out)`,
        `opacity    var(--duration-base) var(--ease-out)`,
      ].join(', ');

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        /* Fecha todos */
        document.querySelectorAll('.faq__item.is-open').forEach((open) => {
          open.classList.remove('is-open');
          const a = open.querySelector('.faq__answer');
          const b = open.querySelector('.faq__question');
          a.style.maxHeight = '0';
          a.style.opacity   = '0';
          b.setAttribute('aria-expanded', 'false');
        });

        /* Abre o clicado (se estava fechado) */
        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity   = '1';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Scroll depth ─────────────────────────────────────────────────────────── */

  function initScrollTracking(theme) {
    const milestones  = new Set();
    const checkpoints = [25, 50, 75, 100];

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = total > 0 ? Math.round(window.scrollY / total * 100) : 100;
      checkpoints.forEach((cp) => {
        if (pct >= cp && !milestones.has(cp)) {
          milestones.add(cp);
          track('scroll_depth', { percent: cp, theme });
        }
      });
    }, { passive: true });
  }

  /* ── Sticky CTA (mobile) ──────────────────────────────────────────────────── */

  function initStickyBtn() {
    const btn  = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');
    if (!btn || !hero) return;

    const obs = new IntersectionObserver(
      ([entry]) => btn.classList.toggle('is-visible', !entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(hero);
  }

  /* ── Header ao scroll ────────────────────────────────────────────────────── */

  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Smooth scroll para âncoras ─────────────────────────────────────────── */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id     = link.getAttribute('href');
        const target = id === '#' ? null : document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Tracking de cards de tema (catálogo) ────────────────────────────────── */

  function initThemeCards() {
    document.querySelectorAll('[data-theme-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const theme = card.dataset.themeCard;
        if (theme) track('select_theme', { theme });
      });
    });
  }

  /* ── Scroll reveal (IntersectionObserver) ───────────────────────────────── */

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    document.body.classList.add('js-reveal');

    const targets = document.querySelectorAll(
      '.section, .topic-card, .audience-card, .format-card, .faq__item, .related-card, .talk-card'
    );

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );

    targets.forEach((el) => obs.observe(el));
  }

  /* ── Inicialização pública ───────────────────────────────────────────────── */

  function init(theme) {
    if (!window.dataLayer) window.dataLayer = [];
    track('view_page', { page_type: 'talk', theme });
    track('view_talk', { theme });

    initWAButtons();
    initFAQ();
    initScrollTracking(theme);
    initStickyBtn();
    initHeader();
    initSmoothScroll();
    initThemeCards();
    initScrollReveal();
  }

  return { init, buildWALink, track };

})();
