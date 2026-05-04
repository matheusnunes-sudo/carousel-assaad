# Skill: Assaad Brand Design System

## Metadata
- **Nome:** assaad-brand
- **Versão:** 1.0
- **Contexto:** Plataforma Assaad — plataforma educacional focada em preparação para o ENEM e vestibulares de Medicina, criada por Pedro Assaad.
- **Uso:** Aplicar em toda peça visual gerada para a marca — carrosséis, thumbnails, iscas digitais, posts, stories, banners, PDFs, apresentações.

---

## 1. Identidade da Marca

### Tom de voz
- **Direto e motivacional**, nunca arrogante
- Fala de igual pra igual com o estudante — não é professor distante, é mentor presente
- Usa frases curtas e impactantes nos títulos
- Corpo de texto pode ser mais detalhado, mas sempre claro
- Evita jargão acadêmico rebuscado — prefere linguagem acessível
- Usa dados concretos (números, prazos, métricas) para criar urgência
- Palavras-chave da marca: constância, método, clareza, progresso, direção, foco

### Personalidade visual
- **Moderna e limpa** — espaço em branco é aliado, não desperdício
- **Profissional mas acolhedora** — não é fria/corporativa nem infantil
- **Gamificada com propósito** — XP, níveis, rankings existem para motivar, não para distrair
- **Colorida com intenção** — cada cor tem função, não é decoração aleatória
- Inspiração: Duolingo (gamificação), Notion (limpeza), Linear (profissionalismo)

---

## 2. Paleta de Cores

### Cores primárias
```
Azul Principal     #4F5FE6    — Botões, CTAs, links, elementos ativos, identidade central
Azul Claro         #7B8CF8    — Gradientes, hovers, elementos secundários
Azul Background    #E8EAFD    — Fundos de badges, cards de stats, tags
Azul Escuro        #3A48B5    — Texto sobre fundos claros, títulos em cards de stats
```

### Cores de acento
```
Laranja            #F97316    — Níveis, conquistas, badges de destaque, energia
Magenta/Pink       #E91E63    — Alertas de meta, bordas de urgência, prazos
Teal/Ciano         #00BFA5    — Sessões de foco, ícones de tempo, progresso positivo
Vermelho           #EF4444    — Alertas, erros, flash cards de Física, urgência
Verde              #22C55E    — Sucesso, flash cards de Biologia, metas concluídas
Roxo               #8B5CF6    — Flash cards de Química, conteúdo especial, premium
```

### Neutros
```
Branco             #FFFFFF    — Fundo de cards, fundo principal
Cinza 50           #F7F7F8    — Fundo de página, superfícies recuadas
Cinza 200          #E5E7EB    — Bordas, separadores, progress bars vazias
Cinza 500          #6B7280    — Texto secundário, labels, subtítulos
Escuro Primário    #111827    — Texto principal, títulos
Sidebar Escuro     #1A1A2E    — Fundo da sidebar, elementos dark
```

### Gradientes
```
Gradiente Primário     linear-gradient(90deg, #4F5FE6, #7B8CF8)     — XP bars, CTAs premium
Gradiente Nível        linear-gradient(135deg, #F97316, #EF4444)    — Badges de nível, destaque
Gradiente Energia      linear-gradient(135deg, #F97316, #FBBF24)    — Conquistas, celebração
```

### Regras de uso de cor
- **Nunca** usar mais de 3 cores por peça (fora neutros)
- O azul #4F5FE6 deve estar presente em toda peça como cor âncora
- Laranja é acento de energia — usar com moderação (badges, números, CTAs secundários)
- Magenta é exclusivo para urgência/alertas — nunca decorativo
- Em fundos escuros, texto sempre branco com opacidades (100%, 85%, 60%)
- Em fundos claros, texto sempre #111827 (primário) ou #6B7280 (secundário)
- Flash cards seguem cores fixas por matéria: Matemática=Azul, Biologia=Verde, Química=Roxo, Física=Vermelho

---

## 3. Tipografia

### Família
- **Primária:** Inter (sans-serif) — usar para tudo
- **Fallback:** system-ui, -apple-system, sans-serif
- **Monospace (código/dados):** JetBrains Mono

### Escala tipográfica
```
Display          36px    800    Números grandes (XP total, countdown, stats hero)
Heading XL       24px    700    Títulos de seção, headlines de carrossel
Heading LG       20px    600    Subtítulos de página, nome de módulo
Heading MD       16px    600    Títulos de card, labels de seção
Body             14px    500    Texto principal, descrições
Body Small       13px    400    Labels, texto secundário, metadata
Caption          11px    500    Badges, tags, numeração de slide, timestamps
Micro            10px    500    Notas de rodapé, "link na bio"
```

