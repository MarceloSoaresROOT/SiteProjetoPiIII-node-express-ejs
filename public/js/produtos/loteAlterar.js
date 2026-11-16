document.addEventListener("DOMContentLoaded", function () {

    let btnloteAlterar = document.querySelector("#btnSalvarAlteracao");
    let campoValidade = document.querySelector('#novaValidade');
    let avisoValidade = document.querySelector('#avisoValidade');
    let erroModal = document.querySelector('#erroAdicionarLote');
    let avisoBloqueado = document.querySelector('#loteBloqueado');

    // Lote vencido há mais de 7 dias: não pode ser alterado (o servidor também confere)
    let validadeAtual = document.querySelector('#validadeAtualISO').value;
    if (analisarValidade(validadeAtual).situacao == "bloqueada") {
        avisoBloqueado.classList.remove("d-none");
        btnloteAlterar.disabled = true;
        campoValidade.disabled = true;
    }
    else {
        mostrarAvisoValidade(avisoValidade, analisarValidade(campoValidade.value));
    }

    // aviso da validade assim que a data é escolhida
    campoValidade.addEventListener("change", function () {
        mostrarAvisoValidade(avisoValidade, analisarValidade(campoValidade.value));
    });

    btnloteAlterar.addEventListener("click", alterar);

    function alterar() {
        let id = document.querySelector('#idEdicao').value;
        let produto = document.querySelector('#novoProduto').value;
        let lote = document.querySelector('#novoNumeroLote').value.trim();
        let data = campoValidade.value;
        let qnt = document.querySelector('#novaQuantidade').value;

        if (produto == "0" || lote == "" || data == "") {
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
            id_lote: id,
            id_produto: produto,
            numero_lote: lote,
            data_validade: data,
            quantidade_atual: qnt
        };

        btnloteAlterar.disabled = true;

        fetch("/lotes/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                // a mensagem aparece na tela de lotes e some em 4 segundos
                guardarMensagem(r.msg, "success");
                window.location.href = "/lotes";
            } else {
                exibirMensagem(erroModal, r.msg, "danger");
                btnloteAlterar.disabled = false;
            }
        })
        .catch(erro => {
            console.error("Erro ao alterar lote:", erro);
            exibirMensagem(erroModal, "Não foi possível alterar o lote. Erro de conexão com o servidor.", "danger");
            btnloteAlterar.disabled = false;
        });
    }
});