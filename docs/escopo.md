# Escopo do projeto — Cada Real

## 1. Identificação

- **Equipe:** Bolso Coletivo
- **Projeto/site:** Cada Real — https://yagoxavier10.github.io/cada-real/
- **Integrantes:** Camilo Eduardo, Carlos Eduardo, Gabriel Evaristo, Gabriel Oneil, João Vitor, Yago Dos Santos
- **Data:** 31/10/2026
- **Disciplina/Professor:** Desenvolvimento Front-end para Web — Prof. Paulo Fratta (UNICID)

## 2. Contexto e justificativa

Quase metade dos adultos brasileiros está inadimplente (81,7 milhões em fevereiro de 2026, segundo a
Serasa), e 48% deles ganham até um salário mínimo. Quem ganha pouco paga mais caro pelo dinheiro —
rotativo do cartão acima de 400% ao ano, parcelamentos, apostas e golpes — e quase não encontra
conteúdo de finanças feito para a sua realidade. Educação financeira acessível reduz essa
vulnerabilidade: é impacto social direto (ODS 1 e 10) e incentiva consumo consciente (ODS 12).

## 3. Objetivos

- **Geral:** oferecer educação financeira gratuita, simples e acessível a quem vive com pouco.
- **Específicos (mensuráveis):**
  1. 10 páginas interligadas com 0 erros no validador W3C.
  2. 3 simuladores funcionando no navegador.
  3. Notícias atualizadas automaticamente 1 vez por dia.
  4. Acessibilidade WCAG 2.1 AA: 100% das imagens com `alt`, vídeo com legenda, áudio com transcrição.
  5. Imagens em WebP com menos de 300 KB cada.

## 4. Público-alvo

Estudantes e famílias de baixa renda, de 16 a 65 anos, principalmente em grandes cidades
brasileiras, que acessam a internet pelo celular. **Pessoas com deficiência** (visual, auditiva, motora
e surdocegueira) são público prioritário.

## 5. Escopo funcional

- 10 páginas: Início, Sobre, Projetos, Impacto, Acessibilidade, Galeria, Mídia, Notícias, Contato e
  Orçamento de hospedagem — mais O tema, Aprofundamento e Simuladores.
- Menu principal em todas as páginas e rodapé com links para todo o site.
- Formulário de contato com validação HTML5.
- Galeria com 8 imagens legendadas e com fonte.
- Mídia: vídeo próprio com legendas, áudio com transcrição e vídeo incorporado do Banco Central.
- Notícias do dia e simuladores financeiros.

## 6. Escopo não funcional

- **Acessibilidade:** `alt`, contraste AA, navegação por teclado, link "pular para o conteúdo",
  leitores de tela, ARIA quando necessário, legendas e transcrições.
- **Sustentabilidade:** conteúdo educativo, hospedagem estática sem servidor dedicado, imagens WebP,
  sem rastreadores.
- **Responsividade:** celular, tablet e desktop (mobile-first).
- **Desempenho:** código limpo sem frameworks, imagens otimizadas, carregamento preguiçoso (`loading="lazy"`).
- **SEO básico:** `<title>` e meta descrição em todas as páginas, um `<h1>` por página, hierarquia de
  títulos.

## 7. Mapa do site

```
Início
├── Sobre ─────────── (equipe → Contato)
├── Projetos ──────── Simuladores · O tema · Aprofundamento · Notícias · Acessibilidade
├── Impacto ───────── (fontes → Notícias)
├── Galeria ───────── (imagens → Mídia)
├── Mídia
├── Notícias
├── Acessibilidade
├── Contato
└── Orçamento de hospedagem
```

Todas as páginas acessam todas as outras pelo menu (10 itens) e pelo rodapé.

## 8. Conteúdo e identidade visual

- **Tom de voz:** simples, direto, acolhedor, sem julgamento.
- **Cores:** azul-escuro `#003B5C`, azul-médio `#005F8D`, azul-claro `#7FC8E8`, azul-suave
  `#E1F5FE`, texto `#1D1F21`.
- **Tipografia:** fontes do sistema (Segoe UI, system-ui, Roboto, Arial) — leves e legíveis.
- **Logotipo:** moeda com cifrão em SVG.
- **Fontes:** textos autorais; dados sempre com a fonte; imagens geradas por IA com indicação na legenda.

## 9. Tecnologias e ferramentas

HTML5, CSS3, JavaScript (opcional), Python (robô de notícias), Git e GitHub, GitHub Actions, GitHub
Pages, Visual Studio Code, Validador W3C, ferramentas de IA (apoio ao código, textos e imagens).

## 10. Cronograma e divisão de tarefas

> **A preencher pela equipe** com as datas reais e os responsáveis.

| Etapa | Data | Responsável |
|-------|------|-------------|
| Escopo e tema | | |
| Estrutura e layout | | |
| Conteúdo das páginas | | |
| Formulário, galeria e mídia | | |
| Orçamento e documentação | | |
| Testes e validação | | |
| Entrega no Blackboard | | |

Ferramentas de gestão: GitHub (issues e pull requests).

## 11. Riscos e restrições

- Prazo curto e disponibilidade dos integrantes.
- Conteúdo com dados que mudam todo mês (juros, inadimplência).
- Dependência de fontes externas para as notícias.
- Sem servidor: o formulário valida, mas não envia mensagens de verdade.

## 12. Critérios de aceitação

- 10 páginas navegáveis pelo menu e pelo rodapé.
- Formulário com `required`, `email`, `tel`, `date`, `number`, `pattern` e `<label for>`.
- `<video controls poster>`, `<audio controls>` e `<iframe>` funcionando.
- Acessibilidade aplicada e W3C sem erros.
- Documentação completa em `/docs`.

## 13. Aprovação

- **Responsável pela validação:** ______________________
- **Data:** ____/____/2026
- **Assinatura:** ______________________
