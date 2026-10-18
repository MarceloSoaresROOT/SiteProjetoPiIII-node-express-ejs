document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('formClienteCompleto');
  if (!form) return;

  var modalEl = document.getElementById('modalAdicionar');
  var erroForm = document.getElementById('erroAdicionarCliente');
  var cliCep = document.getElementById('cliCep');

  function limparTudo() {
    form.querySelectorAll('.is-valid, .is-invalid').forEach(function (campo) { limparValidacao(campo); });
    var erroCep = document.getElementById('erroCepCliente');
    if (erroCep) erroCep.textContent = '';
    erroForm.classList.add('d-none');
  }

  // CEP: preenche o endereço ao sair do campo
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

  // Ao abrir o modal limpa as marcações; ao fechar limpa o formulário
  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', limparTudo);
    modalEl.addEventListener('hidden.bs.modal', function () {
      form.reset();
      document.getElementById('idEdicao').value = '';
      limparTudo();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var editando = document.getElementById('idEdicao').value != '';

    function validar(campo, condicao) {
      if (condicao) campoValido(campo); else { campoInvalido(campo); ok = false; }
    }

    // tb_pessoa
    var email = document.getElementById('cliEmail');
    var emailConf = document.getElementById('cliEmailConf');
    var senha = document.getElementById('cliSenha');
    var senhaConf = document.getElementById('cliSenhaConf');
    var tel = document.getElementById('cliTelefone');

    validar(email, email.value.indexOf('@') > 0 && email.value.indexOf('.') > 0);
    validar(emailConf, emailConf.value == email.value && emailConf.value != '');

    // ao editar, senha em branco mantém a senha atual
    if (editando && senha.value == '' && senhaConf.value == '') {
      limparValidacao(senha);
      limparValidacao(senhaConf);
    } else {
      validar(senha, senha.value.length >= 6);
      validar(senhaConf, senhaConf.value == senha.value && senhaConf.value != '');
    }

    if (tel.value.trim() != '') validar(tel, limparNumero(tel.value).length == 10 || limparNumero(tel.value).length == 11); else limparValidacao(tel);

    // tb_pessoa_fisica
    var nome = document.getElementById('cliNome');
    var cpf = document.getElementById('cliCpf');
    var nasc = document.getElementById('cliNascimento');

    validar(nome, textoSemNumero(nome.value) && nome.value.trim().length >= 3);
    validar(cpf, validarCPFValor(cpf.value));

    var dataMinima = "1920-01-01";
    var dataMaxima = "2026-12-31";
    validar(nasc, nasc.value >= dataMinima && nasc.value <= dataMaxima);
    if (nasc.value != "" && nasc.value < dataMinima) {
      document.getElementById("erroData").innerHTML = "A data não pode ser menor que 1920.";
    } else if (nasc.value != "" && nasc.value > dataMaxima) {
      document.getElementById("erroData").innerHTML = "A data não pode ser maior que 2026.";
    } else {
      document.getElementById("erroData").innerHTML = "Informe uma data entre 1920 e 2026.";
    }

    // tb_socio
    var dataCadastro = document.getElementById('cliDataCadastro');
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    var dataEscolhida = new Date(dataCadastro.value + 'T00:00:00');
    validar(dataCadastro, dataCadastro.value != '' && dataEscolhida <= hoje);

    // tb_endereco
    var cep = document.getElementById('cliCep');
    var rua = document.getElementById('cliRua');
    var numero = document.getElementById('cliNumero');
    var bairro = document.getElementById('cliBairro');
    var cidade = document.getElementById('cliCidade');
    var estado = document.getElementById('cliEstado');

    validar(cep, limparNumero(cep.value).length == 8);
    validar(rua, rua.value.trim().length >= 4);
    validar(numero, Number(numero.value) > 0);
    validar(bairro, bairro.value.trim().length >= 3);
    validar(cidade, textoSemNumero(cidade.value) && cidade.value.trim().length >= 3);
    validar(estado, estado.value != '');

    if (!ok) {
      erroForm.textContent = 'Preencha corretamente os campos obrigatórios.';
      erroForm.classList.remove('d-none');
      return;
    }
    erroForm.classList.add('d-none');

    // Formulário válido. O envio (fetch) entra aqui depois.
  });
});


// VALIDA DATA DE NASCIMENTO (usada no onblur do campo)
function validarDataNascimento() {
  var data = document.getElementById("cliNascimento");
  var erro = document.getElementById("erroData");

  if (data.value == "") {
    data.classList.add("is-invalid");
    data.classList.remove("is-valid");
    erro.innerHTML = "Informe a data de nascimento.";
  } else if (data.value < "1920-01-01") {
    data.classList.add("is-invalid");
    data.classList.remove("is-valid");
    erro.innerHTML = "A data não pode ser menor que 1920.";
  } else if (data.value > "2026-12-31") {
    data.classList.add("is-invalid");
    data.classList.remove("is-valid");
    erro.innerHTML = "A data não pode ser maior que 2026.";
  } else {
    data.classList.remove("is-invalid");
    data.classList.add("is-valid");
    erro.innerHTML = "Informe uma data entre 1920 e 2026.";
  }
}
