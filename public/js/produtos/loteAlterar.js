
document.addEventListener("DOMContentLoaded", function () {

    let btnloteAlterar = document.querySelector("#btnSalvarAlteracao");

    btnloteAlterar.addEventListener("click", alterar);

    function alterar() {
        let id = document.querySelector('#idEdicao').value;
        let produto = document.querySelector('#novoProduto').value;
        let lote = document.querySelector('#novoNumeroLote').value;
        let data = document.querySelector('#novaValidade').value;
        let qnt = document.querySelector('#novaQuantidade').value;

        let obj = {
            id_lote: id,
            id_produto: produto,
            numero_lote: lote,
             data_validade: data,
             quantidade_atual: qnt
        };

        fetch("/lotes/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(r => {
            if (!r.ok) {
                throw new Error("Erro HTTP: " + r.status);
            }

            return r.json();
        })
        .then(r => {
            console.log(r);
             console.log("Resposta do servidor:", r);
    console.log("Propriedade ok:", r.ok);
    console.log("Propriedade msg:", r.msg);
            if (r.ok) {
                window.location.href = "/lotes";
            } else {
                alert(r.msg);
            }
        })
        .catch(erro => {
            console.error("Erro ao alterar lote:", erro);
            alert("Não foi possível alterar o lote.");
        });
    }
});
