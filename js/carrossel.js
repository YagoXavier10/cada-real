// Carrossel do Início (herdado do Bolso Coletivo): troca a cada 7 s, para com mouse ou foco
// e não anda sozinho para quem pede menos movimento.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var car = document.querySelector(".carrossel");
    if (!car) return;

    var trilho = car.querySelector(".carrossel__trilho");
    var slides = Array.prototype.slice.call(car.querySelectorAll(".slide"));
    var pontos = Array.prototype.slice.call(car.querySelectorAll(".ponto"));
    var atual = 0;
    var timer = null;
    var semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function mostrar(n) {
      atual = (n + slides.length) % slides.length;
      trilho.style.transform = "translateX(-" + atual * 100 + "%)";
      slides.forEach(function (s, k) {
        var ativo = k === atual;
        s.setAttribute("aria-hidden", ativo ? "false" : "true");
        // Links de slides escondidos saem da ordem do Tab
        s.querySelectorAll("a").forEach(function (a) { a.tabIndex = ativo ? 0 : -1; });
      });
      pontos.forEach(function (p, k) {
        if (k === atual) p.setAttribute("aria-current", "true");
        else p.removeAttribute("aria-current");
      });
    }

    function parar() { if (timer) { window.clearInterval(timer); timer = null; } }
    function iniciar() {
      if (semMovimento || slides.length < 2) return;
      parar();
      timer = window.setInterval(function () { mostrar(atual + 1); }, 7000);
    }

    car.querySelector(".carrossel__seta--ant").addEventListener("click", function () { mostrar(atual - 1); iniciar(); });
    car.querySelector(".carrossel__seta--prox").addEventListener("click", function () { mostrar(atual + 1); iniciar(); });
    pontos.forEach(function (p, k) {
      p.addEventListener("click", function () { mostrar(k); iniciar(); });
    });

    car.addEventListener("mouseenter", parar);
    car.addEventListener("mouseleave", iniciar);
    car.addEventListener("focusin", parar);
    car.addEventListener("focusout", iniciar);

    mostrar(0);
    iniciar();
  });
})();
