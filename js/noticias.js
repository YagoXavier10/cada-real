// Notícias do dia: lê dados/noticias.json (atualizado pelo GitHub Actions) e monta a lista.
// Na página Notícias mostra tudo, agrupado por dia e com filtro por tema; no Início, só as mais recentes.
(function () {
  "use strict";

  var dataLonga = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Sao_Paulo" });
  var dataHora = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  var hora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  var diaChave = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }); // AAAA-MM-DD

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  function rotuloDia(data) {
    var hoje = diaChave.format(new Date());
    var ontem = diaChave.format(new Date(Date.now() - 864e5));
    var chave = diaChave.format(data);
    if (chave === hoje) return "Hoje";
    if (chave === ontem) return "Ontem";
    var t = dataLonga.format(data);
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function item(n, mostrarDia) {
    var data = new Date(n.data);
    var li = el("li", "noticia");
    var meta = el("p", "noticia__meta");
    meta.appendChild(el("span", "noticia__fonte", n.fonte));
    meta.appendChild(el("span", "noticia__tema", n.tema));
    var quando = el("time", "noticia__hora", mostrarDia ? dataHora.format(data) : hora.format(data));
    quando.dateTime = n.data;
    meta.appendChild(quando);
    var titulo = el("h3", "noticia__titulo");
    var link = el("a", null, n.titulo);
    link.href = n.link;
    link.rel = "noopener";
    link.target = "_blank";
    link.appendChild(el("span", "sr-only", " (abre em nova aba, no site " + n.fonte + ")"));
    titulo.appendChild(link);
    li.appendChild(meta);
    li.appendChild(titulo);
    return li;
  }

  function montarPagina(dados, lista, status, filtros) {
    var noticias = dados.noticias;
    var temaAtual = "Todos";

    function desenhar() {
      lista.textContent = "";
      var visiveis = noticias.filter(function (n) { return temaAtual === "Todos" || n.tema === temaAtual; });
      var grupoAtual = null, ul = null;
      visiveis.forEach(function (n) {
        var rotulo = rotuloDia(new Date(n.data));
        if (rotulo !== grupoAtual) {
          grupoAtual = rotulo;
          lista.appendChild(el("h2", "noticias-dia", rotulo));
          ul = el("ul", "noticias-lista");
          lista.appendChild(ul);
        }
        ul.appendChild(item(n, false));
      });
      status.textContent = visiveis.length + (visiveis.length === 1 ? " notícia" : " notícias") +
        (temaAtual === "Todos" ? "" : " sobre " + temaAtual) +
        " · atualizado em " + dataHora.format(new Date(dados.atualizado));
    }

    var temas = ["Todos"];
    noticias.forEach(function (n) { if (temas.indexOf(n.tema) < 0) temas.push(n.tema); });
    temas.forEach(function (tema) {
      var botao = el("button", "filtro", tema);
      botao.type = "button";
      botao.setAttribute("aria-pressed", tema === temaAtual ? "true" : "false");
      botao.addEventListener("click", function () {
        temaAtual = tema;
        filtros.querySelectorAll(".filtro").forEach(function (b) {
          b.setAttribute("aria-pressed", b === botao ? "true" : "false");
        });
        desenhar();
      });
      filtros.appendChild(botao);
    });
    filtros.hidden = false;
    desenhar();
  }

  function montarResumo(dados, ul) {
    var limite = parseInt(ul.dataset.limite, 10) || 4;
    dados.noticias.slice(0, limite).forEach(function (n) { ul.appendChild(item(n, true)); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var lista = document.getElementById("lista-noticias");
    var resumo = document.getElementById("ultimas-noticias");
    if (!lista && !resumo) return;
    var status = document.getElementById("noticias-status");

    fetch("dados/noticias.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (dados) {
        if (!dados.noticias || !dados.noticias.length) throw new Error("vazio");
        if (lista) montarPagina(dados, lista, status, document.querySelector(".filtros"));
        if (resumo) montarResumo(dados, resumo);
      })
      .catch(function () {
        if (status) status.textContent = "Não foi possível carregar as notícias agora. Tente de novo mais tarde.";
        if (resumo) resumo.closest("section").hidden = true;
      });
  });
})();
