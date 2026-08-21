document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('formCadastroFornecedor');
  var observacoes = document.getElementById('observacoes');
  var contadorObs = document.getElementById('contadorObs');
  var msgSucesso = document.getElementById('msgSucesso');
  var cep = document.getElementById('cep');

  observacoes.addEventListener('input', function () {
    contadorObs.innerHTML = observacoes.value.length;
  });

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

  document.getElementById('btnLimpar').addEventListener('click', function () {
    setTimeout(function () {
      var campos = form.querySelectorAll('.is-valid, .is-invalid');
      for (i = 0; i < campos.length; i++) limparValidacao(campos[i]);
      document.getElementById('erroEntrega').innerHTML = '';
      document.getElementById('erroProdutos').innerHTML = '';
      contadorObs.innerHTML = '0';
      msgSucesso.classList.add('d-none');
    }, 50);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valido = true;

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

    validarTexto('razaoSocial', 3);
    validarTexto('nomeFantasia', 3);
    validarTexto('logradouro', 3);
    validarTexto('bairro', 3);

    var responsavel = document.getElementById('responsavel');
    if (responsavel.value.trim().length >= 3 && textoSemNumero(responsavel.value)) {
      campoValido(responsavel);
    } else {
      campoInvalido(responsavel);
      valido = false;
    }

    var cidade = document.getElementById('cidade');
    if (cidade.value.trim().length >= 3 && textoSemNumero(cidade.value)) {
      campoValido(cidade);
    } else {
      campoInvalido(cidade);
      valido = false;
    }

    var cnpj = document.getElementById('cnpj');
    if (validarCNPJValor(cnpj.value)) campoValido(cnpj); else { campoInvalido(cnpj); valido = false; }

    var inscricao = document.getElementById('inscricaoEstadual');
    if (inscricao.value == '' || limparNumero(inscricao.value).length >= 6) campoValido(inscricao); else { campoInvalido(inscricao); valido = false; }

    var dataCadastro = document.getElementById('dataCadastro');
    var hoje = new Date();
    hoje.setHours(0,0,0,0);
    var dataEscolhida = new Date(dataCadastro.value + 'T00:00:00');
    if (dataCadastro.value != '' && dataEscolhida <= hoje) campoValido(dataCadastro); else { campoInvalido(dataCadastro); valido = false; }

    var email = document.getElementById('email');
    if (email.value.indexOf('@') > 0 && email.value.indexOf('.') > 0) campoValido(email); else { campoInvalido(email); valido = false; }

    var telefone = document.getElementById('telefone');
    if (limparNumero(telefone.value).length == 10 || limparNumero(telefone.value).length == 11) campoValido(telefone); else { campoInvalido(telefone); valido = false; }

    var celular = document.getElementById('celular');
    if (celular.value == '' || limparNumero(celular.value).length == 11) campoValido(celular); else { campoInvalido(celular); valido = false; }

    var cep = document.getElementById('cep');
    if (limparNumero(cep.value).length == 8) campoValido(cep); else { campoInvalido(cep); valido = false; }

    var numero = document.getElementById('numero');
    if (limparNumero(numero.value).length >= 1) campoValido(numero); else { campoInvalido(numero); valido = false; }

    var estado = document.getElementById('estado');
    if (estado.value != '') campoValido(estado); else { campoInvalido(estado); valido = false; }

    var categoria = document.getElementById('categoriaPrincipal');
    if (categoria.value != '') campoValido(categoria); else { campoInvalido(categoria); valido = false; }

    var valorMinimo = document.getElementById('valorMinimo');
    var valor = valorMoedaNumero(valorMinimo.value);
    if (valor >= 50 && valor <= 50000) campoValido(valorMinimo); else { campoInvalido(valorMinimo); valido = false; }

    var prazo = document.getElementById('prazoEntrega');
    if (prazo.value != '') campoValido(prazo); else { campoInvalido(prazo); valido = false; }

    var entrega = document.querySelector('input[name="tipoEntrega"]:checked');
    if (entrega == null) {
      document.getElementById('erroEntrega').innerHTML = 'Selecione o tipo de entrega.';
      valido = false;
    } else {
      document.getElementById('erroEntrega').innerHTML = '';
    }

    var produtos = document.querySelectorAll('.produto-fornecido:checked');
    if (produtos.length == 0) {
      document.getElementById('erroProdutos').innerHTML = 'Selecione pelo menos um tipo de produto.';
      valido = false;
    } else {
      document.getElementById('erroProdutos').innerHTML = '';
    }

    if (observacoes.value.trim() != '' && observacoes.value.trim().length < 10) {
      campoInvalido(observacoes);
      valido = false;
    } else {
      campoValido(observacoes);
    }

    if (valido) {
      msgSucesso.classList.remove('d-none');
      msgSucesso.innerHTML = 'Fornecedor cadastrado com sucesso. Validações aplicadas com JavaScript e Bootstrap.';
      form.scrollIntoView({ behavior: 'smooth' });
    } else {
      msgSucesso.classList.add('d-none');
    }
  });
});
