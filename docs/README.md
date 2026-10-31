# Cada Real — documentação da Atividade A2

**Disciplina:** Desenvolvimento Front-end para Web · UNICID · Prof. Paulo Fratta
**Equipe:** Bolso Coletivo
**Site:** https://yagoxavier10.github.io/cada-real/
**Repositório:** https://github.com/YagoXavier10/cada-real

## Tema

Educação financeira para quem vive com pouco: como economizar, organizar o orçamento e se proteger de
dívidas, juros abusivos, apostas e golpes. Tema de **impacto social** ligado aos ODS 1 (Erradicação
da pobreza), 10 (Redução das desigualdades) e 12 (Consumo e produção responsáveis), com
**acessibilidade para pessoas com deficiência** como prioridade.

## Objetivos

- **Geral:** oferecer conteúdo financeiro gratuito, simples e acessível para estudantes e famílias de
  baixa renda.
- **Específicos:**
  1. Publicar 10 páginas interligadas, validadas no W3C sem erros.
  2. Oferecer 3 simuladores que mostrem o efeito de pequenos gastos, da dívida no cartão e da reserva.
  3. Manter um noticiário de finanças pessoais atualizado automaticamente todo dia.
  4. Atingir acessibilidade WCAG 2.1 AA (teclado, leitor de tela, contraste, legendas e transcrições).
  5. Manter o site leve: imagens em WebP abaixo de 300 KB e nenhum framework ou rastreador.

## Páginas

| Nº | Arquivo | Conteúdo |
|----|---------|----------|
| 1 | `index.html` | Resumo do tema, carrossel, simulador rápido, menu principal |
| 2 | `sobre.html` | História, missão, visão, valores, equipe e selo de autoria |
| 3 | `projetos.html` | Quatro projetos de impacto social |
| 4 | `impacto.html` | Dados, tabelas, gráfico e matérias de origem |
| 5 | `acessibilidade.html` | Medidas de inclusão para PCD e direitos |
| 6 | `galeria.html` | 8 imagens com legendas e fontes |
| 7 | `midia.html` | `<video controls poster>` com legendas, `<audio controls>` e `<iframe>` |
| 8 | `noticias.html` | Notícias do dia, atualizadas automaticamente |
| 9 | `contato.html` | Dados fictícios, formulário validado e membros da equipe |
| 10 | `orcamento_hospedagem.html` | *Retirada do site por enquanto; o orçamento está em [`orcamento-hospedagem.md`](orcamento-hospedagem.md)* |
| + | `tema.html`, `aprofundamento.html`, `simuladores.html` | Conteúdo educativo e ferramentas |

## Estrutura de pastas

```
cada-real/
├── index.html  sobre.html  projetos.html  impacto.html  acessibilidade.html
├── galeria.html  midia.html  noticias.html  contato.html
├── tema.html  aprofundamento.html  simuladores.html
├── css/        estilo.css
├── js/         menu, carrossel, simuladores, barras, notícias, contato
├── img/        galeria/, projetos/, pôster do vídeo, imagem do Sobre, favicon
├── assets/     video/ (MP4 + legendas VTT), audio/ (MP3)
├── dados/      noticias.json (gerado pelo robô)
├── scripts/    atualizar_noticias.py
└── docs/       esta documentação
```

## Divisão de funções

> **A preencher pela equipe** antes da entrega.

| Integrante | Responsabilidades |
|------------|-------------------|
| Camilo Eduardo | |
| Carlos Eduardo | |
| Gabriel Evaristo | |
| Gabriel Oneil | |
| João Vitor | |
| Yago Dos Santos | |

## Documentos desta pasta

- [`escopo.md`](escopo.md) — escopo do projeto
- [`diario-de-bordo.md`](diario-de-bordo.md) — decisões, aprendizados e dificuldades
- [`orcamento-hospedagem.md`](orcamento-hospedagem.md) — hospedagem e domínio
- [`evidencias-testes.md`](evidencias-testes.md) — validação, navegação e acessibilidade