### Regras tipográficas
- **Títulos:** sempre Inter Bold ou Semi-Bold, nunca mais de 2 linhas em cards
- **Corpo:** máximo 60 caracteres por linha para legibilidade
- **Hierarquia clara:** toda peça deve ter exatamente 3 níveis (título, subtítulo, corpo)
- **Nunca** usar mais de 2 pesos por peça (ex: 700 + 400, ou 600 + 400)
- **Nunca** usar itálico — a marca não usa
- **Caixa alta (ALL CAPS):** apenas em tags/badges curtos (ex: "ENEM 2026", "A SOLUÇÃO")
- **Letter-spacing:** -0.02em em Display e Heading XL para títulos mais compactos
- **Line-height:** 1.2 para títulos, 1.5 para corpo

---

## 4. Espaçamento e Grid

### Escala de espaçamento (base 4px)
```
4px      xs       Gap ícone-texto, padding interno de badges
8px      sm       Gap entre elementos inline, padding de tags
12px     md       Gap entre itens de lista, padding de botões (vertical)
16px     lg       Padding de cards, gap entre cards em grid
24px     xl       Margem entre seções, separação de blocos
32px     2xl      Margem entre blocos grandes
40px     3xl      Margem de topo/base de seção
```

### Border Radius
```
4px      sm       Badges pequenos, tags inline
8px      md       Botões, inputs, progress bars, imagens pequenas
12px     lg       Cards, containers, modais
16px     xl       Cards grandes, hero cards
20px     2xl      Sidebar, containers de destaque
9999px   pill     Tabs, badges de nível, avatares, indicadores
```

### Grid de carrossel (1080×1080)
```
Padding interno:     64px em todos os lados
Área útil:           952×952px
Margem entre textos: 24px
Posição do handle:   topo-esquerda (64px, 48px)
Posição numeração:   base-direita (64px do canto)
Logo/marca:          topo-direita (64px do canto)
```

---

## 5. Componentes Visuais

### Botão primário
```
Background:      #4F5FE6
Texto:           #FFFFFF
Font:            Inter 14px/500
Padding:         10px 24px
Border-radius:   8px
Hover:           #3A48B5
Ativo:           scale(0.98)
```

### Botão outline
```
Background:      transparente
Borda:           1.5px solid #4F5FE6
Texto:           #4F5FE6
Font:            Inter 14px/500
Padding:         10px 24px
Border-radius:   8px
Hover bg:        #E8EAFD
```

### Botão ghost
```
Background:      #F7F7F8
Texto:           #111827
Font:            Inter 14px/500
Padding:         10px 24px
Border-radius:   8px
Hover bg:        #E5E7EB
```

### Card padrão
```
Background:      #FFFFFF
Borda:           1px solid #E5E7EB
Border-radius:   12px
Padding:         16px
Sombra:          0 1px 3px rgba(0,0,0,0.08)
Hover sombra:    0 4px 12px rgba(0,0,0,0.1)
Selecionado:     border 2px solid #4F5FE6
```

### Badge de nível
```
Background:      linear-gradient(135deg, #F97316, #EF4444)
Texto:           #FFFFFF
Font:            Inter 12px/600
Padding:         4px 14px
Border-radius:   9999px
```

### Progress bar (XP)
```
Track bg:        #E5E7EB
Track height:    10px
Track radius:    5px
Fill bg:         linear-gradient(90deg, #4F5FE6, #7B8CF8)
Fill radius:     5px
```

### Tab (pill)
```
Inativo bg:      #F7F7F8
Inativo texto:   #6B7280
Ativo bg:        #4F5FE6
Ativo texto:     #FFFFFF
Font:            Inter 13px/500
Padding:         6px 16px
Border-radius:   9999px
```

### Stat card
```
Background:      #E8EAFD
Border-radius:   12px
Padding:         12px
Número:          Inter 24px/700 cor #3A48B5
Label:           Inter 11px/400 cor #6B7280
Alinhamento:     center
```

### Meta badge (alerta)
```
Borda:           1.5px solid #E91E63
Background:      transparente
Texto:           #E91E63
Font:            Inter 11px/500
Padding:         4px 12px
Border-radius:   8px
```

### Flashcard
```
Aspect-ratio:    1:1
Border-radius:   12px
Texto:           #FFFFFF Inter uppercase 600
Padding:         12px
Alinhamento:     bottom-left
Efeito:          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 70%)
Cores por matéria:
  Matemática     #4F5FE6
  Biologia       #22C55E
  Química        #8B5CF6
  Física         #EF4444
  Geografia      #F97316
  História       #FBBF24
  Filosofia      #6B7280
  Redação        #E91E63
```

---

## 6. Templates de Carrossel

