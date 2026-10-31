# Cada Real

Educação financeira em linguagem simples para quem vive com pouco. Um site estático com um guia
prático, simuladores e dados reais com fontes.

## Páginas

| Página | O que tem |
|--------|-----------|
| `index.html` | Abertura, simulador rápido de pequeno gasto, números do endividamento e três primeiros passos |
| `guia.html` | Guia completo: orçamento, reserva de emergência, armadilhas, economia no dia a dia, onde guardar, vídeo e glossário |
| `simuladores.html` | Pequeno gasto em 10 anos, dívida no rotativo do cartão (com o teto legal) e reserva de emergência |
| `dados.html` | Gráfico, tabelas de endividamento, assinaturas e apostas, reportagens e como checar uma informação |
| `noticias.html` | Manchetes do dia sobre finanças pessoais, com filtro por tema, atualizadas automaticamente |
| `acessibilidade.html` | Recursos do site, dicas de navegação e direitos |
| `sobre.html` | Autoria, como o site foi feito e uso de IA |

## Tecnologias

- HTML5, CSS3 e JavaScript puros. Sem frameworks, sem dependências, sem build.
- Uma folha de estilo: `css/estilo.css`, mobile-first, com a paleta em variáveis no `:root`.
- JavaScript só para o menu do celular, os simuladores, as notícias e a animação das barras. Sem JavaScript, o
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
index.html  guia.html  simuladores.html  dados.html  noticias.html  acessibilidade.html  sobre.html
css/estilo.css
js/menu.js  js/simuladores.js  js/barras.js  js/noticias.js
img/favicon.svg
dados/noticias.json
scripts/atualizar_noticias.py
.github/workflows/noticias.yml
```

## Autor

Yago Dos Santos. Baseado no tema do trabalho em grupo *Bolso Coletivo* (UNICID).
