// Formulário de contato: a validação é do próprio HTML5 (required, type, pattern, min/max).
// Como o site é estático, nada é enviado; ao passar na validação mostramos uma confirmação.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-contato");
    var retorno = document.getElementById("form-retorno");
    if (!form || !retorno) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var nome = form.elements.nome.value.trim().split(" ")[0];
      retorno.textContent = "Obrigado, " + nome + "! Mensagem validada. Este é um projeto acadêmico, então ela não foi enviada de verdade.";
      form.reset();
    });
  });
})();
