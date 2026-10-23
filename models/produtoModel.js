const Database = require("../db/database");

const conexao = new Database();

class ProdutoModel {
    #id_produto;
    #nome;
    #descricao;
    #preco;
    #id_marca;
    #id_categoria;
    #ativo;

    constructor(id_produto, nome, descricao, preco, id_marca, id_categoria, ativo) {
        this.#id_produto = id_produto;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#preco = preco;
        this.#id_marca = id_marca;
        this.#id_categoria = id_categoria;
        this.#ativo = ativo;
    }

    get id_produto() {
        return this.#id_produto;
    }

    set id_produto(id_produto) {
        this.#id_produto = id_produto;
    }

    get nome() {
        return this.#nome;
    }

    set nome(nome) {
        this.#nome = nome;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(descricao) {
        this.#descricao = descricao;
    }

    get preco() {
        return this.#preco;
    }

    set preco(preco) {
        this.#preco = preco;
    }

    get id_marca() {
        return this.#id_marca;
    }

    set id_marca(id_marca) {
        this.#id_marca = id_marca;
    }

    get id_categoria() {
        return this.#id_categoria;
    }

    set id_categoria(id_categoria) {
        this.#id_categoria = id_categoria;
    }

    get ativo() {
        return this.#ativo;
    }

    set ativo(ativo) {
        this.#ativo = ativo;
    }

    async listarProduto ()
    {
        let sql = 'select * from tb_produto'
        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];
        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new ProdutoModel
                    (row['id_produto'], row['nome'],row['descricao'],row['preco'],row['id_marca'],row['id_categoria'],row['ativo']));
            }
        }

        return listaRetorno;
    }

    }

module.exports = ProdutoModel;