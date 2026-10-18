// Gestão de Produtos - vetor, DOM, checkbox, exclusão e adição com modal Bootstrap

var produtos = []; // preenchido por carregarProdutos() com os dados do MySQL

function escapar(texto) {
  var div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function precoTexto(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function carregarProdutos() {
  return fetch('/api/produtos')
    .then(function (resp) { return resp.json(); })
    .then(function (dados) {
      produtos = dados;
      montarTabela();
    })
    .catch(function () {
      document.getElementById('corpoTabelaProdutos').innerHTML =
        '<tr><td colspan="7" class="text-center text-danger py-4">Erro ao carregar produtos do banco.</td></tr>';
    });
}

function carregarFornecedores() {
  return fetch('/api/fornecedores')
    .then(function (resp) { return resp.json(); })
    .then(function (lista) {
      var select = document.getElementById('novoFornecedor');
      select.innerHTML = '<option value="">Selecione</option>';
      for (var i = 0; i < lista.length; i++) {
        select.innerHTML += '<option value="' + lista[i].id + '">' + escapar(lista[i].nome_fantasia) + '</option>';
      }
    });
}

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
        '<td class="fw-semibold">' + escapar(produto.nome) + '</td>' +
        '<td><span class="badge rounded-pill badge-categoria">' + produto.categoria + '</span></td>' +
        '<td>' + precoTexto(produto.preco) + '</td>' +
        '<td>' + produto.estoque + ' unidades</td>' +
        '<td>' + escapar(produto.fornecedor) + '</td>' +
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
  var qtd = idsParaExcluir.length;
  var unico = tipoExclusao == 'unico';

  fetch('/api/produtos/excluir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: idsParaExcluir })
  })
    .then(function (resp) { return resp.json().then(function (c) { return { ok: resp.ok, corpo: c }; }); })
    .then(function (r) {
      fecharModalExclusao();
      if (!r.ok) { mostrarMensagem(r.corpo.erro || 'Erro ao remover.'); return; }

      document.getElementById('marcarTodos').checked = false;
      mostrarMensagem(unico ? 'Produto removido com sucesso.' : 'Produtos selecionados removidos com sucesso.');
      idsParaExcluir = [];
      tipoExclusao = '';
      return carregarProdutos();
    })
    .catch(function () { fecharModalExclusao(); mostrarMensagem('Erro de conexão com o servidor.'); });
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
  document.getElementById('erroAdicionarProduto').innerHTML = 'Preencha corretamente os campos obrigatórios.';
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

  fetch('/api/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: nome.value,
      categoria: categoria.value,
      preco: parseFloat(preco.value),
      estoque: parseInt(estoque.value),
      fornecedor_id: parseInt(fornecedor.value)
    })
  })
    .then(function (resp) { return resp.json().then(function (c) { return { ok: resp.ok, corpo: c }; }); })
    .then(function (r) {
      if (!r.ok) {
        erro.innerHTML = r.corpo.erro || 'Erro ao salvar o produto.';
        erro.classList.remove('d-none');
        return;
      }

      document.getElementById('buscaProduto').value = '';
      document.getElementById('marcarTodos').checked = false;

      var modal = bootstrap.Modal.getInstance(document.getElementById('modalAdicionar'));
      if (modal) modal.hide();
      limparCamposAdicionar();

      mostrarMensagem('Produto adicionado com sucesso.');
      return carregarProdutos();
    })
    .catch(function () {
      erro.innerHTML = 'Erro de conexão com o servidor.';
      erro.classList.remove('d-none');
    });
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

  carregarFornecedores();
  carregarProdutos();
});
