# Diário de bordo

Registro das principais decisões, aprendizados e dificuldades do projeto.

> A equipe pode completar com datas e relatos próprios de cada integrante.

## Linha do tempo

| Etapa | O que aconteceu |
|-------|-----------------|
| Início | Escolha do tema (educação financeira para baixa renda) e criação do repositório do grupo, com fluxo `feature → develop → main`. |
| Bolso Coletivo | Primeira versão: página inicial com carrossel, artigo de aprofundamento e páginas-base com cabeçalho e rodapé padronizados. |
| Conteúdo | Pesquisa de dados de 2026 (Serasa, CNC, Banco Central) e escrita das páginas O tema, Tabelas, Acessibilidade, Matérias, Vídeo e Autores. |
| Cada Real | Reconstrução do site com layout novo, simuladores e página de dados com gráfico. |
| Notícias | Criação do robô que coleta notícias de finanças pessoais todo dia (GitHub Actions + Python). |
| Junção | União do conteúdo do Bolso Coletivo com o Cada Real em um único site. |
| A2 | Adequação ao enunciado: 10 páginas obrigatórias, formulário validado, galeria, mídia com vídeo/áudio/iframe, orçamento e esta documentação. |

## Decisões

- **HTML, CSS e JavaScript puros, sem framework nem build.** O site é pequeno e estático; frameworks
  adicionariam peso e complexidade sem benefício para o público.
- **Uma única folha de estilo com variáveis de cor no `:root`.** Garante a mesma paleta azul em todas
  as páginas e facilita ajustes de contraste.
- **Mobile-first.** Grande parte do público acessa pelo celular.
- **Simuladores no navegador.** Nenhum dado digitado sai do computador da pessoa (privacidade/LGPD).
- **Notícias automáticas guardando só título, fonte, data e link.** Respeita direitos autorais e mantém
  a página sempre atual sem trabalho manual.
- **Imagens geradas por IA a partir de roteiros da equipe**, revisadas uma a uma. Três tinham
  defeitos: duas foram corrigidas (retoque e corte) e uma teve a legenda ajustada para descrever
  corretamente a bengala vermelha e branca (pessoa surdocega).
- **Vídeo e áudio próprios** com narração em voz sintética, legendas (WebVTT) e transcrição, para
  atender pessoas surdas e quem não pode ouvir no momento.
- **Hospedagem no GitHub Pages** com domínio sugerido no Registro.br (ver orçamento).

## Aprendizados

- Semântica HTML5 e ARIA na prática: `aria-current`, `aria-live`, `aria-labelledby`, `role="region"`
  em tabelas com rolagem.
- Validação de formulário só com HTML5: `required`, `type="email"`, `pattern`, `min`/`max`.
- Uso de Git e GitHub em equipe: branches, pull requests, revisão e proteção da branch principal.
- Automação com GitHub Actions e publicação contínua com GitHub Pages.
- Importância de checar fontes: dados de apostas do Banco Central e de um estudo do setor divergem.

## Dificuldades

- **Menu com muitos itens:** com 10 páginas, o menu horizontal só cabe em telas largas; abaixo de
  1200 px ele vira um botão "Menu".
- **Tabelas no celular:** tabelas largas esticavam a página; resolvido com contêiner de rolagem.
- **Notícias fora do tema:** o primeiro filtro trazia dívida pública e notícias de empresas; foi
  criada uma lista de veículos confiáveis e de termos bloqueados.
- **Imagens de IA:** erros como objetos flutuando e pessoas duplicadas exigiram revisão cuidadosa.
- **Preços de hospedagem:** variam muito entre promoções e renovação; o orçamento registra a data da
  consulta.