### Template: Twitter Dark
```
Fundo:           #15202B (Twitter dark bg)
Texto principal: #FFFFFF
Texto secundário: rgba(255,255,255,0.6)
Handle:          topo-esquerda, 13px, opacidade 60%
Numeração:       base-direita, 12px, opacidade 50%
Dimensões:       1080×1080px
```

### Template: Clean White
```
Fundo:           #FFFFFF
Texto principal: #111827
Texto secundário: #6B7280
Borda visual:    nenhuma (limpo)
Handle:          topo-esquerda, 13px, cor #6B7280
Numeração:       base-direita, 12px, cor #E5E7EB
Dimensões:       1080×1080px
```

### Template: Gradiente Assaad
```
Fundo:           linear-gradient(135deg, #4F5FE6, #7B8CF8)
Texto principal: #FFFFFF
Texto secundário: rgba(255,255,255,0.85)
Logo:            topo-direita, fundo rgba(255,255,255,0.15), radius 8px
Handle:          topo-esquerda, 13px, opacidade 60%
Numeração:       base-direita, 12px, opacidade 50%
Dimensões:       1080×1080px
```

### Template: Brand Assaad (Sólido)
```
Fundo:           #4F5FE6
Texto principal: #FFFFFF
Texto secundário: rgba(255,255,255,0.85)
Tag/badge:       fundo rgba(255,255,255,0.2), texto branco, radius pill
Logo:            topo-direita
CTA:             fundo #FFFFFF, texto #4F5FE6, radius 8px
Dimensões:       1080×1080px
```

### Template: Dark Premium
```
Fundo:           #1A1A2E
Texto principal: #FFFFFF
Texto secundário: rgba(255,255,255,0.6)
Acento:          #4F5FE6 para destaques, underlines, badges
Numeração:       base-direita, cor rgba(255,255,255,0.3)
Dimensões:       1080×1080px
```

### Template: Urgência (ENEM)
```
Fundo:           linear-gradient(135deg, #F97316, #EF4444)
Texto principal: #FFFFFF
Texto secundário: rgba(255,255,255,0.85)
Uso:             slides de countdown, prazos, alertas motivacionais
Dimensões:       1080×1080px
```

---

## 7. Regras para Geração de Imagem (GPT Image 2)

Quando usar esta skill com GPT Image 2 ou qualquer gerador de imagem, seguir estas instruções:

### Prompt structure
```
Gere uma imagem no estilo da marca Assaad Educação:
- Estilo: flat design moderno, limpo, sem gradientes complexos
- Paleta: [especificar 2-3 cores da seção 2]
- Tipografia: sans-serif geométrica (estilo Inter), peso bold para títulos
- Layout: [descrever composição]
- Elementos: [descrever ícones/ilustrações necessários]
- Texto na imagem: [especificar texto exato]
- Dimensões: [1080x1080 para carrossel, 1280x720 para thumbnail, 1080x1920 para story]
```

### Estilo de ilustração
- Flat design com formas geométricas simples
- Ícones estilizados, não realistas
- Personagens (quando necessário): estilo cartoon simplificado, diverso
- Sombras suaves e sutis, nunca drop shadow pesado
- Fundo sólido ou gradiente suave, nunca texturas complexas

### O que evitar
- Fotografias stock genéricas
- Ícones 3D ou com brilho/reflexo
- Mais de 3 cores por ilustração
- Texto cursivo ou serifado nas imagens
- Bordas ou molduras decorativas
- Elementos que pareçam Canva/template genérico

### Dimensões por formato
```
Carrossel Instagram/Twitter:   1080×1080px (1:1)
Carrossel Instagram vertical:  1080×1350px (4:5)
Story:                         1080×1920px (9:16)
Thumbnail YouTube:             1280×720px  (16:9)
Banner Twitter/X:              1500×500px  (3:1)
Post LinkedIn:                 1200×627px  (~1.91:1)
Isca digital (capa):           1080×1080px ou 1080×1350px
```

---

## 8. Regras de Composição para Carrosséis

### Estrutura narrativa obrigatória (7 slides)
```
Slide 1 — GANCHO        Frase impactante que gera identificação ou curiosidade
Slide 2 — DADO          Número, estatística ou fato que sustenta o gancho
Slide 3 — PROBLEMA      Descreve a dor do público, valida o que ele sente
Slide 4 — SOLUÇÃO       Apresenta a plataforma como resposta direta ao problema
Slide 5 — FEATURES      Lista objetiva do que o usuário ganha (máximo 6 itens)
Slide 6 — PROVA SOCIAL  Depoimento, resultado, dado de uso que gera credibilidade
Slide 7 — CTA           Chamada para ação clara + "link na bio" ou URL
```

