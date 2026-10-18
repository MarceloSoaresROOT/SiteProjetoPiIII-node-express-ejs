document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('formCadastroFornecedor');
  if (!form) return;

  var modalEl = document.getElementById('modalAdicionar');
  var erroForm = document.getElementById('erroAdicionarFornecedor');
  var cep = document.getElementById('cep');

  function limparTudo() {
    var campos = form.querySelectorAll('.is-valid, .is-invalid');
    for (var i = 0; i < campos.length; i++) limparValidacao(campos[i]);
    var erroCep = document.getElementById('erroCepFornecedor');
    if (erroCep) erroCep.textContent = '';
    erroForm.classList.add('d-none');
  }

  // CEP: preenche o endereço ao sair do campo
  if (cep) {
    cep.addEventListener('blur', function () {
      preencherEnderecoCep('cep', 'logradouro', 'bairro', 'cidade', 'estado', 'erroCepFornecedor');
    });
    cep.addEventListener('input', function () {
      var erroCep = document.getElementById('erroCepFornecedor');
      if (erroCep) erroCep.textContent = '';
      limparValidacao(cep);
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
    var valido = true;
    var editando = document.getElementById('idEdicao').value != '';

    function validarTexto(id, minimo) {
      var campo = document.getElementById(id);
      if (campo.value.trim().length >= minimo) {
        campoValido(campo);
        return true;
      }
      campoInvalido(campo);
      valido = false;
      return false;
    }

    // tb_pessoa
    var email = document.getElementById('email');
    if (email.value.indexOf('@') > 0 && email.value.indexOf('.') > 0) campoValido(email); else { campoInvalido(email); valido = false; }

    var senha = document.getElementById('senha');
    if (editando || senha.value.length >= 1) campoValido(senha); else { campoInvalido(senha); valido = false; }

    var telefone = document.getElementById('telefone');
    if (limparNumero(telefone.value).length == 10 || limparNumero(telefone.value).length == 11) campoValido(telefone); else { campoInvalido(telefone); valido = false; }

    // tb_pessoa_juridica
    validarTexto('razaoSocial', 3);
    validarTexto('nomeFantasia', 3);

    var cnpj = document.getElementById('cnpj');
    if (validarCNPJValor(cnpj.value)) campoValido(cnpj); else { campoInvalido(cnpj); valido = false; }

    // tb_fornecedor
    var dataCadastro = document.getElementById('dataCadastro');
    var hoje = new Date();
    hoje.setHours(0,0,0,0);
    var dataEscolhida = new Date(dataCadastro.value + 'T00:00:00');
    if (dataCadastro.value != '' && dataEscolhida <= hoje) campoValido(dataCadastro); else { campoInvalido(dataCadastro); valido = false; }

    // tb_endereco
    validarTexto('logradouro', 3);
    validarTexto('bairro', 3);

    var cidade = document.getElementById('cidade');
    if (cidade.value.trim().length >= 3 && textoSemNumero(cidade.value)) {
      campoValido(cidade);
    } else {
      campoInvalido(cidade);
      valido = false;
    }

    var cepCampo = document.getElementById('cep');
    if (limparNumero(cepCampo.value).length == 8) campoValido(cepCampo); else { campoInvalido(cepCampo); valido = false; }

    var numero = document.getElementById('numero');
    if (limparNumero(numero.value).length >= 1) campoValido(numero); else { campoInvalido(numero); valido = false; }

    var estado = document.getElementById('estado');
    if (estado.value != '') campoValido(estado); else { campoInvalido(estado); valido = false; }

    if (!valido) {
      erroForm.textContent = 'Preencha corretamente os campos obrigatórios.';
      erroForm.classList.remove('d-none');
      return;
    }
    erroForm.classList.add('d-none');

    // Formulário válido. O envio (fetch) entra aqui depois.
  });
});