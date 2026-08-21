// JavaScript simples do Projeto Integrado
// Usa DOM, eventos, máscaras, Bootstrap, vetor e WhatsApp.

var carrinho = [];

function scrollToProducts() {
  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function dinheiro(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

function adicionarAoCarrinho(nome, preco, quantidade) {
  preco = parseFloat(preco);
  quantidade = parseInt(quantidade, 10) || 1;
  var itemExistente = null;

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome == nome) {
      itemExistente = carrinho[i];
    }
  }

  if (itemExistente != null) {
    itemExistente.quantidade = itemExistente.quantidade + quantidade;
  } else {
    carrinho.push({ nome: nome, preco: preco, quantidade: quantidade });
  }

  atualizarCarrinho();
  mostrarMensagemCarrinho((quantidade > 1 ? quantidade + 'x ' : '') + nome + ' adicionado ao carrinho.');
}

function abrirProdutoDetalhe(event, produtoElement) {
  if (event) event.preventDefault();

  var nome = produtoElement.getAttribute('data-name') || produtoElement.querySelector('h3').innerText;
  var preco = produtoElement.getAttribute('data-preco') || produtoElement.querySelector('p').innerText.replace(/[R$\s\/kgun\.]/g, '').replace(',', '.');
  var descricao = produtoElement.getAttribute('data-descricao') || 'Produto fresco e saboroso.';
  var imagem = produtoElement.querySelector('img').getAttribute('src');

  document.getElementById('produtoDetalheNome').innerText = nome;
  document.getElementById('produtoDetalheDescricao').innerText = descricao;
  document.getElementById('produtoDetalhePreco').innerText = dinheiro(preco);
  var detalheImagem = document.getElementById('produtoDetalheImagem');
  detalheImagem.src = imagem;
  detalheImagem.alt = nome;

  var quantidadeInput = document.getElementById('produtoDetalheQuantidade');
  quantidadeInput.value = 1;

  var botaoAdicionar = document.getElementById('produtoDetalheAdicionar');
  botaoAdicionar.onclick = function () {
    adicionarAoCarrinho(nome, preco, parseInt(quantidadeInput.value, 10) || 1);
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProduto'));
    modal.hide();
  };

  var modal = new bootstrap.Modal(document.getElementById('modalProduto'));
  modal.show();
}

function atualizarCarrinho() {
  var contador = document.getElementById('cart-counter');
  var lista = document.getElementById('itens-carrinho');
  var totalCampo = document.getElementById('total-carrinho');
  var qtd = 0;
  var total = 0;

  for (var i = 0; i < carrinho.length; i++) {
    qtd = qtd + carrinho[i].quantidade;
    total = total + (carrinho[i].preco * carrinho[i].quantidade);
  }

  if (contador != null) contador.innerHTML = qtd;
  if (totalCampo != null) totalCampo.innerHTML = dinheiro(total);

  if (lista == null) return;

  if (carrinho.length == 0) {
    lista.innerHTML = '<p class="text-muted">Carrinho vazio.</p>';
    return;
  }

  var html = '';
  for (var j = 0; j < carrinho.length; j++) {
    var item = carrinho[j];
    html += '<div class="d-flex justify-content-between align-items-center border-bottom py-2">';
    html += '<div><strong>' + item.nome + '</strong><br><small>R$ ' + dinheiro(item.preco) + ' cada</small></div>';
    html += '<div class="d-flex align-items-center gap-2">';
    html += '<button type="button" class="btn btn-sm btn-outline-secondary" onclick="alterarQuantidade(' + j + ', -1)">-</button>';
    html += '<span>' + item.quantidade + '</span>';
    html += '<button type="button" class="btn btn-sm btn-outline-secondary" onclick="alterarQuantidade(' + j + ', 1)">+</button>';
    html += '<button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItem(' + j + ')">Excluir</button>';
    html += '</div></div>';
  }
  lista.innerHTML = html;
}

function alterarQuantidade(indice, valor) {
  carrinho[indice].quantidade = carrinho[indice].quantidade + valor;
  if (carrinho[indice].quantidade <= 0) carrinho.splice(indice, 1);
  atualizarCarrinho();
}

