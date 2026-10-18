// Máscaras e validações simples no padrão da aula de JavaScript/DOM.
// Sem alert(): as mensagens aparecem com as classes do Bootstrap.

function somenteNumeroCampo(campo) {
  campo.value = campo.value.replace(/\D/g, '');
}

function limparNumero(valor) {
  return valor.replace(/\D/g, '');
}

function mascara(m, t, e) {
  var cursor = t.selectionStart;
  var texto = t.value;
  texto = texto.replace(/\D/g, '');
  var lm = m.length;

  if (window.event) {
    id = e.keyCode;
  } else if (e.which) {
    id = e.which;
  }

  cursorfixo = false;
  if (cursor < texto.length) cursorfixo = true;

  var livre = false;
  if (id == 16 || id == 19 || (id >= 33 && id <= 40)) livre = true;

  if (!livre && id != 8) {
    t.value = '';
    j = 0;
    for (i = 0; i < lm; i++) {
      if (m.substr(i, 1) == '#') {
        t.value += texto.substr(j, 1);
        j++;
      } else {
        t.value += m.substr(i, 1);
      }
      if (j == texto.length + 1) break;
    }
  }
}

function mTel() {
  var tel = event.target.value;
  tel = tel.replace(/\D/g, '');
  tel = tel.replace(/^(\d)/, '($1');
  tel = tel.replace(/(.{3})(\d)/, '$1)$2');
  if (tel.length == 9) {
    tel = tel.replace(/(.{1})$/, '-$1');
  } else if (tel.length == 10) {
    tel = tel.replace(/(.{2})$/, '-$1');
  } else if (tel.length == 11) {
    tel = tel.replace(/(.{3})$/, '-$1');
  } else if (tel.length >= 12) {
    tel = tel.replace(/(.{4})$/, '-$1');
  }
  event.target.value = tel;
}

function mMoeda() {
  var v = event.target.value;
  v = v.replace(/\D/g, '');
  v = v.replace(/^0+/g, '');
  v = v.replace(/(\d{1})(\d{13})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{10})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{7})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{4})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{1,1})$/, '$1,$2');
  event.target.value = 'R$ ' + v;
}

function validarCPFValor(cpf) {
  cpf = limparNumero(cpf);
  var ok = 1;
  var add;
  var rev;

  if (cpf.length != 11 ||
      cpf == '00000000000' || cpf == '11111111111' || cpf == '22222222222' ||
      cpf == '33333333333' || cpf == '44444444444' || cpf == '55555555555' ||
      cpf == '66666666666' || cpf == '77777777777' || cpf == '88888888888' ||
      cpf == '99999999999') {
    ok = 0;
  }

  if (ok == 1) {
    add = 0;
    for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) ok = 0;
  }

  if (ok == 1) {
    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) ok = 0;
  }

  return ok == 1;
}

function validarCNPJValor(cnpj) {
  cnpj = limparNumero(cnpj);
  if (cnpj.length != 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  var tamanho = cnpj.length - 2;
  var numeros = cnpj.substring(0, tamanho);
  var digitos = cnpj.substring(tamanho);
  var soma = 0;
  var pos = tamanho - 7;

  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado == digitos.charAt(1);
}

function campoValido(campo) {
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
}

function campoInvalido(campo) {
  campo.classList.remove('is-valid');
  campo.classList.add('is-invalid');
}

function limparValidacao(campo) {
  campo.classList.remove('is-valid');
  campo.classList.remove('is-invalid');
}

function textoSemNumero(valor) {
  return /^[A-Za-zÀ-ÿ\s]+$/.test(valor.trim());
}

function valorMoedaNumero(valor) {
  var limpo = limparNumero(valor);
  if (limpo == '') return 0;
  return parseFloat(limpo) / 100;
}

function consultarCep(cep) {
  var numeroCep = limparNumero(cep);
  return fetch('https://viacep.com.br/ws/' + numeroCep + '/json/')
    .then(function (res) {
      if (!res.ok) throw new Error('Falha na consulta do CEP.');
      return res.json();
    })
    .then(function (data) {
      if (data.erro) throw new Error('CEP não encontrado.');
      return data;
    });
}

function preencherEnderecoCep(cepInputId, logradouroId, bairroId, cidadeId, estadoId, erroId) {
  var cepInput = document.getElementById(cepInputId);
  if (!cepInput) return;

  var cep = limparNumero(cepInput.value);
  var erro = erroId ? document.getElementById(erroId) : null;
  if (erro) erro.textContent = '';
  if (cep.length !== 8) return;

  consultarCep(cepInput.value)
    .then(function (data) {
      var logradouro = document.getElementById(logradouroId);
      var bairro = document.getElementById(bairroId);
      var cidade = document.getElementById(cidadeId);
      var estado = document.getElementById(estadoId);

      if (logradouro) {
        logradouro.value = data.logradouro || '';
        if (logradouro.value) campoValido(logradouro);
      }
      if (bairro) {
        bairro.value = data.bairro || '';
        if (bairro.value) campoValido(bairro);
      }
      if (cidade) {
        cidade.value = data.localidade || '';
        if (cidade.value) campoValido(cidade);
      }
      if (estado) {
        estado.value = data.uf || '';
        if (estado.value) campoValido(estado);
      }
      campoValido(cepInput);
    })
    .catch(function (error) {
      if (erro) erro.textContent = error.message;
      campoInvalido(cepInput);
    });
}
