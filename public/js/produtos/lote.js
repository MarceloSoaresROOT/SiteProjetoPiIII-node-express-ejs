document.addEventListener("DOMContentLoaded", function () {

    let btnLote = document.querySelector('#btnSalvarLote');
    let campoProduto = document.querySelector('#novoProduto');
    let filtroCategoria = document.querySelector('#filtroCategoria');
    let filtroMarca = document.querySelector('#filtroMarca');
    let campoValidade = document.querySelector('#novaValidade');
    let avisoValidade = document.querySelector('#avisoValidade');
    let erroModal = document.querySelector('#erroAdicionarLote');
    let mensagemPagina = document.querySelector('#mensagemGestao');

    // mensagem de sucesso que ficou guardada antes de a página recarregar (some em 4 segundos)
    mostrarMensagemGuardada(mensagemPagina);

    btnLote.addEventListener("click", gravar);
    filtroCategoria.addEventListener("change", filtrarProdutos);
    filtroMarca.addEventListener("change", filtrarProdutos);

    // aviso da validade assim que a data é escolhida
    campoValidade.addEventListener("change", function () {
        mostrarAvisoValidade(avisoValidade, analisarValidade(campoValidade.value));
    });

    // Mostra só os produtos da categoria e da marca escolhidas nos filtros
    function filtrarProdutos() {
        let categoria = filtroCategoria.value;
        let marca = filtroMarca.value;

        for (let i = 1; i < campoProduto.options.length; i++) { // o 0 é o "--Selecione--"
            let opcao = campoProduto.options[i];
            let combina = (categoria == "" || opcao.dataset.categoria == categoria) &&
                          (marca == "" || opcao.dataset.marca == marca);
            opcao.hidden = !combina;
            opcao.disabled = !combina;
        }

        // se o produto escolhido sumiu da lista, volta para "--Selecione--"
        let escolhido = campoProduto.options[campoProduto.selectedIndex];
        if (escolhido && escolhido.disabled) {
            campoProduto.value = "0";
        }
    }

    function gravar() {
        let produto = campoProduto.value;
        let lote = document.querySelector('#novoNumeroLote').value.trim();
        let data = campoValidade.value;
        let qnt = document.querySelector('#novaQuantidade').value;

        if (produto == "0") {
            exibirMensagem(erroModal, "Selecione o produto.", "danger");
            return;
        }
        if (lote == "" || data == "" || !(Number.isInteger(Number(qnt)) && Number(qnt) > 0)) {
            exibirMensagem(erroModal, "Preencha corretamente os campos obrigatórios.", "danger");
            return;
        }

        // regra da validade: bloqueia mais de 7 dias antes de hoje; avisa se for retroativa
        let analise = analisarValidade(data);
        mostrarAvisoValidade(avisoValidade, analise);
        if (analise.situacao == "bloqueada") {
            exibirMensagem(erroModal, analise.msg, "danger");
            return;
        }

        let obj = {
            produto: produto,
            lote: lote,
            data: data,
            qnt: qnt
        };

        btnLote.disabled = true;

        fetch("/lotes/cadastrar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                guardarMensagem(r.msg, "success");
                window.location.reload();
            }
            else {
                exibirMensagem(erroModal, r.msg, "danger");
                btnLote.disabled = false;
            }
        })
        .catch(() => {
            exibirMensagem(erroModal, "Erro de conexão com o servidor.", "danger");
            btnLote.disabled = false;
        });
    }
})