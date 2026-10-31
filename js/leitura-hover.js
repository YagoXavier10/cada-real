// Lê em voz alta o conteúdo sobre o qual o mouse passa, com preferência salva no navegador.
(function () {
  "use strict";

  var CHAVE_PREFERENCIA = "cada-real-leitura-hover";
  var SELETOR_LEITURA = "a, button, label, input, select, textarea, summary, img[alt], [role='button'], [role='link'], h1, h2, h3, h4, h5, h6, p, li, dt, dd, th, td, figcaption, blockquote, [aria-label]";
  var synth = window.speechSynthesis;
  var suporte = synth && window.SpeechSynthesisUtterance;
  var ativo = false;
  var ultimoAlvo = null;
  var ultimoTexto = "";

  function lerPreferencia() {
    try {
      return window.localStorage.getItem(CHAVE_PREFERENCIA) === "ativa";
    } catch (erro) {
      console.warn("Não foi possível carregar a preferência de leitura por áudio.", erro);
      return false;
    }
  }

  function salvarPreferencia() {
    try {
      window.localStorage.setItem(CHAVE_PREFERENCIA, ativo ? "ativa" : "inativa");
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de leitura por áudio.", erro);
    }
  }

  function encontrarAlvo(elemento) {
    if (!elemento || elemento.nodeType !== 1) return null;
    return elemento.closest(SELETOR_LEITURA);
  }

  function textoDoAlvo(elemento) {
    var rotulo = elemento.getAttribute("aria-label");
    if (rotulo) return rotulo;

    var idsRotulos = elemento.getAttribute("aria-labelledby");
    if (idsRotulos) {
      var textoRotulos = idsRotulos.split(/\s+/).map(function (id) {
        var rotuloRelacionado = document.getElementById(id);
        return rotuloRelacionado ? rotuloRelacionado.textContent : "";
      }).join(" ");
      if (textoRotulos.trim()) return textoRotulos;
    }

    if (/^(INPUT|SELECT|TEXTAREA)$/.test(elemento.tagName)) {
      var labels = elemento.labels ? Array.prototype.map.call(elemento.labels, function (label) {
        return label.textContent;
      }).join(" ") : "";
      return labels || elemento.getAttribute("placeholder") || elemento.getAttribute("title") || "";
    }

    if (elemento.tagName === "IMG") return elemento.getAttribute("alt") || "";
    var texto = elemento.innerText || elemento.textContent || elemento.getAttribute("title") || "";
    return texto.replace(/\s+/g, " ").trim();
  }

  function atualizarBotao(botao) {
    botao.setAttribute("aria-pressed", ativo ? "true" : "false");
    botao.setAttribute("aria-label", ativo
      ? "Desativar leitura por áudio ao passar o mouse"
      : "Ativar leitura por áudio ao passar o mouse");
    botao.textContent = ativo ? "Leitura por áudio: ligada" : "Leitura por áudio: desligada";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var botao = document.createElement("button");
    botao.className = "leitura-hover__botao";
    botao.type = "button";

    if (!suporte) {
      botao.disabled = true;
      botao.textContent = "Leitura por áudio indisponível neste navegador";
      botao.setAttribute("aria-label", botao.textContent);
    } else {
      ativo = lerPreferencia();
      atualizarBotao(botao);
      botao.addEventListener("click", function () {
        ativo = !ativo;
        ultimoAlvo = null;
        ultimoTexto = "";
        if (!ativo) synth.cancel();
        salvarPreferencia();
        atualizarBotao(botao);
      });

      document.addEventListener("pointerover", function (evento) {
        if (!ativo || evento.pointerType !== "mouse") return;
        var alvo = encontrarAlvo(evento.target);
        if (!alvo || botao.contains(alvo) || alvo.closest("[aria-hidden='true'], [hidden], script, style")) return;

        var texto = textoDoAlvo(alvo);
        if (!texto || (alvo === ultimoAlvo && texto === ultimoTexto)) return;

        ultimoAlvo = alvo;
        ultimoTexto = texto;
        synth.cancel();

        var fala = new window.SpeechSynthesisUtterance(texto);
        fala.lang = "pt-BR";
        var vozes = synth.getVoices();
        fala.voice = vozes.find(function (voz) {
          return voz.lang.toLowerCase() === "pt-br";
        }) || vozes.find(function (voz) {
          return voz.lang.toLowerCase().indexOf("pt-") === 0;
        }) || null;
        synth.speak(fala);
      });

      document.addEventListener("pointerout", function (evento) {
        if (evento.pointerType !== "mouse") return;
        var anterior = encontrarAlvo(evento.target);
        var proximo = encontrarAlvo(evento.relatedTarget);
        if (anterior && anterior !== proximo && anterior === ultimoAlvo) {
          ultimoAlvo = null;
          ultimoTexto = "";
        }
      });
    }

    document.body.appendChild(botao);
  });
})();
