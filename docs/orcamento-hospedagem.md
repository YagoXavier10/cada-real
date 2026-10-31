# Orçamento de hospedagem e domínio

Relatório comparativo de hospedagem e domínio. A página `orcamento_hospedagem.html` foi retirada do
site por enquanto e pode voltar a partir do histórico do Git.

> Valores consultados em 31/10/2026. Planos pagos têm preço promocional no primeiro ciclo e renovação
> mais cara. Confirme no site de cada empresa antes de contratar.

## Necessidades do site

- Site estático (~4 MB), sem banco de dados, com HTTPS.
- Uma tarefa automática diária (notícias).
- Custo zero ou muito baixo (projeto educativo).

## Hospedagem

| Critério | GitHub Pages | Hostinger — Premium | HostGator — Plano P |
|----------|--------------|---------------------|---------------------|
| Preço | Grátis | ≈ R$ 12,99/mês (promoção) | ≈ R$ 9,89/mês (promoção, 3 anos) |
| Custo no 1º ano | R$ 0 | ≈ R$ 156 | ≈ R$ 119 |
| Tipo | Sites estáticos | Compartilhada | Compartilhada |
| HTTPS | Automático | SSL grátis | SSL grátis |
| Domínio incluso | Não | 1º ano (planos anuais) | 1 ano (ciclo anual ou maior) |
| Publicação | Automática via Git | Painel/FTP | cPanel/FTP |
| Tarefa diária | GitHub Actions | Cron | Cron |
| Suporte em português | Não | Sim | Sim |
| PHP / banco de dados | Não | Sim | Sim |

## Domínio (`cadareal.com.br`)

| Critério | Registro.br | Hostinger | Locaweb |
|----------|-------------|-----------|---------|
| Preço | R$ 40,00/ano | ≈ R$ 29,90 no 1º ano | ≈ R$ 34,90 no 1º ano |
| Renovação | R$ 40,00/ano (fixo) | Preço cheio | Preço cheio |
| Quem é | Órgão oficial do .br | Revendedor | Revendedor |

## Cenários (1º ano)

| Cenário | Hospedagem | Domínio | Total |
|---------|------------|---------|-------|
| A — atual | GitHub Pages | github.io | R$ 0 |
| **B — escolhido** | **GitHub Pages** | **Registro.br** | **R$ 40** |
| C — tradicional | HostGator Plano P | incluso | ≈ R$ 119 |

## Justificativa

1. **Custo:** R$ 40/ano, sem aumento na renovação.
2. **Encaixe técnico:** site estático + HTTPS automático + GitHub Actions grátis para as notícias.
3. **Fluxo:** publicação automática a cada push, com histórico de versões.
4. **Confiança:** domínio .com.br no órgão oficial, preço fixo.
5. **Sustentabilidade:** site leve, sem servidor dedicado, imagens WebP e sem rastreadores.

Se o projeto precisar de envio real do formulário, login ou banco de dados, a migração indicada é para
uma hospedagem compartilhada (HostGator ou Hostinger).

## Fontes

- GitHub Pages — https://docs.github.com/pt/pages
- Registro.br — https://registro.br/
- Hostinger — https://www.hostinger.com/br/tutoriais/quanto-custa-um-dominio-de-site/
- HostGator Brasil — https://www.hostgator.com.br/
- Tudo Sobre Hospedagem — https://tudosobrehospedagemdesites.com.br/registro-de-dominio/
- Cupom Online (HostGator 2026) — https://www.cupomonline.com.br/cupom-hostgator/
- Guia Ferramentas Digitais — https://guiaferramentasdigitais.com.br/guias/hostinger-vs-hostgator/
