// Gestão de Produtos - vetor, DOM, checkbox, exclusão e adição com modal Bootstrap

var produtos = [
  { id: 1, nome: 'Banana Prata', categoria: 'Frutas', preco: 'R$ 4,99', estoque: 30, fornecedor: 'Sítio Boa Terra' },
  { id: 2, nome: 'Maçã Gala', categoria: 'Frutas', preco: 'R$ 5,99', estoque: 25, fornecedor: 'Fazenda Verde' },
  { id: 3, nome: 'Morango', categoria: 'Frutas', preco: 'R$ 10,22', estoque: 18, fornecedor: 'Horta Moranguinho' },
  { id: 4, nome: 'Tomate', categoria: 'Legumes', preco: 'R$ 6,99', estoque: 40, fornecedor: 'Agro Prudente' },
  { id: 5, nome: 'Cenoura', categoria: 'Legumes', preco: 'R$ 4,50', estoque: 35, fornecedor: 'Sítio Raiz' },
  { id: 6, nome: 'Alface Crespa', categoria: 'Verduras', preco: 'R$ 3,99', estoque: 20, fornecedor: 'Hidroponia Sol' },
  { id: 7, nome: 'Rúcula', categoria: 'Verduras', preco: 'R$ 3,50', estoque: 15, fornecedor: 'Horta Verde' },
  { id: 8, nome: 'Uva Verde', categoria: 'Frutas', preco: 'R$ 8,90', estoque: 22, fornecedor: 'Fazenda Verde' }
];

var idsParaExcluir = [];
var tipoExclusao = '';

function montarTabela() {
  var corpo = document.getElementById('corpoTabelaProdutos');
  var busca = document.getElementById('buscaProduto').value.toLowerCase();

  corpo.innerHTML = '';

  for (var i = 0; i < produtos.length; i++) {
    var produto = produtos[i];
    var textoProduto = (produto.nome + ' ' + produto.categoria + ' ' + produto.fornecedor).toLowerCase();

    if (textoProduto.indexOf(busca) >= 0) {
      var linha = document.createElement('tr');

      linha.innerHTML =
        '<td><input type="checkbox" class="form-check-input checkProduto" value="' + produto.id + '"></td>' +
        '<td class="fw-semibold">' + produto.nome + '</td>' +
        '<td><span class="badge rounded-pill badge-categoria">' + produto.categoria + '</span></td>' +
        '<td>' + produto.preco + '</td>' +
        '<td>' + produto.estoque + ' unidades</td>' +
        '<td>' + produto.fornecedor + '</td>' +
        '<td class="text-center">' +
          '<button type="button" class="btn-remover-produto" onclick="prepararExclusaoUnica(' + produto.id + ')" title="Remover produto">' +
            '<i class="bi bi-trash3"></i>' +
          '</button>' +
        '</td>';

      corpo.appendChild(linha);
    }
  }

  if (corpo.innerHTML == '') {
    corpo.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Nenhum produto encontrado.</td></tr>';
  }

  ligarCheckboxes();
  atualizarSelecionados();
  atualizarResumo();
}

function ligarCheckboxes() {
  var checks = document.querySelectorAll('.checkProduto');

  for (var i = 0; i < checks.length; i++) {
    checks[i].addEventListener('change', atualizarSelecionados);
  }
}

function atualizarSelecionados() {
  var checks = document.querySelectorAll('.checkProduto');
  var quantidade = 0;

  for (var i = 0; i < checks.length; i++) {
    if (checks[i].checked) {
      quantidade++;
    }
  }

  document.getElementById('qtdSelecionados').innerHTML = quantidade;
  document.getElementById('btnExcluirSelecionados').disabled = quantidade == 0;
}

function atualizarResumo() {
  var frutas = 0;
  var legumes = 0;
  var verduras = 0;

  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].categoria == 'Frutas') frutas++;
    if (produtos[i].categoria == 'Legumes') legumes++;
    if (produtos[i].categoria == 'Verduras') verduras++;
  }

  document.getElementById('totalFrutas').innerHTML = frutas;
  document.getElementById('totalLegumes').innerHTML = legumes;
  document.getElementById('totalVerduras').innerHTML = verduras;
}

function prepararExclusaoSelecionados() {
  var checks = document.querySelectorAll('.checkProduto:checked');

  idsParaExcluir = [];

  for (var i = 0; i < checks.length; i++) {
    idsParaExcluir.push(parseInt(checks[i].value));
  }

  if (idsParaExcluir.length == 0) {
    return;
  }

  tipoExclusao = 'selecionados';

  document.getElementById('textoModalExcluir').innerHTML =
    'Você selecionou ' + idsParaExcluir.length + ' produto(s). Deseja remover da gestão?';

  abrirModalExclusao();
}

function prepararExclusaoUnica(id) {
  idsParaExcluir = [id];
  tipoExclusao = 'unico';

  document.getElementById('textoModalExcluir').innerHTML =
    'Deseja remover este produto da gestão?';

  abrirModalExclusao();
}

