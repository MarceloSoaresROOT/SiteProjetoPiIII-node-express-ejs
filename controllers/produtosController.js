
const categoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcasModel");
const ProdutoModel = require("../models/produtoModel");
const fs = require("fs");

class ProdutoController {

    async listarView(req, res) {
        let prod = new ProdutoModel();
        let lista = await prod.listarProdutos() ;
         let listaMarcas = [];
        let listaCategorias = [];

        let marca = new MarcaModel();
        listaMarcas = await marca.listarMarcas();

        let categoria = new categoriaModel();
        listaCategorias = await categoria.listarCategorias();

        res.render('produtos/cadastro-produto', {lista: lista,listaMarcas: listaMarcas, listaCategorias: listaCategorias});
    }

    async excluirProduto(req, res){
        var ok = true;
        if(req.body.id != "") {
            let produto = new ProdutoModel();
            ok = await produto.excluir(req.body.id);
        }
        else{
            ok = false;
        }

        res.send({ok: ok});
    }
    async cadastrarProduto(req, res) {
    let ok = false;
    let msg = "";

    try {
        if (req.body.preco > 0 &&
            req.body.nome != "" && 
            req.body.id_marca != "" && req.body.id_marca != "0" &&
            req.body.descricao !="" && req.body.ativo !="" &&
            req.body.id_categoria != "" && req.body.id_categoria != "0" &&
            req.file != null) {

            let produto = new ProdutoModel(
                0,
                req.body.nome,
                req.body.descricao,
                req.body.preco,
                req.body.id_marca,
                req.body.id_categoria,
                req.body.ativo,
                req.file.buffer
            );

            ok = await produto.gravar();
        } else {
            msg = "Preencha todos os campos corretamente.";
        }
    } catch (e) {
        console.log(e);
        msg = "Erro ao cadastrar produto.";
    }

    res.send({ ok: ok, msg: msg });
}

    async alterarView(req, res){
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        
        let categoria = new categoriaModel();
        if(req.params.id != undefined && req.params.id != ""){
            produto = await produto.buscarProduto(req.params.id);
        }

        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategorias();
        res.render("produtos/alterarProduto", {produtoAlter: produto, listaMarcas: listaMarca, listaCategorias: listaCategoria});
    }

    async alterarProduto(req, res) {
    console.log("BODY:", req.body);
    console.log("ARQUIVO:", req.file);
        var ok = false;
           if (req.body.preco > 0 &&
            req.body.nome != "" && 
            req.body.id_marca != "" && req.body.id_marca != "0" &&
            req.body.descricao !="" && req.body.ativo !="" &&
            req.body.id_categoria != "" && req.body.id_categoria != "0" &&
            req.file != null) {

            let produto = new ProdutoModel(
                req.body.id,
                req.body.nome,
                req.body.descricao,
                req.body.preco,
                req.body.id_marca,
                req.body.id_categoria,
                req.body.ativo,
                req.file.buffer
            );

            ok = await produto.gravar();
        } else {
            msg = "Preencha todos os campos corretamente.";
        }

        res.send({ ok: ok })
    }
}

module.exports = ProdutoController;