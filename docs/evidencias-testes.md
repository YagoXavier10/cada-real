# Evidências de testes

Testes feitos em 31/10/2026 na versão local (`http://localhost`) antes da publicação.

> Para a entrega, a equipe pode acrescentar prints em `docs/evidencias/` (por exemplo: tela do
> validador W3C, formulário mostrando erro, página no celular).

## 1. Validação W3C

Validador oficial: https://validator.w3.org/nu/ (envio do arquivo).

| Arquivo | Erros | Avisos |
|---------|-------|--------|
| index.html | 0 | 0 |
| sobre.html | 0 | 0 |
| projetos.html | 0 | 0 |
| impacto.html | 0 | 0 |
| acessibilidade.html | 0 | 0 |
| galeria.html | 0 | 0 |
| midia.html | 0 | 0 |
| noticias.html | 0 | 0 |
| contato.html | 0 | 0 |
| tema.html · aprofundamento.html · simuladores.html | 0 | 0 |
| css/estilo.css | 0 | 0 |

## 2. Navegação e links

- Script de conferência percorreu todas as páginas: **nenhum link interno quebrado**, nenhuma âncora
  (`#`) inexistente e nenhum arquivo de imagem, vídeo, áudio, CSS ou JS faltando.
- Menu com as páginas principais em todas as páginas, com a página atual marcada
  (`aria-current="page"`); rodapé com links para todas as 12 páginas.
- Menu do celular abre e fecha pelo botão e fecha com a tecla Esc.

## 3. Formulário de contato

| Teste | Resultado esperado | Resultado |
|-------|--------------------|-----------|
| Enviar vazio | Bloqueia (campos `required`) | ✅ bloqueou |
| E-mail `maria@` | Inválido (`type="email"`) | ✅ inválido |
| Telefone `123` | Inválido (`pattern`) | ✅ inválido |
| Telefone `(11) 91234-5678` | Válido | ✅ válido |
| Idade `10` | Inválido (`min="14"`) | ✅ inválido |
| Data anterior a 03/11/2026 | Inválido (`min` no `type="date"`) | ✅ campo restringe |
| Todos os campos corretos + aceite LGPD | Mostra confirmação | ✅ "Obrigado, Maria! Mensagem validada…" |

Todos os campos têm `<label for>` ligado ao `id` e textos de ajuda com `aria-describedby`.

## 4. Multimídia

| Recurso | Teste | Resultado |
|---------|-------|-----------|
| `<video controls poster>` | Carrega, mostra o pôster, 38 s | ✅ |
| Legendas (`<track kind="captions">`) | Faixa "Português" ativa por padrão | ✅ |
| `<audio controls>` | Carrega, 31 s | ✅ |
| `<iframe>` YouTube (Banco Central) | Carrega com legendas ativadas | ✅ |
| Transcrições | Disponíveis em "Ler a transcrição" | ✅ |

## 5. Responsividade

- Testado em 360 px (celular), 800 px (tablet) e 1280 px (desktop).
- Em 360 px, nenhuma das páginas tem rolagem horizontal; tabelas largas rolam dentro do próprio
  quadro.
- Menu horizontal a partir de 1200 px; abaixo disso, botão "Menu".

## 6. Acessibilidade

- `lang="pt-BR"` em todas as páginas; um único `<h1>` por página e títulos em ordem.
- Link "Pular para o conteúdo" como primeiro item do Tab.
- Todas as imagens com `alt` descritivo; ícones decorativos com `aria-hidden="true"`.
- Contraste AA com a paleta (texto `#1D1F21` em branco; branco em `#003B5C`).
- Navegação completa por teclado, com foco visível (contorno azul).
- Carrossel para com mouse ou foco e não anda sozinho com "reduzir movimento".
- Resultados dos simuladores e do formulário anunciados por leitor de tela (`aria-live`).
- Vídeo com legendas e transcrição; áudio com transcrição.

## 7. Desempenho

- Imagens em WebP: maior arquivo com 222 KB; galeria inteira com cerca de 640 KB.
- Imagens abaixo da dobra com `loading="lazy"` e `width`/`height` definidos.
- Sem frameworks, sem bibliotecas externas, sem rastreadores.
