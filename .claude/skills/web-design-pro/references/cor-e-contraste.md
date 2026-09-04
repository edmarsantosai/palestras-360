# Cor e Contraste

> A cor organiza atenção e comunica marca. Poucas cores, bem escolhidas,
> derivadas da marca. **Um** acento reservado para a ação. Contraste sempre
> acessível.

## Índice
1. Regra 60–30–10
2. Paleta base (4–6 hex nomeados)
3. Rampas e neutros (como gerar)
4. Tokens semânticos
5. Acento de ação (a cor do CTA)
6. Contraste WCAG (obrigatório)
7. Seções escuras e gradientes

---

## 1. Regra 60–30–10

~60% cor dominante (fundos/superfícies neutras), ~30% secundária
(estrutura/marca), ~10% acento (ação e destaques pontuais). O acento **escasso**
é o que faz o CTA saltar.

## 2. Paleta base

Descreva a base como **4 a 6 valores hex nomeados**. Exemplo (derivado de um
navy + ciano de marca) — **ilustrativo, não um padrão para todo projeto**:
```
--color-brand:   #1B3A6A;  /* institucional / navy da marca */
--color-brand-2: #0D2137;  /* navy profundo p/ seções escuras */
--color-action:  #00BCD4;  /* CTA — o único acento de ação */
--color-bg:      #FFFFFF;  /* fundo base */
--color-surface: #F4F7FB;  /* superfície de card/seção alternada */
--color-text:    #101828;  /* texto principal */
```

## 3. Rampas e neutros

- **Rampa por matiz (50→900):** gere tints (mistura com branco) e shades
  (mistura com preto), ou — melhor para contraste uniforme — trabalhe em
  **OKLCH** variando o Lightness e mantendo Chroma/Hue. Isso evita degraus que
  "somem" ou "estouram".
- **Neutros com temperatura:** cinzas levemente puxados para o matiz da marca
  (um navy tem cinzas ligeiramente azulados) ficam mais coesos que cinza neutro
  puro. Defina: `--color-border`, `--color-muted` (texto secundário),
  `--color-surface`, `--color-bg`.

## 4. Tokens semânticos

Nomeie por **função**, não por cor:
```
--color-text · --color-muted · --color-bg · --color-surface · --color-border
--color-brand · --color-action · --color-action-hover
--color-success · --color-warning · --color-danger · --color-info
--color-on-brand /* texto sobre fundo de marca */ · --color-on-action
```
Assim, trocar a marca ou criar dark mode remapeia semânticos sem tocar em
componentes.

## 5. Acento de ação (a cor do CTA)

- **Uma só cor de ação.** Se a marca tem duas cores fortes, escolha a de melhor
  contraste sobre o fundo para a ação e use a outra como estrutura.
- Não espalhe o acento como decoração — isso "gasta" o sinal e o CTA deixa de
  saltar.
- Garanta `--color-action-hover` (versão levemente mais escura/saturada) e um
  estado de foco visível.

## 6. Contraste WCAG (obrigatório)

Alvos mínimos (AA):
- **Texto normal:** contraste **≥ 4,5:1** com o fundo.
- **Texto grande** (≥ 24px, ou ≥ 18,66px bold): **≥ 3:1**.
- **Componentes de UI e ícones informativos** (bordas de input, estados): **≥ 3:1**.

Como aplicar:
- Teste **cada** combinação texto/fundo, inclusive sobre imagens (use overlay).
- Botão de ação: o texto do botão precisa passar 4,5:1 sobre a cor do botão.
- Não confie só em cor para transmitir significado (erro, sucesso) — some ícone
  ou texto (também ajuda daltônicos).
- Ferramentas mentais: se ficou "quase legível", **não passou** — escureça o
  texto ou clareie o fundo.

## 7. Seções escuras e gradientes

- Seções escuras dão **autoridade e ritmo** — alterne com claras. Mas o
  clichê "quase-preto tingido (#0B0B0B/#111) com um único acento ácido" é tell
  de IA. Use preto real ou um escuro **da marca**, com intenção.
- Em fundo escuro, cuide do contraste do corpo (cinza claro, não branco puro
  cansativo em blocos longos) e do brilho do acento.
- **Gradientes:** use com propósito (profundidade, foco, transição), não como
  enfeite genérico. Gradiente sutil da marca (escuro → médio) numa seção de
  destaque funciona; "gradient wash" decorativo em tudo, não.
- **Fotos com texto por cima:** aplique overlay (sólido translúcido ou
  gradiente) suficiente para o texto passar no contraste — leitura primeiro.