function removerItem(indice) {
  carrinho.splice(indice, 1);
  atualizarCarrinho();
}

function mostrarMensagemCarrinho(texto) {
  var msg = document.getElementById('msg-carrinho');

  if (msg == null) {
    msg = document.createElement('div');
    msg.id = 'msg-carrinho';
    msg.className = 'gg-toast';
    document.body.appendChild(msg);
  }

  msg.innerHTML = texto;
  msg.classList.add('show');

  setTimeout(function () {
    msg.classList.remove('show');
  }, 3000);
}

function abrirCarrinho() {
  atualizarCarrinho();
  var modal = new bootstrap.Modal(document.getElementById('modalCarrinho'));
  modal.show();
}

function filtrarPorCategoria(categoria) {
  var produtos = document.querySelectorAll('#produtos-grid .produto');
  var botoes = document.querySelectorAll('.filtro-btn');

  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove('active');
    if (botoes[i].getAttribute('data-categoria') == categoria) botoes[i].classList.add('active');
  }

  for (var j = 0; j < produtos.length; j++) {
    var catProduto = produtos[j].getAttribute('data-categoria');
    produtos[j].style.display = (categoria == 'todos' || catProduto == categoria) ? 'block' : 'none';
  }

  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pesquisarProdutos() {
  var campo = document.getElementById('search-input');
  var texto = campo.value.toLowerCase();
  var produtos = document.querySelectorAll('#produtos-grid .produto');

  for (var i = 0; i < produtos.length; i++) {
    var nome = produtos[i].getAttribute('data-name');
    if (nome == null) nome = produtos[i].querySelector('h3').innerHTML.toLowerCase();
    produtos[i].style.display = (nome.indexOf(texto) >= 0) ? 'block' : 'none';
  }
}

// Máscaras simples vistas em aula
function mascaraCPF(campo) {
  var valor = campo.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  campo.value = valor;
}

function mascaraTelefone(campo) {
  var valor = campo.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  campo.value = valor;
}

function mascaraCEP(campo) {
  var valor = campo.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  campo.value = valor;
}

function buscarCep() {
  var campoCep = document.getElementById('compraCep');
  if (!campoCep) return;

  var cep = campoCep.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    mostrarMensagemCarrinho('Digite um CEP válido para buscar.');
    return;
  }

  var url = 'https://viacep.com.br/ws/' + cep + '/json/';
  fetch(url)
    .then(function (resp) {
      if (!resp.ok) throw new Error('Não foi possível consultar o CEP.');
      return resp.json();
    })
    .then(function (data) {
      if (data.erro) {
        mostrarMensagemCarrinho('CEP não encontrado.');
        return;
      }
      document.getElementById('compraRua').value = data.logradouro || '';
      document.getElementById('compraBairro').value = data.bairro || '';
      document.getElementById('compraCidade').value = data.localidade || '';
      document.getElementById('compraUf').value = data.uf || '';
      if (data.logradouro) {
        mostrarMensagemCarrinho('Endereço preenchido com sucesso.');
      }
    })
    .catch(function () {
      mostrarMensagemCarrinho('Erro ao buscar CEP. Tente novamente.');
    });
}

function mascaraCartao(campo) {
  var valor = campo.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{4})(\d)/, '$1 $2');
  valor = valor.replace(/(\d{4})(\d)/, '$1 $2');
  valor = valor.replace(/(\d{4})(\d)/, '$1 $2');
  campo.value = valor;
}

function mascaraValidade(campo) {
  var valor = campo.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
  campo.value = valor;
}

function mostrarMensagemConta(texto) {
  var mensagem = document.getElementById('mensagemConta');
  if (mensagem == null) return;
  mensagem.innerHTML = texto;
  mensagem.classList.remove('d-none');
  setTimeout(function () { mensagem.classList.add('d-none'); }, 2500);
}

