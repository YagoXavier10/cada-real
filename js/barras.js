// Gráfico de barras: a largura vem de data-valor / data-maximo, assim o HTML não precisa de CSS inline.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".barra[data-valor]").forEach(function (barra) {
      var valor = parseFloat(barra.dataset.valor);
      var maximo = parseFloat(barra.dataset.maximo) || valor;
      var preenchimento = barra.querySelector(".barra__valor");
      if (!preenchimento || !maximo) return;
      // Espera um quadro para a transição de largura acontecer
      requestAnimationFrame(function () {
        preenchimento.style.width = Math.max(2, (valor / maximo) * 100) + "%";
      });
    });
  });
})();
