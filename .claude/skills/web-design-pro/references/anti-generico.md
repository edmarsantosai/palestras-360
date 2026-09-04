# Anti-Genérico — Fugindo da "Cara de IA"

> Design distintivo é uma **escolha**, não um default. O maior risco de uma
> página gerada é parecer com todas as outras. Este arquivo é a calibração para
> reconhecer e evitar os padrões que denunciam "gerado por IA" — e a checagem
> final de distinção.

## O que denuncia uma página gerada (calibração)

No momento, design gerado por IA tende a cair nestes agrupamentos. Todos são
**legítimos para algum brief** — o problema é usá-los como default,
independentemente do assunto:

1. **Fundo creme (perto de #F4F1EA) + serif de display de alto contraste +
   acento terracota/argila (perto de #D97757).** Esse laranja é justamente o
   acento de interação do Claude — num brief de cliente, lê como "tell".
2. **Fundo quase-preto + um único acento verde-ácido ou vermelhão.**
3. **Layout estilo jornal:** fios finíssimos (hairlines), zero border-radius,
   colunas densas de jornal.
4. **Kit "SaaS-card":** conteúdo picado em cards arredondados idênticos, **um só
   raio** em tudo, **a mesma sombra cinza** (`rgba(0,0,0,.1)`) sob cada card, e
   "gradient washes" como decoração.
5. **Chrome de template que aparece em qualquer assunto:** rótulo "eyebrow"
   ALL-CAPS com tracking acima de todo título; strings de metadados unidas por
   ponto médio (`A · B · C`); rótulos no formato `PALAVRA — fragmento` com em
   dash espaçado; quase-preto tingido (`#0B0B0B`, `#111`) no lugar de preto;
   fonte monoespaçada para pequenos rótulos de dado; `→` grudado no texto de
   links e botões.

## Como não cair nisso

- **Derive do assunto e da marca.** Onde o brief fixa uma direção, siga-a à
  risca — inclusive se pedir um desses looks. Onde o brief deixa um eixo livre,
  **não gaste essa liberdade num default** — faça uma escolha específica.
- **Gaste ousadia em um lugar só.** Deixe **um** elemento ser o memorável;
  mantenha o resto quieto e disciplinado. Corte decoração que não serve ao
  brief (Chanel: tire um acessório).
- **Estrutura codifica informação.** Numeração `01/02/03` só se o conteúdo for
  mesmo uma sequência (processo, timeline). Bordas, divisores, rótulos —
  significam algo, não enfeitam.
- **Motion com parcimônia.** Um único momento orquestrado (uma sequência de
  entrada ou um reveal) vale mais que "fade-and-slide-up" em toda seção + hover
  em todo card (padrão de IA). Motion que responde a uma ação do usuário
  (abrir, expandir, confirmar) é bem-vindo.
- **Tipografia como escolha**, não a família padrão de sempre (ver
  `tipografia.md`). Evite acentuar uma única palavra do headline, ALL-CAPS em
  rótulos e eyebrows desnecessários.

## Processo em duas passagens

1. **Plano compacto** (cor 4–6 hex, tipografia com papéis, layout em 1 frase +
   wireframe ASCII + alinhamento, princípios do que torna única).
2. **Revisão contra o brief antes de codar:** simule "o que eu produziria para
   um brief parecido?". Se qualquer parte do plano bate com esse default
   genérico, **revise e diga o que mudou e por quê.** Só então codifique.

## Teste de distinção (aplicar antes de entregar)

- Se eu tirasse o logo, esta página poderia ser de **qualquer** empresa do
  mesmo nicho? → Se sim, falta identidade.
- Existe **um** elemento memorável e específico da marca? → Se não, crie um.
- Estou usando algum item da lista de calibração **por default** (não por
  escolha)? → Se sim, troque por uma decisão do brief.
- O tratamento visual **vem do assunto** (setor, materiais, vocabulário do
  cliente)? → Deve vir.

> Como um designer humano contratado: há um equilíbrio entre fazer o que se sabe
> bem e usar cada projeto para experimentar. Registre o que já tentou para
> variar nas próximas passagens.