function validarLogin(evento) {
  evento.preventDefault();
  var email = document.getElementById('loginEmail');
  var senha = document.getElementById('loginSenha');
  var valido = true;

  if (email.value.indexOf('@') == -1 || email.value.indexOf('.') == -1) { email.classList.add('is-invalid'); valido = false; } else { email.classList.remove('is-invalid'); email.classList.add('is-valid'); }
  if (senha.value.trim() == '') { senha.classList.add('is-invalid'); valido = false; } else { senha.classList.remove('is-invalid'); senha.classList.add('is-valid'); }

  if (valido) mostrarMensagemConta('Login de cliente validado.');
}

function validarCriarConta(evento) {
  evento.preventDefault();
  var nome = document.getElementById('cadNome');
  var cpf = document.getElementById('cadCpf');
  var telefone = document.getElementById('cadTelefone');
  var email = document.getElementById('cadEmail');
  var senha = document.getElementById('cadSenha');
  var confirmaSenha = document.getElementById('cadConfirmaSenha');
  var valido = true;

  function marcar(campo, ok) {
    campo.classList.remove('is-valid', 'is-invalid');
    campo.classList.add(ok ? 'is-valid' : 'is-invalid');
    if (!ok) valido = false;
  }

  var nomeOk = /^[A-Za-zÀ-ÿ\s]{3,}$/.test(nome.value.trim()) && nome.value.trim().indexOf(' ') > 0;
  marcar(nome, nomeOk);

  var cpfOk = false;
  if (typeof validarCPFValor == 'function') {
    cpfOk = validarCPFValor(cpf.value);
  } else {
    cpfOk = cpf.value.replace(/\D/g, '').length == 11;
  }
  marcar(cpf, cpfOk);

  marcar(telefone, telefone.value.replace(/\D/g, '').length >= 10);
  marcar(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
  marcar(senha, senha.value.length >= 6);
  marcar(confirmaSenha, confirmaSenha.value == senha.value && confirmaSenha.value != '');

  if (valido) mostrarMensagemConta('Conta criada com sucesso.');
}

function mudarPagamento() {
  var pagamento = document.querySelector('input[name="pagamento"]:checked').value;
  document.getElementById('areaCartao').style.display = pagamento == 'Cartão' ? 'block' : 'none';
  document.getElementById('areaPix').style.display = pagamento == 'Pix' ? 'block' : 'none';
  document.getElementById('areaDinheiro').style.display = pagamento == 'Dinheiro' ? 'block' : 'none';
}

function finalizarWhatsApp(evento) {
  evento.preventDefault();

  if (carrinho.length == 0) {
    mostrarMensagemCarrinho('Adicione pelo menos um produto.');
    return;
  }

  var campos = ['compraNome','compraTelefone','compraCep','compraRua','compraNumero','compraBairro','compraCidade','compraUf'];
  var valido = true;
  for (var i = 0; i < campos.length; i++) {
    var campo = document.getElementById(campos[i]);
    if (campo.value.trim() == '') { campo.classList.add('is-invalid'); valido = false; } else { campo.classList.remove('is-invalid'); campo.classList.add('is-valid'); }
  }

  var pagamento = document.querySelector('input[name="pagamento"]:checked').value;
  if (pagamento == 'Cartão') {
    var numeroCartao = document.getElementById('numeroCartao');
    var validadeCartao = document.getElementById('validadeCartao');
    var cvvCartao = document.getElementById('cvvCartao');
    if (numeroCartao.value.length < 19) { numeroCartao.classList.add('is-invalid'); valido = false; } else { numeroCartao.classList.remove('is-invalid'); }
    if (validadeCartao.value.length < 5) { validadeCartao.classList.add('is-invalid'); valido = false; } else { validadeCartao.classList.remove('is-invalid'); }
    if (cvvCartao.value.length < 3) { cvvCartao.classList.add('is-invalid'); valido = false; } else { cvvCartao.classList.remove('is-invalid'); }
  }

  if (!valido) return;

  var total = 0;
  var mensagem = 'Olá, quero fazer um pedido na GreenGo:%0A%0A';
  for (var j = 0; j < carrinho.length; j++) {
    var item = carrinho[j];
    var subtotal = item.preco * item.quantidade;
    total = total + subtotal;
    mensagem += '- ' + item.quantidade + 'x ' + item.nome + ' = R$ ' + dinheiro(subtotal) + '%0A';
  }

  mensagem += '%0ATotal: R$ ' + dinheiro(total);
  mensagem += '%0APagamento: ' + pagamento;
  mensagem += '%0A%0ADados da entrega:';
  mensagem += '%0ANome: ' + document.getElementById('compraNome').value;
  mensagem += '%0ATelefone: ' + document.getElementById('compraTelefone').value;
  mensagem += '%0AEndereço: ' + document.getElementById('compraRua').value + ', ' + document.getElementById('compraNumero').value;
  mensagem += '%0ABairro: ' + document.getElementById('compraBairro').value;
  mensagem += '%0ACidade/UF: ' + document.getElementById('compraCidade').value + '/' + document.getElementById('compraUf').value;
  mensagem += '%0ACEP: ' + document.getElementById('compraCep').value;
  mensagem += '%0AObservação: ' + document.getElementById('compraObs').value;

  window.open('https://wa.me/5518999999999?text=' + mensagem, '_blank');
}

function mostrarAdminPorParametro() {
  var parametros = new URLSearchParams(window.location.search);
  var acesso = parametros.get('acesso');
  var linkAdmin = document.getElementById('link-admin');
  if (acesso == 'admin' && linkAdmin != null) linkAdmin.style.display = 'inline-block';
}

document.addEventListener('DOMContentLoaded', function () {
  var botaoPesquisa = document.getElementById('search-btn');
  var campoPesquisa = document.getElementById('search-input');
  var botaoConta = document.getElementById('btn-conta');
  var iconeCarrinho = document.querySelector('.cart-icon');

  if (botaoPesquisa != null) botaoPesquisa.addEventListener('click', pesquisarProdutos);
  if (campoPesquisa != null) campoPesquisa.addEventListener('keyup', pesquisarProdutos);

  if (botaoConta != null) {
    botaoConta.addEventListener('click', function (e) {
      e.preventDefault();
      var modal = new bootstrap.Modal(document.getElementById('modalConta'));
      modal.show();
    });
  }

  if (iconeCarrinho != null) iconeCarrinho.addEventListener('click', abrirCarrinho);

  if (document.getElementById('cadCpf')) document.getElementById('cadCpf').addEventListener('keyup', function () { mascaraCPF(this); });
  if (document.getElementById('cadTelefone')) document.getElementById('cadTelefone').addEventListener('keyup', function () { mascaraTelefone(this); });
  if (document.getElementById('compraTelefone')) document.getElementById('compraTelefone').addEventListener('keyup', function () { mascaraTelefone(this); });
  if (document.getElementById('compraCep')) {
    document.getElementById('compraCep').addEventListener('keyup', function () { mascaraCEP(this); });
    document.getElementById('compraCep').addEventListener('blur', buscarCep);
  }
  if (document.getElementById('btnBuscaCep')) document.getElementById('btnBuscaCep').addEventListener('click', buscarCep);
  if (document.getElementById('numeroCartao')) document.getElementById('numeroCartao').addEventListener('keyup', function () { mascaraCartao(this); });
  if (document.getElementById('validadeCartao')) document.getElementById('validadeCartao').addEventListener('keyup', function () { mascaraValidade(this); });

  var radios = document.querySelectorAll('input[name="pagamento"]');
  for (var i = 0; i < radios.length; i++) radios[i].addEventListener('change', mudarPagamento);

  if (document.getElementById('formLogin')) document.getElementById('formLogin').addEventListener('submit', validarLogin);
  if (document.getElementById('formCriarConta')) document.getElementById('formCriarConta').addEventListener('submit', validarCriarConta);
  if (document.getElementById('formCompra')) document.getElementById('formCompra').addEventListener('submit', finalizarWhatsApp);

  mostrarAdminPorParametro();
  atualizarCarrinho();
});
