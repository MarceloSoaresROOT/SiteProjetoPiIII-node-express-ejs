// JavaScript do Projeto Integrado
// Carrinho no localStorage + backend (/produto/obter, /pedido/gravar)
// Mantém: filtro, pesquisa, máscaras, CEP e conta do cliente.

function scrollToProducts() {
  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------- Filtro e pesquisa ----------------
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

  scrollToProducts();
}

function pesquisarProdutos() {
  var texto = document.getElementById('search-input').value.toLowerCase();
  var produtos = document.querySelectorAll('#produtos-grid .produto');

  for (var i = 0; i < produtos.length; i++) {
    var nome = produtos[i].getAttribute('data-name');
    if (nome == null) nome = produtos[i].querySelector('h3').innerHTML;
    produtos[i].style.display = (nome.toLowerCase().indexOf(texto) >= 0) ? 'block' : 'none';
  }
}

// ---------------- Máscaras ----------------
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
    alert('Digite um CEP válido para buscar.');
    return;
  }

  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(function (resp) {
      if (!resp.ok) throw new Error('Não foi possível consultar o CEP.');
      return resp.json();
    })
    .then(function (data) {
      if (data.erro) { alert('CEP não encontrado.'); return; }
      document.getElementById('compraRua').value = data.logradouro || '';
      document.getElementById('compraBairro').value = data.bairro || '';
      document.getElementById('compraCidade').value = data.localidade || '';
      document.getElementById('compraUf').value = data.uf || '';
    })
    .catch(function () { alert('Erro ao buscar CEP. Tente novamente.'); });
}

// ---------------- Conta do cliente ----------------
function mostrarMensagemConta(texto, erro) {
  var mensagem = document.getElementById('mensagemConta');
  if (mensagem == null) return;
  mensagem.innerHTML = texto;
  mensagem.classList.remove('d-none', 'alert-success', 'alert-danger');
  mensagem.classList.add(erro ? 'alert-danger' : 'alert-success');
  setTimeout(function () { mensagem.classList.add('d-none'); }, erro ? 5000 : 2500);
}

function clienteLogado() {
  try { return JSON.parse(localStorage.getItem('greengoCliente')); } catch (e) { return null; }
}

function atualizarBotaoConta() {
  var botao = document.getElementById('btn-conta');
  var cliente = clienteLogado();
  if (botao != null) botao.innerHTML = cliente ? 'Olá, ' + cliente.nome.split(' ')[0] + ' (sair)' : 'Minha Conta';
}

function validarLogin(evento) {
  evento.preventDefault();
  var email = document.getElementById('loginEmail');
  var senha = document.getElementById('loginSenha');
  var valido = true;

  if (email.value.indexOf('@') == -1 || email.value.indexOf('.') == -1) { email.classList.add('is-invalid'); valido = false; } else { email.classList.remove('is-invalid'); email.classList.add('is-valid'); }
  if (senha.value.trim() == '') { senha.classList.add('is-invalid'); valido = false; } else { senha.classList.remove('is-invalid'); senha.classList.add('is-valid'); }

  if (!valido) return;

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, senha: senha.value })
  })
    .then(function (resp) { return resp.json().then(function (dados) { return { ok: resp.ok, dados: dados }; }); })
    .then(function (r) {
      if (r.ok) {
        localStorage.setItem('greengoCliente', JSON.stringify(r.dados));
        atualizarBotaoConta();
        mostrarMensagemConta('Bem-vindo(a), ' + r.dados.nome + '!');
        setTimeout(function () { bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConta')).hide(); }, 1200);
      } else {
        mostrarMensagemConta(r.dados.erro || 'Não foi possível entrar.', true);
      }
    })
    .catch(function () { mostrarMensagemConta('Erro de conexão com o servidor.', true); });
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

  marcar(nome, /^[A-Za-zÀ-ÿ\s]{3,}$/.test(nome.value.trim()) && nome.value.trim().indexOf(' ') > 0);
  marcar(cpf, typeof validarCPFValor == 'function' ? validarCPFValor(cpf.value) : cpf.value.replace(/\D/g, '').length == 11);
  marcar(telefone, telefone.value.replace(/\D/g, '').length >= 10);
  marcar(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
  marcar(senha, senha.value.length >= 6);
  marcar(confirmaSenha, confirmaSenha.value == senha.value && confirmaSenha.value != '');

  if (!valido) return;

  fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: nome.value, cpf: cpf.value, telefone: telefone.value, email: email.value, senha: senha.value })
  })
    .then(function (resp) { return resp.json().then(function (dados) { return { ok: resp.ok, dados: dados }; }); })
    .then(function (r) {
      if (r.ok) {
        mostrarMensagemConta('Conta criada com sucesso! Agora faça login na aba "Entrar".');
        document.getElementById('loginEmail').value = email.value;
        setTimeout(function () { bootstrap.Tab.getOrCreateInstance(document.getElementById('aba-entrar')).show(); }, 1800);
      } else {
        mostrarMensagemConta(r.dados.erro || 'Não foi possível criar a conta.', true);
      }
    })
    .catch(function () { mostrarMensagemConta('Erro de conexão com o servidor.', true); });
}

