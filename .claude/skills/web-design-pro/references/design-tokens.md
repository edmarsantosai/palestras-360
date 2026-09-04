# Design Tokens — Arquitetura do Sistema

> Fonte única de verdade para cor, tipografia, espaço, raio, sombra, movimento e
> layout. Tokens dão **consistência**, permitem **escalar** para centenas de
> páginas e possibilitam **temar** sem reescrever. Regra: **nada de valor
> "mágico" solto no CSS** — tudo referencia um token.

## Índice
1. As três camadas de token
2. Convenção de nomes
3. Como derivar da marca (logo → sistema)
4. Escalas de referência (espaço, raio, sombra, motion, breakpoints, container, z-index)
5. Cor e tipografia (ponteiros)
6. Checklist de tokens

---

## 1. As três camadas

- **Primitivos (raw):** os valores brutos. Ex.: `--blue-700: #1B3A6A`, `--space-6: 1.5rem`. Não usados direto em componentes.
- **Semânticos (de intenção):** dizem *para quê* servem. Ex.: `--color-brand`, `--color-action`, `--color-text`, `--color-surface`, `--space-section`. É a camada que os componentes usam.
- **De componente (opcional):** quando um componente precisa afinar algo. Ex.: `--btn-padding-y`, `--card-radius`. Sempre apontando para semânticos/primitivos.

Isto permite trocar a marca inteira mudando os primitivos, ou criar dark mode
remapeando só os semânticos — sem tocar nos componentes.

---

## 2. Convenção de nomes

- Tudo em `--kebab-case`, prefixado por categoria: `--color-*`, `--space-*`,
  `--radius-*`, `--shadow-*`, `--font-*`, `--text-*`, `--leading-*`,
  `--duration-*`, `--ease-*`, `--z-*`, `--container-*`.
- Escalas numéricas seguem uma ordem previsível (menor → maior). Prefira escala
  por "degraus" (`--space-1..--space-12`) a nomes soltos.
- Cor: primitivo por matiz + peso (`--navy-500`); semântico por função
  (`--color-action`). Nunca nomeie semântico pela cor ("--color-blue-button") —
  isso quebra quando a marca muda.

---

## 3. Como derivar da marca (logo → sistema)

Passo a passo para transformar 1–2 cores de marca em um sistema completo:

1. **Extraia** as cores dominantes do logo/marca (ex.: um navy e um ciano).
2. **Defina papéis:** a cor mais institucional vira `--color-brand`; a mais
   vibrante e de melhor contraste sobre fundo claro vira `--color-action` (CTA).
   Se as duas competem por atenção, **escolha uma só para ação**.
3. **Gere a rampa de cada matiz** (50→900) por tints/shades ou, melhor, em
   espaço perceptual (OKLCH) para manter contraste uniforme. Ver
   `cor-e-contraste.md`.
4. **Construa os neutros** (fundo, superfície, borda, texto) — cinzas com uma
   leve temperatura puxada da marca ficam mais coesos que cinza puro.
5. **Semânticos de estado:** success / warning / danger / info.
6. **Tipografia:** escolha 1–2 famílias coerentes com a marca (ver
   `tipografia.md`) e crie a escala.
7. **Espaço/raio/sombra/motion:** use as escalas da seção 4 como ponto de
   partida e ajuste ao tom (mais raio = amigável; menos = sério/corporativo).

> Não aplique a mesma paleta/tipografia a todos os clientes. A marca manda.

---

## 4. Escalas de referência

Ponto de partida — ajuste por projeto. Versão completa e comentada pronta para
colar em `assets/tokens-starter.css`.

**Espaçamento** (base 4px / múltiplos de 8; use escala consistente):
```
--space-1: .25rem   /* 4  */
--space-2: .5rem    /* 8  */
--space-3: .75rem   /* 12 */
--space-4: 1rem     /* 16 */
--space-5: 1.5rem   /* 24 */
--space-6: 2rem     /* 32 */
--space-7: 3rem     /* 48 */
--space-8: 4rem     /* 64 */
--space-9: 6rem     /* 96 */
--space-10: 8rem    /* 128 */
```
Padding de seção deve ser **fluido** (menor no mobile, maior no desktop):
```
--space-section: clamp(3rem, 8vw, 8rem);
```

**Raio:**
```
--radius-sm: .375rem;  --radius-md: .625rem;  --radius-lg: 1rem;
--radius-xl: 1.5rem;   --radius-full: 9999px;
```
Use **hierarquia de raio** conforme o elemento (input pequeno ≠ card grande ≠
pílula). Um único raio em tudo é tell de template.

**Sombra (elevação):** camadas discretas, não a mesma `rgba(0,0,0,.1)` em tudo.
```
--shadow-sm: 0 1px 2px rgba(16,24,40,.06);
--shadow-md: 0 4px 12px rgba(16,24,40,.08);
--shadow-lg: 0 12px 32px rgba(16,24,40,.12);
```

**Movimento:**
```
--duration-fast: 120ms;  --duration-base: 200ms;  --duration-slow: 320ms;
--ease-out: cubic-bezier(.16,1,.3,1);
--ease-in-out: cubic-bezier(.65,0,.35,1);
```

**Breakpoints** (mobile-first; usados nas media queries, não como tokens CSS):
```
sm 480px · md 768px · lg 1024px · xl 1280px · 2xl 1536px
```

**Container / z-index:**
```
--container: 1200px;         /* largura máxima do conteúdo geral */
--container-narrow: 720px;   /* largura de leitura confortável   */
--z-header: 100; --z-overlay: 200; --z-modal: 300; --z-toast: 400;
```

---

## 5. Cor e tipografia

Estas categorias têm profundidade própria:
- **Cor, rampas, tokens semânticos e contraste:** `cor-e-contraste.md`.
- **Famílias, escala tipográfica fluida e performance de fonte:** `tipografia.md`.

Os tokens de cor/tipo vivem no mesmo `:root`; estas referências detalham como
escolhê-los bem.

---

## 6. Checklist de tokens

- [ ] Cores de marca extraídas e com papéis definidos (brand vs. **um** action).
- [ ] Rampas de cor + neutros + estados semânticos.
- [ ] Escala tipográfica com papéis (display/h1/h2/h3/body/small).
- [ ] Escala de espaço consistente; padding de seção fluido (`clamp`).
- [ ] Hierarquia de raio e de sombra (não um valor único em tudo).
- [ ] Tokens de motion + respeito a `prefers-reduced-motion`.
- [ ] Container, breakpoints e z-index padronizados.
- [ ] Componentes consomem **semânticos**, nunca primitivos crus nem valores soltos.
