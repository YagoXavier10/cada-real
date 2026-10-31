# Cada Real

Educação financeira em linguagem simples para quem vive com pouco. Um site estático com um guia
prático, simuladores e dados reais com fontes.

## Origem

O Cada Real junta dois projetos: o **Bolso Coletivo**, trabalho em grupo da disciplina
Desenvolvimento Front-end para Web (UNICID), e o **Cada Real**, projeto pessoal de Yago Dos Santos.
Do Bolso Coletivo vêm o texto de aprofundamento, o tema, a página de vídeo, o carrossel e a paleta;
do Cada Real, os simuladores, o noticiário diário, os dados atualizados e o layout.

## Páginas

| Página | O que tem |
|--------|-----------|
| `index.html` | Carrossel, simulador rápido, conteúdos em destaque, números, faixa de estatística, últimas notícias e três passos |
| `tema.html` | O que é economizar com pouco, orçamento, reserva de emergência e glossário |
| `aprofundamento.html` | O artigo da equipe Bolso Coletivo: trituradores de dinheiro, paradoxo, hábitos, armadilhas, dia a dia, onde guardar |
| `simuladores.html` | Pequeno gasto em 10 anos, dívida no rotativo do cartão (com o teto legal) e reserva de emergência |
| `dados.html` | Gráfico e tabelas de gastos, endividamento, assinaturas e apostas, matérias de origem e como checar uma informação |
| `noticias.html` | Manchetes do dia sobre finanças pessoais, com filtro por tema, atualizadas automaticamente |
| `video.html` | Episódio legendado da série "Eu e meu dinheiro" (Banco Central) com perguntas para refletir |
| `acessibilidade.html` | Recursos do site, dicas de navegação e direitos |
| `autores.html` | Origem do projeto, equipe, selo de autoria, como foi feito e uso de IA |

## Tecnologias

- HTML5, CSS3 e JavaScript puros. Sem frameworks, sem dependências, sem build.
- Uma folha de estilo: `css/estilo.css`, mobile-first, com a paleta em variáveis no `:root`.
- JavaScript só para o menu do celular, o carrossel, os simuladores, as notícias e a animação das barras. Sem JavaScript, o
  conteúdo continua acessível.

## Paleta

| Variável | Cor |
|----------|-----|
| `--azul-escuro` | `#003B5C` |
| `--azul-medio` | `#005F8D` |
| `--azul-claro` | `#7FC8E8` |
| `--azul-suave` | `#E1F5FE` |
| `--texto` | `#1D1F21` |

## Notícias automáticas

Todo dia às 7h (Brasília) o workflow `.github/workflows/noticias.yml` roda
`scripts/atualizar_noticias.py`, que:

1. lê os feeds RSS da Agência Brasil, do g1, do InfoMoney e uma busca do Google Notícias;
2. mantém só manchetes de veículos conhecidos que casam com um tema (dívidas, golpes, investir,
   renda, preços) e descarta macroeconomia, empresas e exterior;
3. remove repetidas, guarda os últimos 14 dias em `dados/noticias.json` e faz commit se houver novidade.

O GitHub Pages republica o site sozinho depois do commit. Para rodar na hora: aba **Actions** →
**Atualizar notícias** → **Run workflow**. Localmente: `python3 scripts/atualizar_noticias.py`.

Só título, fonte, data e link são guardados; o texto fica no site de cada veículo.

## Rodar localmente

Abra `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicar

Por ser estático, funciona em GitHub Pages, Netlify, Vercel ou Railway (com um `Staticfile`) sem
nenhuma configuração extra: basta apontar para a raiz do repositório.

## Estrutura

```
index.html  tema.html  aprofundamento.html  simuladores.html  dados.html  noticias.html
video.html  acessibilidade.html  autores.html
css/estilo.css
js/menu.js  js/carrossel.js  js/simuladores.js  js/barras.js  js/noticias.js
img/favicon.svg
dados/noticias.json
scripts/atualizar_noticias.py
.github/workflows/noticias.yml
```

## Autor

Yago Dos Santos, a partir do *Bolso Coletivo* (UNICID), feito com Camilo Eduardo, Carlos Eduardo,
Gabriel Evaristo, Gabriel Oneil e João Vitor.
