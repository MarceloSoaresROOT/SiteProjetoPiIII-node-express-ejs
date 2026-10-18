document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('formCadastroFuncionario');
  if (!form) return;

  var modalEl = document.getElementById('modalAdicionar');
  var erroForm = document.getElementById('erroAdicionarFuncionario');
  var funCep = document.getElementById('funCep');

  function limparTudo() {
    form.querySelectorAll('.is-valid, .is-invalid').forEach(function (campo) { limparValidacao(campo); });
    var erroCep = document.getElementById('erroCepFuncionario');
    if (erroCep) erroCep.textContent = '';
    erroForm.classList.add('d-none');
  }

  // CEP: preenche o endereço ao sair do campo
  if (funCep) {
    funCep.addEventListener('blur', function () {
      preencherEnderecoCep('funCep', 'funRua', 'funBairro', 'funCidade', 'funEstado', 'erroCepFuncionario');
    });
    funCep.addEventListener('input', function () {
      var erroCep = document.getElementById('erroCepFuncionario');
      if (erroCep) erroCep.textContent = '';
      limparValidacao(funCep);
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

    // data não futura (formato yyyy-mm-dd)
    function dataNaoFutura(valor) {
      var hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return new Date(valor + 'T00:00:00') <= hoje;
    }

    // tb_pessoa
    var email = document.getElementById('funEmail');
    var emailConf = document.getElementById('funEmailConf');
    var senha = document.getElementById('funSenha');
    var senhaConf = document.getElementById('funSenhaConf');
    var tel = document.getElementById('funTelefone');

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
    var nome = document.getElementById('funNome');
    var cpf = document.getElementById('funCpf');
    var nasc = document.getElementById('funNascimento');

    validar(nome, textoSemNumero(nome.value) && nome.value.trim().length >= 3);
    validar(cpf, validarCPFValor(cpf.value));

    var dataMinima = "1920-01-01";
    var dataMaxima = "2026-12-31";
    validar(nasc, nasc.value >= dataMinima && nasc.value <= dataMaxima);
    if (nasc.value != "" && nasc.value < dataMinima) {
      document.getElementById("erroDataFun").innerHTML = "A data não pode ser menor que 1920.";
    } else if (nasc.value != "" && nasc.value > dataMaxima) {
      document.getElementById("erroDataFun").innerHTML = "A data não pode ser maior que 2026.";
    } else {
      document.getElementById("erroDataFun").innerHTML = "Informe uma data entre 1920 e 2026.";
    }

    // tb_funcionario
    var matricula = document.getElementById('funMatricula');
    var cargo = document.getElementById('funCargo');
    var admissao = document.getElementById('funAdmissao');

    validar(matricula, /^[A-Za-z0-9._-]{3,30}$/.test(matricula.value.trim()));
    if (cargo.value.trim() != '') validar(cargo, cargo.value.trim().length >= 3); else limparValidacao(cargo);
    if (admissao.value != '') validar(admissao, dataNaoFutura(admissao.value)); else limparValidacao(admissao);

    // tb_endereco
    var cep = document.getElementById('funCep');
    var rua = document.getElementById('funRua');
    var numero = document.getElementById('funNumero');
    var bairro = document.getElementById('funBairro');
    var cidade = document.getElementById('funCidade');
    var estado = document.getElementById('funEstado');

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
function validarDataNascimentoFuncionario() {
  var data = document.getElementById("funNascimento");
  var erro = document.getElementById("erroDataFun");

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
