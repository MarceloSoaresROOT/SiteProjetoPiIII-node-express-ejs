
document.addEventListener("DOMContentLoaded", function () {

    var btnGravar = document.getElementById("textoBtnSalvar");

    btnGravar.addEventListener("click", alterarProduto);

    let inputArquivo = document.getElementById("inputImagem");

    if (inputArquivo) {
        inputArquivo.addEventListener("change", carregarPrevia);
    }
});

function carregarPrevia() {
    if (this.files.length > 0) {
        let img = document.getElementById("previaImagem");
        let urlImg = URL.createObjectURL(this.files[0]);

        img.src = urlImg;
        document.getElementById("divPrevia").style.display = "block";
    }
}

function alterarProduto() {

    var inputId = document.getElementById("idEdicao");
    var inputNome = document.getElementById("novoNome");
    var selCategoria = document.getElementById("novaCategoria");
    var selMarca = document.getElementById("novaMarca");
    var inputValor = document.getElementById("novoPreco");
    var selAtivo = document.getElementById("novoAtivo");
    var inputDescricao = document.getElementById("novaDescricao");
    var inputImagem = document.getElementById("inputImagem");
    if (inputValor.value > 0 && inputNome.value != "" && inputDescricao.value !="" && selAtivo.value!="" && selMarca.value >0 && selCategoria.value >0 && inputImagem.files.length > 0) {

        let formData = new FormData();

        formData.append("id", inputId.value);
        formData.append("nome", inputNome.value);
        formData.append("descricao", inputDescricao.value);
        formData.append("preco", inputValor.value);
        formData.append("id_marca", selMarca.value);
        formData.append("id_categoria", selCategoria.value);
        formData.append("ativo", selAtivo.value);
        formData.append("imagem", inputImagem.files[0]);

        fetch("/produtos/alterar", {
            method: "POST",
            body: formData
        })
    .then(async r => {
    const texto = await r.text();
    console.log("Status HTTP:", r.status);
    console.log("Resposta do servidor:", texto);

    return JSON.parse(texto);
})
 .then(r=> {
            if(r.ok) {
                alert("Produto alterado!");
                window.location.href="/produtos";
            }
            else{
                alert("Erro ao alterar produto");
            }
        })
        .catch(e => {
            console.log(e);
        })

    } else {
        alert("Preencha todos os campos corretamente!");
    }
}
