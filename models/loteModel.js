const Database = require("../db/database");
const ProdutoModel = require("./produtoModel");

class loteModel {
    #id_lote;
    #id_produto;
    #numero_lote;
    #data_validade;
    #quantidade_atual;
    #nome;
    constructor(id_lote, id_produto, numero_lote, data_validade, quantidade_atual,nome) {
        this.#id_lote = id_lote;
        this.#id_produto = id_produto;
        this.#numero_lote = numero_lote;
        this.#data_validade = data_validade;
        this.#quantidade_atual = quantidade_atual;
        this.#nome = nome;

    }


    // ID do lote
    set id_lote(valor) {
        this.#id_lote = valor;
    }

    get id_lote() {
        return this.#id_lote;
    }

    // ID do produto
    set id_produto(valor) {
        this.#id_produto = valor;
    }

    get id_produto() {
        return this.#id_produto;
    }

    // Número do lote
    set numero_lote(valor) {
        this.#numero_lote = valor;
    }

    get numero_lote() {
        return this.#numero_lote;
    }

    // Data de validade
    set data_validade(valor) {
        this.#data_validade = valor;
    }

    get data_validade() {
        return this.#data_validade;
    }

    // Quantidade atual
    set quantidade_atual(valor) {
        this.#quantidade_atual = valor;
    }

    get quantidade_atual() {
        return this.#quantidade_atual;
    }
    set nome(nome) {
        this.#nome = nome;
    }

    get nome() {
        return this.#nome;
    }

    async cadastrarLote()
    {

        let sql = 'insert into tb_lote (id_produto,numero_lote,data_validade,quantidade_atual) values (?,?,?,?)'
        let valores = [this.#id_produto,this.#numero_lote,this.#data_validade,this.#quantidade_atual];
        let banco = new Database();
        let result = await banco.ExecutaComando(sql,valores);
        return result;

    } 
    async listarLotes()
    {
        let sql = 'SELECT p.nome, l.* FROM tb_lote l INNER JOIN tb_produto p ON p.id_produto = l.id_produto';
        let banco = new Database()
        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for(let i = 0; i < rows.length; i++) {
            lista.push(new loteModel(rows[i]["id_lote"],rows[i]["id_produto"], rows[i]["numero_lote"], rows[i]["data_validade"], rows[i]["quantidade_atual"],rows[i]["nome"]));
        }
        return lista;
    }


}

module.exports = loteModel;