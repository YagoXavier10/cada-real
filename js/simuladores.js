// Simuladores: recalculam a cada alteração. Nenhum dado sai do navegador.
(function () {
  "use strict";

  var moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  var mesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

  // Lê um campo numérico; vazio ou inválido vira 0
  function numero(form, nome) {
    var campo = form.elements[nome];
    var v = campo ? parseFloat(String(campo.value).replace(",", ".")) : NaN;
    return isFinite(v) && v > 0 ? v : 0;
  }

  function escrever(form, chave, texto) {
    var saida = form.querySelector('[data-saida="' + chave + '"]');
    if (saida) saida.textContent = texto;
  }

  // Valor futuro de depósitos mensais iguais (juros compostos)
  function valorFuturo(deposito, taxa, meses) {
    if (taxa === 0) return deposito * meses;
    return deposito * ((Math.pow(1 + taxa, meses) - 1) / taxa);
  }

  function plural(n, um, varios) { return n + " " + (n === 1 ? um : varios); }

  var calculos = {
    "sim-gasto": function (f) {
      var porAno = numero(f, "valor") * numero(f, "frequencia");
      var porMes = porAno / 12;
      escrever(f, "mes", moeda.format(porMes));
      escrever(f, "ano", moeda.format(porAno));
      escrever(f, "dez", moeda.format(porAno * 10));
      escrever(f, "guardado", moeda.format(valorFuturo(porMes, numero(f, "taxa") / 100, 120)));
    },

    "sim-cartao": function (f) {
      var divida = numero(f, "valor");
      var meses = Math.min(Math.round(numero(f, "meses")), 24);
      var semTeto = divida * Math.pow(1 + numero(f, "taxa") / 100, meses);
      // Lei 14.690/2023: juros e encargos do rotativo limitados a 100% da dívida original
      var comTeto = Math.min(semTeto, divida * 2);
      escrever(f, "semTeto", moeda.format(semTeto));
      escrever(f, "comTeto", moeda.format(comTeto));
      escrever(f, "juros", moeda.format(comTeto - divida));
    },

    "sim-reserva": function (f) {
      var meta = numero(f, "custo") * numero(f, "cobertura");
      var aporte = numero(f, "aporte");
      var taxa = numero(f, "taxa") / 100;
      escrever(f, "meta", moeda.format(meta));

      if (meta === 0) { escrever(f, "tempo", "—"); escrever(f, "data", "—"); return; }
      if (aporte === 0) { escrever(f, "tempo", "Defina um valor"); escrever(f, "data", "—"); return; }

      var meses = 0, saldo = 0;
      while (saldo < meta && meses < 600) { saldo = saldo * (1 + taxa) + aporte; meses++; }
      if (saldo < meta) { escrever(f, "tempo", "Mais de 50 anos"); escrever(f, "data", "—"); return; }

      var anos = Math.floor(meses / 12), resto = meses % 12, partes = [];
      if (anos) partes.push(plural(anos, "ano", "anos"));
      if (resto) partes.push(plural(resto, "mês", "meses"));
      escrever(f, "tempo", partes.join(" e "));

      var chegada = new Date();
      chegada.setDate(1);
      chegada.setMonth(chegada.getMonth() + meses);
      escrever(f, "data", mesAno.format(chegada));
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    Object.keys(calculos).forEach(function (id) {
      var form = document.getElementById(id);
      if (!form) return;
      var calcular = function () { calculos[id](form); };
      form.addEventListener("input", calcular);
      form.addEventListener("change", calcular);
      form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
      calcular();
    });
  });
})();