function abrirModalExclusao() {
  var modalElemento = document.getElementById('modalExcluir');
  var modal = bootstrap.Modal.getOrCreateInstance(modalElemento);
  modal.show();
}

function fecharModalExclusao() {
  var modalElemento = document.getElementById('modalExcluir');
  var modal = bootstrap.Modal.getInstance(modalElemento);

  if (modal) {
    modal.hide();
  }
}

function confirmarExclusao() {
  var novoVetor = [];

  for (var i = 0; i < produtos.length; i++) {
    if (idsParaExcluir.indexOf(produtos[i].id) == -1) {
      novoVetor.push(produtos[i]);
    }
  }

  produtos = novoVetor;

  document.getElementById('marcarTodos').checked = false;

  if (tipoExclusao == 'unico') {
    mostrarMensagem('Produto removido com sucesso.');
  } else {
    mostrarMensagem('Produtos selecionados removidos com sucesso.');
  }

  idsParaExcluir = [];
  tipoExclusao = '';

  montarTabela();
  fecharModalExclusao();
}

function pegarMaiorId() {
  var maior = 0;

  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id > maior) {
      maior = produtos[i].id;
    }
  }

  return maior;
}

function limparCamposAdicionar() {
  document.getElementById('novoNome').value = '';
  document.getElementById('novaCategoria').value = '';
  document.getElementById('novoPreco').value = '';
  document.getElementById('novoEstoque').value = '';
  document.getElementById('novoFornecedor').value = '';

  document.getElementById('novoNome').classList.remove('is-invalid');
  document.getElementById('novaCategoria').classList.remove('is-invalid');
  document.getElementById('novoPreco').classList.remove('is-invalid');
  document.getElementById('novoEstoque').classList.remove('is-invalid');
  document.getElementById('novoFornecedor').classList.remove('is-invalid');
  document.getElementById('erroAdicionarProduto').classList.add('d-none');
}

function adicionarProduto() {
  var nome = document.getElementById('novoNome');
  var categoria = document.getElementById('novaCategoria');
  var preco = document.getElementById('novoPreco');
  var estoque = document.getElementById('novoEstoque');
  var fornecedor = document.getElementById('novoFornecedor');
  var erro = document.getElementById('erroAdicionarProduto');

  var ok = true;

  if (nome.value == '') {
    nome.classList.add('is-invalid');
    ok = false;
  } else {
    nome.classList.remove('is-invalid');
  }

  if (categoria.value == '') {
    categoria.classList.add('is-invalid');
    ok = false;
  } else {
    categoria.classList.remove('is-invalid');
  }

  if (preco.value == '' || parseFloat(preco.value) <= 0) {
    preco.classList.add('is-invalid');
    ok = false;
  } else {
    preco.classList.remove('is-invalid');
  }

  if (estoque.value == '' || parseInt(estoque.value) <= 0) {
    estoque.classList.add('is-invalid');
    ok = false;
  } else {
    estoque.classList.remove('is-invalid');
  }

  if (fornecedor.value == '') {
    fornecedor.classList.add('is-invalid');
    ok = false;
  } else {
    fornecedor.classList.remove('is-invalid');
  }

  if (ok == false) {
    erro.classList.remove('d-none');
    return;
  }

  var precoFormatado = parseFloat(preco.value).toFixed(2);
  precoFormatado = precoFormatado.replace('.', ',');

  var novoProduto = {
    id: pegarMaiorId() + 1,
    nome: nome.value,
    categoria: categoria.value,
    preco: 'R$ ' + precoFormatado,
    estoque: parseInt(estoque.value),
    fornecedor: fornecedor.value
  };

  produtos.push(novoProduto);

  document.getElementById('buscaProduto').value = '';
  document.getElementById('marcarTodos').checked = false;

  montarTabela();
  mostrarMensagem('Produto adicionado com sucesso.');

  var modalElemento = document.getElementById('modalAdicionar');
  var modal = bootstrap.Modal.getInstance(modalElemento);

  if (modal) {
    modal.hide();
  }

  limparCamposAdicionar();
}

function mostrarMensagem(texto) {
  var mensagem = document.getElementById('mensagemGestao');

  mensagem.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>' + texto;
  mensagem.classList.remove('d-none');

  setTimeout(function () {
    mensagem.classList.add('d-none');
  }, 2500);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('buscaProduto').addEventListener('keyup', montarTabela);

  document.getElementById('btnExcluirSelecionados')
    .addEventListener('click', prepararExclusaoSelecionados);

  document.getElementById('confirmarExclusao')
    .addEventListener('click', confirmarExclusao);

  document.getElementById('btnSalvarProduto')
    .addEventListener('click', adicionarProduto);

  document.getElementById('marcarTodos').addEventListener('change', function () {
    var checks = document.querySelectorAll('.checkProduto');

    for (var i = 0; i < checks.length; i++) {
      checks[i].checked = this.checked;
    }

    atualizarSelecionados();
  });

  document.getElementById('modalAdicionar').addEventListener('hidden.bs.modal', limparCamposAdicionar);

  montarTabela();
});