// ---------------- Carrinho (localStorage + backend) ----------------
document.addEventListener('DOMContentLoaded', function () {

  let listaCarrinho = [];

  let carrinho = localStorage.getItem('carrinho');
  if (carrinho) {
    listaCarrinho = JSON.parse(carrinho);
  }

  atualizarContador();
  calcularValorTotal();

  // lê todos os botões "adicionar ao carrinho" e liga o evento de click
  let btns = document.querySelectorAll('.addCarrinho');
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', adicionarAoCarrinho);
  }

let modalCarrinhoEl = document.getElementById('modalCarrinho');
if (modalCarrinhoEl) modalCarrinhoEl.addEventListener('show.bs.modal', abrirCarrinho);


  let btnConfirmar = document.querySelector('#btnConfirmar');
  if (btnConfirmar) btnConfirmar.addEventListener('click', confirmarPedido);

  function confirmarPedido() {
    // envia o conteúdo do carrinho para o backend
    fetch('/pedido/gravar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listaCarrinho)
    })
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function (corpo) {
        if (corpo.ok) {
          alert('Pedido realizado com sucesso!');
          listaCarrinho = [];
          localStorage.removeItem('carrinho');
          atualizarContador();
          abrirCarrinho();
          calcularValorTotal();
        } else {
          alert(corpo.msg);
        }
      });
  }

  function excluirProdutoCarrinho() {
    let produtoIdExcluir = this.dataset.produto;
    listaCarrinho = listaCarrinho.filter(x => x.id != produtoIdExcluir);

    localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
    atualizarContador();
    calcularValorTotal();
    abrirCarrinho();
  }

  function calcularValorTotal() {
    let valorTotal = 0;
    for (let i = 0; i < listaCarrinho.length; i++) {
      valorTotal += listaCarrinho[i].quantidade * listaCarrinho[i].preco;
    }
    let campo = document.querySelector('#valorTotalPedido');
    if (campo) campo.innerHTML = 'Valor total do pedido: R$ ' + valorTotal.toFixed(2);
  }

  function atualizarContador() {
    let contador = document.querySelector('#contadorCarrinho');
    if (contador) contador.innerHTML = listaCarrinho.length;
  }

 function abrirCarrinho() {
  let corpoModal = document.getElementById('modalCarrinhoCorpo');
  if (!corpoModal) { console.log('modalCarrinhoCorpo não encontrado'); return; }

  console.log('carrinho ao abrir:', listaCarrinho);

  if (listaCarrinho.length == 0) {
    corpoModal.innerHTML = 'Carrinho vazio!';
    return;
  }

  let linhas = '';
  for (let i = 0; i < listaCarrinho.length; i++) {
    let item = listaCarrinho[i];
    linhas += `<tr>
                 <td><img width="50" src="${item.imagem}" /></td>
                 <td>${item.nome}</td>
                 <td>${Number(item.preco).toFixed(2)}</td>
                 <td>${item.quantidade}</td>
                 <td>${(item.quantidade * item.preco).toFixed(2)}</td>
                 <td><button data-produto="${item.id}" class="btn btn-danger excluirCarrinho"><i class="fas fa-trash"></i></button></td>
               </tr>`;
  }

  corpoModal.innerHTML = `<table class="table">
                            <thead>
                              <tr>
                                <th>Imagem</th><th>Nome</th><th>Valor Unitário</th>
                                <th>Quantidade</th><th>Valor Total</th><th>Ações</th>
                              </tr>
                            </thead>
                            <tbody>${linhas}</tbody>
                          </table>`;

  let btnsExcluir = document.querySelectorAll('.excluirCarrinho');
  for (let i = 0; i < btnsExcluir.length; i++) {
    btnsExcluir[i].addEventListener('click', excluirProdutoCarrinho);
  }
}

  function adicionarAoCarrinho() {
    let produtoId = this.dataset.produto;
    console.log(produtoId)
    let that = this;
    if (produtoId) {
        console.log('clicou, id =', produtoId, '| itens no carrinho =', listaCarrinho.length);

      let achou = false;
      for (let i = 0; i < listaCarrinho.length; i++) {
        if (produtoId == listaCarrinho[i].id) {
         
          listaCarrinho[i].quantidade += 1;
          achou = true;
        }
      }

      // busca os dados completos do produto no backend
      let p = null;
      if (achou == false) {
        p = fetch('/produtos/obter/' + produtoId)
          .then(function (response) {
            return response.json();
          })
          .then(function (corpo) {
            corpo.produto.quantidade = 1;
            listaCarrinho.push(corpo.produto);
          });
      }

      Promise.all([p])
        .then(function () {
          localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
          that.innerHTML = "<i class='fas fa-check'></i> Adicionado!";
          setTimeout(function () {
            that.innerHTML = "<i class='bi-cart-fill me-1'></i> Adicionar ao carrinho";
          }, 3000);

          atualizarContador();
          calcularValorTotal();
        });
    } else {
      alert('ID do produto não encontrado!');
    }
  }

  // ---------------- Eventos gerais ----------------
  let botaoPesquisa = document.getElementById('search-btn');
  let campoPesquisa = document.getElementById('search-input');
  let botaoConta = document.getElementById('btn-conta');

  if (botaoPesquisa != null) botaoPesquisa.addEventListener('click', pesquisarProdutos);
  if (campoPesquisa != null) campoPesquisa.addEventListener('keyup', pesquisarProdutos);

  if (botaoConta != null) {
    botaoConta.addEventListener('click', function (e) {
      e.preventDefault();
      if (clienteLogado()) {
        if (confirm('Deseja sair da conta de ' + clienteLogado().nome + '?')) {
          localStorage.removeItem('greengoCliente');
          atualizarBotaoConta();
        }
        return;
      }
      bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConta')).show();
    });
  }

  if (document.getElementById('cadCpf')) document.getElementById('cadCpf').addEventListener('keyup', function () { mascaraCPF(this); });
  if (document.getElementById('cadTelefone')) document.getElementById('cadTelefone').addEventListener('keyup', function () { mascaraTelefone(this); });
  if (document.getElementById('compraTelefone')) document.getElementById('compraTelefone').addEventListener('keyup', function () { mascaraTelefone(this); });
  if (document.getElementById('compraCep')) {
    document.getElementById('compraCep').addEventListener('keyup', function () { mascaraCEP(this); });
    document.getElementById('compraCep').addEventListener('blur', buscarCep);
  }
  if (document.getElementById('btnBuscaCep')) document.getElementById('btnBuscaCep').addEventListener('click', buscarCep);

  if (document.getElementById('formLogin')) document.getElementById('formLogin').addEventListener('submit', validarLogin);
  if (document.getElementById('formCriarConta')) document.getElementById('formCriarConta').addEventListener('submit', validarCriarConta);

  atualizarBotaoConta();
});
