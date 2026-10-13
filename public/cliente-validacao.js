document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('formClienteCompleto');
  if (!form) return;

  var obs = document.getElementById('cliObs');
  var contador = document.getElementById('contadorObsCliente');
  var cliCep = document.getElementById('cliCep');
  obs.addEventListener('input', function () { contador.innerHTML = obs.value.length; });

  if (cliCep) {
    cliCep.addEventListener('blur', function () {
      preencherEnderecoCep('cliCep', 'cliRua', 'cliBairro', 'cliCidade', 'cliEstado', 'erroCepCliente');
    });
    cliCep.addEventListener('input', function () {
      var erroCep = document.getElementById('erroCepCliente');
      if (erroCep) erroCep.textContent = '';
      limparValidacao(cliCep);
    });
  }

  document.getElementById('btnLimparCliente').addEventListener('click', function () {
    setTimeout(function () {
      form.querySelectorAll('.is-valid, .is-invalid').forEach(function (campo) { limparValidacao(campo); });
      document.getElementById('erroInteresses').innerHTML = '';
      document.getElementById('msgSucessoCliente').classList.add('d-none');
      contador.innerHTML = '0';
    }, 50);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    function validar(campo, condicao) {
      if (condicao) campoValido(campo); else { campoInvalido(campo); ok = false; }
    }

    var nome = document.getElementById('cliNome');
    var cpf = document.getElementById('cliCpf');
    var nasc = document.getElementById('cliNascimento');
    var celular = document.getElementById('cliCelular');
    var tel = document.getElementById('cliTelefone');
    var email = document.getElementById('cliEmail');
    var emailConf = document.getElementById('cliEmailConf');
    var cep = document.getElementById('cliCep');
    var rua = document.getElementById('cliRua');
    var numero = document.getElementById('cliNumero');
    var bairro = document.getElementById('cliBairro');
    var cidade = document.getElementById('cliCidade');
    var estado = document.getElementById('cliEstado');
    var entrega = document.getElementById('cliEntrega');
    var pagamento = document.getElementById('cliPagamento');
    var senha = document.getElementById('cliSenha');
    var senhaConf = document.getElementById('cliSenhaConf');

    validar(nome, textoSemNumero(nome.value) && nome.value.trim().length >= 3);
    validar(cpf, validarCPFValor(cpf.value));

    var dataMinima = "1920-01-01";
    var dataMaxima = "2026-12-31";
    validar(
    nasc,
    nasc.value >= "1920-01-01" &&
    nasc.value <= "2026-12-31"
);
    if (nasc.value != "" && nasc.value < dataMinima) {
      document.getElementById("erroData").innerHTML = "A data não pode ser menor que 1920.";
    } else if (nasc.value != "" && nasc.value > dataMaxima) {
      document.getElementById("erroData").innerHTML = "A data não pode ser maior que 2026.";
    } else {
      document.getElementById("erroData").innerHTML = "Informe uma data entre 1920 e 2026.";
    }

    validar(celular, limparNumero(celular.value).length == 11);
    if (tel.value.trim() != '') validar(tel, limparNumero(tel.value).length >= 10); else limparValidacao(tel);
    validar(email, email.value.indexOf('@') > 0 && email.value.indexOf('.') > 0);
    validar(emailConf, emailConf.value == email.value && emailConf.value != '');
    validar(cep, limparNumero(cep.value).length == 8);
    validar(rua, rua.value.trim().length >= 4);
    validar(numero, Number(numero.value) > 0);
    validar(bairro, bairro.value.trim().length >= 3);
    validar(cidade, textoSemNumero(cidade.value) && cidade.value.trim().length >= 3);
    validar(estado, estado.value != '');
    validar(entrega, entrega.value != '');
    validar(pagamento, pagamento.value != '');
    validar(senha, senha.value.length >= 6);
    validar(senhaConf, senhaConf.value == senha.value && senhaConf.value != '');

    var interesses = document.querySelectorAll('.interesse-cliente:checked');
    var erroInteresses = document.getElementById('erroInteresses');
    if (interesses.length == 0) { erroInteresses.innerHTML = 'Selecione pelo menos um interesse.'; ok = false; }
    else erroInteresses.innerHTML = '';

    if (obs.value.trim() != '') validar(obs, obs.value.trim().length >= 10); else limparValidacao(obs);

    var msg = document.getElementById('msgSucessoCliente');
    if (ok) {
      var dados = {
        nome: nome.value, cpf: cpf.value, dataNascimento: nasc.value, celular: celular.value, telefone: tel.value,
        email: email.value, cep: cep.value, rua: rua.value, numero: numero.value, bairro: bairro.value,
        cidade: cidade.value, estado: estado.value, complemento: document.getElementById('cliComplemento').value,
        preferenciaEntrega: entrega.value, pagamentoPreferido: pagamento.value, senha: senha.value,
        interesses: Array.prototype.map.call(interesses, function (i) { return i.value; }),
        observacoes: obs.value
      };

      fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
        .then(function (resp) { return resp.json().catch(function () { return {}; }).then(function (corpo) { return { ok: resp.ok, corpo: corpo }; }); })
        .then(function (r) {
          msg.classList.remove('d-none', 'alert-success', 'alert-danger');
          if (r.ok) {
            msg.classList.add('alert-success');
            msg.innerHTML = 'Cliente cadastrado com sucesso.';
          } else {
            msg.classList.add('alert-danger');
            msg.innerHTML = r.corpo.erro || 'Não foi possível cadastrar o cliente.';
          }
          msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          msg.classList.remove('d-none', 'alert-success');
          msg.classList.add('alert-danger');
          msg.innerHTML = 'Erro de conexão com o servidor.';
        });
    }
  });
});






// VALIDA DATA DE ANIVERSARIO

function validarDataNascimento(){

    let data = document.getElementById("cliNascimento");
    let erro = document.getElementById("erroData");

    if(data.value == ""){

        data.classList.add("is-invalid");
        data.classList.remove("is-valid");

        erro.innerHTML =
        "Informe a data de nascimento.";

    }

    else if(data.value < "1920-01-01"){

        data.classList.add("is-invalid");
        data.classList.remove("is-valid");

        erro.innerHTML =
        "A data não pode ser menor que 1920.";

    }

    else if(data.value > "2026-12-31"){

        data.classList.add("is-invalid");
        data.classList.remove("is-valid");

        erro.innerHTML =
        "A data não pode ser maior que 2026.";

    }

    else{

        data.classList.remove("is-invalid");
        data.classList.add("is-valid");

        erro.innerHTML = "Informe uma data entre 1920 e 2026.";

    }

}
