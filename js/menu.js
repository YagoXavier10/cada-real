// Menu do celular: abre e fecha a navegação. Sem JavaScript, o menu fica sempre aberto (classe .sem-js).
(function () {
  "use strict";

  document.documentElement.classList.remove("sem-js");

  document.addEventListener("DOMContentLoaded", function () {
    var botao = document.querySelector(".menu-botao");
    var menu = document.getElementById("menu-principal");
    if (!botao || !menu) return;

    function definir(aberto) {
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
      menu.classList.toggle("aberto", aberto);
    }

    botao.addEventListener("click", function () {
      definir(botao.getAttribute("aria-expanded") !== "true");
    });

    // Esc fecha o menu e devolve o foco ao botão
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
        definir(false);
        botao.focus();
      }
    });
  });
})();
