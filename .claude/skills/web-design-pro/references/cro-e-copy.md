# CRO e Copy — Design de Conversão

> Cada decisão de conteúdo e interface existe para **reduzir atrito até a ação
> primária**. Clareza vence esperteza. Uma ação primária por tela, repetida.

## Índice
1. Princípios de conversão
2. Hierarquia de CTA
3. Redução de fricção
4. Sinais de confiança (honestos)
5. FAQ como matadora de objeções
6. Copywriting que converte
7. Message match (anúncio → LP)
8. Mensagem de WhatsApp contextual
9. Taxonomia de rastreamento (consistente)

---

## 1. Princípios de conversão

- **Uma ação primária por tela.** Ações secundárias existem, mas discretas, sem
  competir com a primária.
- **Reduza a carga cognitiva:** menos escolhas, hierarquia clara, blocos
  escaneáveis. O usuário decide rápido quando o caminho é óbvio.
- **CTA acima da dobra + repetido** (meio, fim, sticky no mobile). Quem se
  convence cedo não deveria ter que procurar o botão.
- **Especificidade converte:** "Atendimento em todo o Brasil, presencial e
  online" > "As melhores palestras".

## 2. Hierarquia de CTA

- **Primário** (cor de ação, peso, espaço): a conversão principal.
- **Secundário** (ghost/outline): alternativa de menor compromisso (ex.: "Ver
  temas"). Nunca dois primários competindo lado a lado.
- Mesmo rótulo para a mesma ação em toda a jornada.

## 3. Redução de fricção

- Menos campos, menos passos, menos decisões.
- **WhatsApp com mensagem pré-preenchida** costuma ser a via de menor fricção —
  o usuário só toca e envia.
- Remova distrações perto do CTA (links concorrentes, excesso de texto).
- Deixe claro o **próximo passo** e o que esperar depois de clicar.

## 4. Sinais de confiança (honestos)

- **Prova social:** números reais, logos, depoimentos com nome/cargo/empresa.
- **Autoridade:** credenciais, experiência, cases — verdadeiros (E-E-A-T).
- **Especificidade:** dados concretos vencem adjetivos.
- **Reversão de risco:** quando existir (garantia, sem compromisso, resposta
  rápida). Só prometa o que se cumpre.
- **Urgência/escassez só se for real.** Falsa urgência corrói confiança.

## 5. FAQ como matadora de objeções

Liste as objeções reais do comprador e responda como perguntas. Cada FAQ:
- **Mata uma objeção** (preço, formato, adaptação, logística, prazo).
- **Captura intenção de busca** (ver SEO). Ex.: "A palestra tem versão online?",
  "Como funciona o orçamento?", "Vocês atendem em todo o Brasil?".
Texto natural, orientado à pessoa — nunca keyword stuffing.

## 6. Copywriting que converte

- **Voz ativa.** O CTA diz o que acontece: "Solicitar orçamento no WhatsApp",
  não "Enviar". A mesma ação mantém o nome até o fim ("Publicar" → toast
  "Publicado").
- **Headline orientado a benefício/oferta**, não a nome próprio ou jargão.
- **Nomeie pelo que o usuário entende**, em linguagem simples; descreva o que
  algo é/faz em termos claros, sem "vender" com adjetivo vazio.
- **Erros e vazios são direção, não humor.** Explique o que houve e como
  resolver, na voz da interface. Tela vazia é um convite à ação.
- **Escaneável:** parágrafos curtos, subtítulos úteis, listas quando ajudam.

## 7. Message match (anúncio → LP)

Continuidade total entre a busca, o anúncio e a página:
```
PALAVRA-CHAVE → ANÚNCIO → LANDING PAGE DO MESMO TEMA → CTA → WHATSAPP
```
- Título da página ecoa a intenção do anúncio.
- Nunca mande tráfego altamente segmentado para uma página genérica se existe
  uma página específica para aquela intenção.
- O CTA e o tema da página confirmam a promessa do anúncio.

## 8. Mensagem de WhatsApp contextual

Padrão de mensagem, montada por página (ver componente em
`layout-e-componentes.md`):
```
Olá! Tenho interesse na palestra sobre [NOME DA PALESTRA] para minha empresa e
gostaria de solicitar um orçamento.
```
- `[NOME DA PALESTRA]` vem de `data-wa-theme` (ou do título) → identifica o tema.
- Use o campo para saber **de qual página** o lead veio (parte do rastreamento).

## 9. Taxonomia de rastreamento (consistente)

Prepare a arquitetura para rastrear a jornada com **nomes de evento estáveis e
reutilizáveis** — nunca invente nomes aleatórios por página.

| Evento | Quando dispara | Parâmetros úteis |
|---|---|---|
| `view_page` | carregamento da página | `page_type`, `theme` |
| `view_talk` | visualização de página de palestra | `theme` |
| `select_theme` | seleção/clique em um tema no catálogo | `theme` |
| `scroll_depth` | marcos de rolagem (25/50/75/100%) | `percent` |
| `click_whatsapp` | clique em qualquer CTA de WhatsApp | `cta_location`, `theme` |
| `generate_lead` | conversão confirmada | `theme`, `source` |

- `cta_location` distingue Hero / Meio / Final / Sticky.
- Mantenha os mesmos nomes em todas as páginas para relatórios comparáveis
  (GA4 / dataLayer). Consistência agora evita retrabalho de mensuração depois.
