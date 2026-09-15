# 🔬 CORREÇÃO PREMIUM — Auditoria com lupa (Score 100)

Site no ar, HTTPS OK, WhatsApp OK (0800 484 1234 testado e roteando). Agora
fechar os defeitos visuais/perf que separam "funcional" de "premium 100".
Investigue a causa de cada item (não aplique cego) e corrija. Reporte no fim.

---

## 🔴 P0 — BUGS VISUAIS (quebram o premium)

### 1. Ícones GIGANTES na seção "Por que contratar" (home)
Sintoma: os ícones dos 5 diferenciais renderizam ocupando a tela inteira
(símbolos de 400-500px), empurrando o conteúdo.
Causa provável: SVG inline sem `width`/`height` nem classe, herdando tamanho do
container; ou `svg { width: 100% }` sem `max-width`.
Correção: dê classe aos ícones (ex.: `.pq-icon`) com tamanho fixo:
```css
.pq-icon { width: 32px; height: 32px; flex-shrink: 0; color: var(--color-action); }
.pq-icon svg { width: 100%; height: 100%; display: block; }
```
Garanta `viewBox` nos SVGs e remova qualquer `width:100%` solto. Valide: os 5
itens ficam com ícone pequeno + título + descrição alinhados.

### 2. Ícones genéricos "⊞" repetidos em "Para quem é indicada"
Sintoma: os 5 cards usam o MESMO ícone de grade genérico.
Correção: ícones monoline contextuais e DIFERENTES por item — ex.:
empresa/prédio (`building-2`), equipe (`users`), RH/QVT (`heart-pulse` ou `briefcase`),
SIPAT/campanha (`shield-check` ou `calendar-check`), campanha interna (`megaphone`).
Mapeie por índice ou por um campo no JSON. Nunca repetir o mesmo ícone em todos.

### 3. Quadrados VAZIOS em "Principais Temas Abordados"
Sintoma: marcadores são quadrados ciano preenchidos, porém SEM símbolo dentro.
Correção: colocar um ícone de check branco dentro do quadrado, OU trocar por
número sequencial (01, 02...). O quadrado sozinho não comunica nada.
```css
.topico-marker { display:flex; align-items:center; justify-content:center; }
.topico-marker svg { width:16px; height:16px; color:#fff; }
```

### 4. Logo pequena demais (header e footer)
O aumento +30% header / +70% footer NÃO foi aplicado (continua igual aos prints
anteriores). Confirme o `height` real da `<img>` da logo:
- Header: subir para ~52-58px de altura de exibição
- Footer: subir para ~60-72px
Use os arquivos reais (`header-logo-*`, `footer-logo-white@2x.png`), `width:auto`.
Revalide que o header não quebra a altura.

### 5. Prova social em COLUNA ÚNICA com logos de tamanhos diferentes
Sintoma (home + página empresas-atendidas): logos empilhados verticalmente, um
gigante, outro médio — sem grid, sem uniformidade.
Causa provável: o container não é grid/flex-wrap, e as imgs não têm altura fixa.
Correção:
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
Desktop: 4-6 por linha. Mobile: 2-3 por linha. Altura uniforme obrigatória.
Isso vale para a faixa na home E para a página empresas-atendidas.

---

## 🟡 P1 — UI/UX PREMIUM

### 6. Header sem contraste no topo do hero
Sintoma: no topo (antes do scroll), os links do menu ficam brancos sobre a parte
clara da imagem do hero → baixa legibilidade.
Correção: adicione um gradiente de proteção atrás do header quando no topo:
```css
.site-header::before {
  content:""; position:absolute; inset:0; z-index:-1;
  background: linear-gradient(to bottom, rgba(13,33,55,.55), transparent);
  pointer-events:none;
}
.site-header.scrolled::before { background: var(--brand-900); }
```
Garanta contraste AA dos links em ambos os estados.

### 7. Transição "seca" entre páginas
Sintoma: a navegação de uma página pra outra é abrupta.
Correção leve (sem framework):
- Adicione `@view-transition { navigation: auto; }` (CSS View Transitions — suportado
  em Chrome/Edge, degrada suave nos demais).
- Fade-in de entrada no `<body>`: `body{animation:fadeIn .35s ease}` +
  `@keyframes fadeIn{from{opacity:0}to{opacity:1}}`.
- Respeite `prefers-reduced-motion: reduce` desativando as duas.

---

## 🟢 P2 — PERFORMANCE (confirmar e otimizar)

### 8. Imagens em AVIF + lazy + compressão do servidor
- Confirme que TODA imagem de conteúdo usa `<picture>` com fonte AVIF primeiro,
  depois WebP, depois JPG:
  ```html
  <picture>
    <source type="image/avif" srcset="...-1920w.avif 1920w, ...-1280w.avif 1280w, ...-768w.avif 768w" sizes="...">
    <source type="image/webp" srcset="...-1920w.webp 1920w, ...">
    <img src="...-1280w.jpg" width="1280" height="720" alt="..." loading="lazy" decoding="async">
  </picture>
  ```
- Hero de cada página: `fetchpriority="high"` e SEM `loading="lazy"` (está acima da dobra).
- Todas as demais imagens: `loading="lazy" decoding="async"`.
- Rode e me reporte:
  ```
  grep -rc "image/avif" palestra-setembro-amarelo/index.html index.html
  grep -rc "loading=\"lazy\"" index.html
  ```
- No `.htaccess`, confirme compressão + cache (Brotli/Gzip + Cache-Control para
  imagens/css/js com max-age longo e immutable):
  ```apache
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
  </IfModule>
  <IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
  </IfModule>
  ```
  (HostGator geralmente suporta mod_deflate/mod_expires; Brotli depende do servidor.)

---

## VALIDAÇÃO FINAL
- [ ] Nenhum ícone renderizando em tamanho gigante (home "Por que contratar")
- [ ] "Para quem" com ícones diferentes e contextuais
- [ ] "Principais temas" com check/número dentro do marcador
- [ ] Logo maior em header e footer (medir height)
- [ ] Prova social em grid uniforme (altura fixa, grayscale→cor no hover), home + página
- [ ] Header legível no topo do hero
- [ ] Transição suave entre páginas (com reduced-motion respeitado)
- [ ] AVIF confirmado em todas as imagens; hero com fetchpriority; resto lazy
- [ ] Lighthouse mobile home + setembro-amarelo: Perf ≥90, LCP <2.5s, CLS 0, SEO 100, A11y ≥95
- [ ] Re-gerar deploy e subir

Reporte por item: causa encontrada + correção aplicada + resultado do Lighthouse.
