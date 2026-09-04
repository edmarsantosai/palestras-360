# Checklist de QA — Antes de considerar uma entrega concluída

Rode antes de dizer "pronto". Se algo falhar, ajuste antes de entregar.

## Negócio & conversão
- [ ] Atende ao objetivo de negócio (gerar lead / ação primária)?
- [ ] A oferta é entendida em ~5s? Hero responde: o quê, para quem, formato/onde?
- [ ] CTA primário único, claro ("diz o que acontece") e **repetido** (hero, meio, fim, sticky mobile)?
- [ ] Mensagem de WhatsApp pré-preenchida e **contextual à página**?
- [ ] Conteúdo tem **intenção comercial própria** (nada de troca de palavras em escala)?

## Responsividade
- [ ] Mobile OK (hero, cards, menu, catálogo, leitura, espaçamento)?
- [ ] Tablet OK?
- [ ] Desktop OK?
- [ ] Nenhum ajuste de desktop quebrou mobile (e vice-versa)?

## Mobile & toque
- [ ] Alvos de toque ≥ 44–48px, com espaço entre eles?
- [ ] Ação primária ao alcance do polegar (sticky quando fizer sentido)?
- [ ] Botão de WhatsApp acessível e funcional?

## Performance (Core Web Vitals)
- [ ] LCP < 2,5s (imagem/fonte de LCP com preload + prioridade; sem render-blocking)?
- [ ] CLS < 0,1 (imagens com width/height; fonte com fallback métrica; sem injeção que empurra layout)?
- [ ] INP < 200ms (JS mínimo, defer, sem tarefas longas)?
- [ ] Imagens responsivas (srcset/sizes), AVIF/WebP, lazy abaixo da dobra?
- [ ] Nenhuma dependência pesada sem justificativa? CSS/JS enxutos?

## Acessibilidade (WCAG AA)
- [ ] Contraste ≥ 4,5:1 (texto normal) e ≥ 3:1 (texto grande / UI)?
- [ ] Hierarquia de headings correta (um h1; h2/h3 lógicos)?
- [ ] Foco de teclado **visível** em todos os interativos?
- [ ] Acordeão/menu operáveis por teclado (`aria-expanded`, região controlada)?
- [ ] `alt` descritivo nas imagens; significado não depende só de cor?
- [ ] `prefers-reduced-motion` respeitado?

## SEO on-page
- [ ] URL amigável, `title` único (~≤60), `meta description` única (~≤155)?
- [ ] HTML5 semântico (`header`/`nav`/`main`/`section`/`footer`)?
- [ ] Links internos + `canonical`?
- [ ] Dados estruturados (JSON-LD) fiéis ao conteúdo, quando aplicável?
- [ ] Open Graph + imagem social (1200×630)?

## Integridade técnica
- [ ] Todos os CTAs funcionam? Todos os links funcionam (sem 404)?
- [ ] Rastreamento com **taxonomia consistente** de eventos?
- [ ] Componentes reutilizáveis; **sem estilo solto ou código duplicado** sem necessidade?
- [ ] Nada quebrou de funcionalidades existentes (regressão verificada)?

## Distinção (anti-genérico)
- [ ] Sem logo, a página ainda tem identidade própria da marca?
- [ ] Existe **um** elemento memorável e específico?
- [ ] Nenhum default de "cara de IA" usado por preguiça (ver `references/anti-generico.md`)?