### Variação permitida (5 slides — versão curta)
```
Slide 1 — GANCHO
Slide 2 — PROBLEMA
Slide 3 — SOLUÇÃO + FEATURES
Slide 4 — PROVA SOCIAL
Slide 5 — CTA
```

### Regras visuais dos slides
- Todo slide tem handle (@plataformaassaad) no topo-esquerda
- Todo slide tem numeração (1/7) na base-direita
- Alternar fundos entre slides para manter atenção (claro → escuro → cor → claro)
- Nunca 2 slides seguidos com o mesmo fundo
- Slide 1 e slide 7 devem ter a mesma cor de fundo (fecha o loop visual)
- Texto principal: máximo 3 linhas por slide
- Subtexto: máximo 4 linhas por slide
- CTA sempre com botão visual (retângulo com texto, não apenas texto)

---

## 9. Regras de Composição para Thumbnails

### Layout padrão
```
Terço esquerdo:    Rosto/pessoa ou elemento visual forte
Terço central:     Texto principal (máximo 5 palavras)
Terço direito:     Elemento complementar ou vazio
Fundo:             Cor sólida ou gradiente (nunca branco puro)
```

### Regras
- Texto na thumbnail: máximo 5 palavras, sempre visível a 100% e 25% de zoom
- Usar outline ou sombra no texto se estiver sobre imagem
- Rosto humano aumenta CTR — priorizar foto do Pedro Assaad quando relevante
- Expressão facial deve ser congruente com o conteúdo (surpresa, seriedade, entusiasmo)
- Evitar texto pequeno — se não legível no celular, não incluir

---

## 10. Checklist de Qualidade

Antes de finalizar qualquer peça, verificar:

- [ ] Azul #4F5FE6 presente como cor âncora
- [ ] Máximo 3 cores (fora neutros)
- [ ] Hierarquia clara: título > subtítulo > corpo
- [ ] Texto legível sobre o fundo (contraste mínimo 4.5:1)
- [ ] Handle e numeração presentes (em carrosséis)
- [ ] Não mais de 2 pesos tipográficos
- [ ] Espaçamento consistente (múltiplos de 4px)
- [ ] Border-radius consistente dentro da peça
- [ ] Dimensões corretas para o formato de destino
- [ ] Sem elementos que pareçam "template genérico de IA"
- [ ] Tom de voz alinhado: direto, motivacional, com dados

---

## 11. Exemplos de Prompts Prontos

### Carrossel ENEM
```
Crie um carrossel de 7 slides (1080x1080) sobre o ENEM 2026 estar chegando.
Use o template Brand Assaad. Estrutura: gancho com countdown → dado de dias
restantes → problema (falta de direção) → solução (Plataforma Assaad) →
features (6 itens) → prova social → CTA. Handle: @plataformaassaad.
Siga as regras do design system Assaad: paleta azul como âncora, alternar
fundos entre slides, tipografia Inter.
```

### Thumbnail YouTube
```
Crie uma thumbnail (1280x720) para um vídeo sobre "5 erros que reprovam no ENEM".
Fundo: gradiente #F97316 → #EF4444. Texto: "5 ERROS" grande à esquerda em
branco bold. Espaço à direita para foto do Pedro. Estilo flat, limpo, marca Assaad.
```

### Post motivacional
```
Crie um post quadrado (1080x1080) com a frase "Constância vence talento."
Fundo: #1A1A2E. Texto principal em branco, 36px bold. Subtexto: "Plataforma Assaad"
em #4F5FE6, 14px. Logo no canto. Estilo minimalista, muito espaço em branco (escuro).
```

### Isca digital (capa)
```
Crie a capa de um PDF/ebook (1080x1350) sobre "Guia de Estudos ENEM 2026".
Fundo: gradiente primário (#4F5FE6 → #7B8CF8). Título em branco bold 28px.
Subtítulo: "Plataforma Assaad" em branco 60% opacidade. Ícone de livro estilizado
em flat design. Badge "GRATUITO" em gradiente laranja, pill shape.
```

---

## Como usar esta skill

### No Claude Code:
Adicione este arquivo como contexto antes de qualquer tarefa de design:
```
cat SKILL_ASSAAD_BRAND.md | claude "crie um carrossel sobre [tema]"
```
Ou coloque na pasta de skills do projeto:
```
/skills/assaad-brand/SKILL.md
```

### Com GPT Image 2:
Use a seção 7 (Regras para Geração de Imagem) como instruções do sistema,
e a seção 2 (Paleta) + seção 5 (Componentes) como referência de estilo.

### Pipeline completo:
1. Claude lê esta skill e monta a estrutura (textos, layout, composição)
2. GPT Image 2 recebe a estrutura + regras visuais e gera as imagens
3. Humano revisa, ajusta no Figma se necessário, publica
