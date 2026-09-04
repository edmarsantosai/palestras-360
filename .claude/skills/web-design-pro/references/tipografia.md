# Tipografia

> A tipografia carrega a personalidade da página. Escolha as fontes de forma
> **deliberada** — não as famílias padrão que você usaria em qualquer projeto.
> Quando o tipo é headline, ele é **parte ativa do design**, não só um veículo
> neutro de texto.

## Índice
1. Quantas famílias
2. Pareamento (escolha por marca, não por default)
3. Escala tipográfica modular + fluida
4. Line-height, medida (line-length) e tracking
5. Papéis (hierarquia)
6. Performance de fonte (crítico para CWV)
7. Anti-padrões

---

## 1. Quantas famílias

Uma ou duas. Não precisa de família diferente para display e corpo. Se usar
duas, faça-as **claramente distintas** (ex.: um sans geométrico forte no display
+ um sans humanista neutro no corpo; ou um serif de display + sans no corpo).
Duas fontes quase iguais só adicionam peso sem ganho.

## 2. Pareamento

Escolha guiado pela marca e pelo assunto. Alguns pares que funcionam **como
ponto de partida** (confirme se combinam com o cliente — não aplique sempre os
mesmos):
- Corporativo/autoridade: display **Montserrat / Poppins / Sora** + corpo
  **Inter / Open Sans / Source Sans**.
- Editorial/premium: display serif (**Fraunces / Playfair / Newsreader**) +
  corpo sans neutro.
- Técnico/produto: **Inter** sozinho, bem explorado em pesos.

> Regra: se você usaria esse par em qualquer brief, questione. A fonte é uma
> escolha de marca.

## 3. Escala tipográfica modular + fluida

Defina uma razão e derive os tamanhos (evita "tamanhos aleatórios"):
- **1.200** (minor third) — sutil, denso, corporativo.
- **1.250** (major third) — equilibrado (bom default).
- **1.333** (perfect fourth) — dramático, mais contraste display↔corpo.

Exemplo com base 16px e razão ~1.25, **fluido** via `clamp()` (escala sozinho
entre mobile e desktop, ajuda LCP e evita quebra):
```css
:root {
  --text-xs:   clamp(.75rem,  .72rem + .15vw, .8125rem);
  --text-sm:   clamp(.875rem, .84rem + .18vw, .9375rem);
  --text-base: clamp(1rem,    .96rem + .2vw,  1.0625rem);
  --text-lg:   clamp(1.125rem,1.06rem + .3vw, 1.25rem);
  --text-xl:   clamp(1.375rem,1.25rem + .6vw, 1.75rem);
  --text-2xl:  clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem);
  --text-3xl:  clamp(2.25rem, 1.8rem + 2.2vw, 3.5rem);
  --text-4xl:  clamp(2.75rem, 2rem + 3.6vw,   4.5rem);
}
```

## 4. Line-height, medida e tracking

- **Medida (line-length):** corpo com **menos de ~70–75 caracteres** por linha
  (use `max-width: 65ch` no container de leitura). Serif tolera linha um pouco
  mais longa.
- **Line-height:** display justo (`1.05–1.15`); corpo confortável
  (`1.5–1.65`). Serif no corpo pede um pouco mais de entrelinha que sans.
- **Tracking (letter-spacing):** display grande costuma pedir tracking
  **levemente negativo** (`-0.01em a -0.02em`); corpo, tracking normal.

## 5. Papéis (hierarquia)

```
Display  → chamada principal do hero (peso 700–800, tracking tight, leading justo)
H1       → um por página; título da página
H2       → seções
H3       → subseções / títulos de card
Body     → texto corrido (peso 400–450, leading 1.5–1.6)
Small    → apoio, metadados
Caption  → legendas
Overline → rótulo curto acima de conteúdo — USE COM PARCIMÔNIA (ver anti-padrões)
```
Máximo de contraste com **poucos tamanhos por tela**. Hierarquia clara vale mais
que muitos níveis.

## 6. Performance de fonte (crítico para CWV)

Fontes web mal configuradas causam **CLS** (layout shift) e atrasam **LCP**.
Faça:
- **`font-display: swap`** para exibir texto imediatamente com a fallback.
- **Reduza pesos**: carregue só os que usa (ex.: 400, 600, 800). Cada peso é um
  arquivo.
- **Prefira variable fonts** quando disponíveis — um arquivo cobre vários pesos.
- **Self-host** (ou `preconnect` ao provedor) e **`preload`** a fonte usada no
  texto de LCP:
  ```html
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="font" type="font/woff2"
        href="/fonts/inter-var.woff2" crossorigin>
  ```
- **Reduza o CLS da troca** com uma fallback métrica próxima da web font:
  ```css
  @font-face{
    font-family:"Inter Fallback"; src:local("Arial");
    size-adjust:107%; ascent-override:90%; descent-override:22%; line-gap-override:0%;
  }
  body{ font-family:"Inter","Inter Fallback",system-ui,sans-serif; }
  ```
- **Subset** (latin / latin-ext) para arquivos menores.
- **Stack de sistema** como fallback sempre presente:
  `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`.

## 7. Anti-padrões (tells de página gerada)

- Acentuar **uma única palavra** do headline (itálico/negrito/cor diferente).
- **ALL CAPS** para rótulos por toda parte.
- **Rótulos tipográficos desnecessários** acima do conteúdo ("eyebrow" em tudo).
- Fonte monoespaçada para pequenos rótulos de dado como enfeite.
- Muitos tamanhos competindo — dilui a hierarquia.
