document.addEventListener("DOMContentLoaded", function () {

    var btnSalvarProduto = document.getElementById("btnSalvarProduto");
    btnSalvarProduto.addEventListener("click", gravarProduto);

    var inputArquivo = document.getElementById("novaImagem");
    inputArquivo.addEventListener("change", carregarPrevia);
});

function carregarPrevia() {
    if (this.files.length > 0) {
        let img = document.getElementById("previaImagem");
        img.src = URL.createObjectURL(this.files[0]);
        document.getElementById("divPrevia").style.display = "block";
    }
}
console.log(
    [...document.getElementById("novaMarca").options].map(opcao => ({
        texto: opcao.text,
        valor: opcao.value
    }))
);

function gravarProduto() {

    var inputNome = document.getElementById("novoNome");
    var selCategoria = document.getElementById("novaCategoria");
    var selMarca = document.getElementById("novaMarca");
    var inputValor = document.getElementById("novoPreco");
    var selAtivo = document.getElementById("novoAtivo");
    var inputDescricao = document.getElementById("novaDescricao");
    var inputImagem = document.getElementById("novaImagem");
    var divErro = document.getElementById("erroAdicionarProduto");

console.log("Preço:", inputValor.value, inputValor.value > 0);
console.log("Nome:", inputNome.value, inputNome.value != "");
console.log("Descrição:", inputDescricao.value, inputDescricao.value != "");
console.log("Ativo:", selAtivo.value, selAtivo.value != "");
console.log("Marca:", selMarca.value, selMarca.value > 0);
console.log("Categoria:", selCategoria.value, selCategoria.value > 0);
console.log("Imagem:", inputImagem.files.length, inputImagem.files.length > 0);

    if (inputValor.value > 0 && inputNome.value != "" && inputDescricao.value !="" && selAtivo.value!="" && selMarca.value >0 && selCategoria.value >0 && inputImagem.files.length > 0) {

        divErro.classList.add("d-none");

       let formData = new FormData();
        formData.append("nome", inputNome.value);
        formData.append("descricao", inputDescricao.value);
        formData.append("preco", inputValor.value);
        formData.append("id_marca", selMarca.value);
        formData.append("id_categoria", selCategoria.value);
        formData.append("ativo", selAtivo.value);
        formData.append("imagem", inputImagem.files[0]);

        fetch('/produtos/cadastro', {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(r => {
            console.log(r.ok)
            if (r.ok) {
                
                alert("Produto cadastrado!");
                location.reload()
            } else {
                alert("Erro ao cadastrar produto");
            }
        })
        .catch(e => {
            console.log(e);
        });

    } else {
        divErro.classList.remove("d-none");
    }
}