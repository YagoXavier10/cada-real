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
  var vozEscolhida = null;

  // Prefere vozes neurais (Edge "Online (Natural)", Google) às vozes locais, que soam robóticas.
  function pontuarVoz(voz) {
    var nome = (voz.name + " " + voz.voiceURI).toLowerCase();
    var idioma = voz.lang.toLowerCase().replace("_", "-");
    if (idioma.indexOf("pt") !== 0) return -1;
    var pontos = idioma === "pt-br" ? 10 : 0;
    if (/natural|neural|online/.test(nome)) pontos += 100;
    if (/google/.test(nome)) pontos += 50;
    if (/francisca|thalita|maria/.test(nome)) pontos += 20;
    if (!voz.localService) pontos += 5;
    return pontos;
  }

  function escolherVoz() {
    if (vozEscolhida) return vozEscolhida;
    var melhor = null;
    var melhorPontos = -1;
    synth.getVoices().forEach(function (voz) {
      var pontos = pontuarVoz(voz);
      if (pontos > melhorPontos) {
        melhor = voz;
        melhorPontos = pontos;
      }
    });
    vozEscolhida = melhor;
    return melhor;
  }

  if (suporte && "onvoiceschanged" in synth) {
    synth.addEventListener("voiceschanged", function () {
      vozEscolhida = null;
    });
  }

  // Áudios com voz neural gerados por scripts/gerar_audios.py; o texto que não tiver um usa a voz do navegador.
  var PASTA_AUDIOS = "assets/audio/leitura/";
  var audiosProntos = {};
  var audioAtual = null;

  function carregarIndiceAudios() {
    if (!window.fetch) return;
    fetch(PASTA_AUDIOS + "indice.json").then(function (resposta) {
      return resposta.ok ? resposta.json() : { audios: [] };
    }).then(function (indice) {
      indice.audios.forEach(function (hash) { audiosProntos[hash] = true; });
    }).catch(function (erro) {
      console.warn("Não foi possível carregar os áudios da leitura; usando a voz do navegador.", erro);
    });
  }

  // FNV-1a de 32 bits sobre os bytes UTF-8 — igual ao hash_texto() de scripts/gerar_audios.py.
  function hashTexto(texto) {
    var bytes = unescape(encodeURIComponent(texto));
    var h = 0x811c9dc5;
    for (var i = 0; i < bytes.length; i++) {
      h ^= bytes.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }

  function pararLeitura() {
    if (audioAtual) {
      audioAtual.pause();
      audioAtual = null;
    }
    if (synth) synth.cancel();
  }

  function falarComNavegador(texto) {
    if (!suporte) return;
    var fala = new window.SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.voice = escolherVoz();
    fala.rate = 1.05;
    synth.speak(fala);
  }

  function ler(texto) {
    pararLeitura();
    var hash = hashTexto(texto);
    if (!audiosProntos[hash]) {
      falarComNavegador(texto);
      return;
    }
    var audio = new Audio(PASTA_AUDIOS + hash + ".mp3");
    audioAtual = audio;
    audio.play().catch(function () {
      if (audioAtual === audio) falarComNavegador(texto);
    });
  }

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
      carregarIndiceAudios();
      botao.addEventListener("click", function () {
        ativo = !ativo;
        ultimoAlvo = null;
        ultimoTexto = "";
        if (!ativo) pararLeitura();
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
        ler(texto);
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
