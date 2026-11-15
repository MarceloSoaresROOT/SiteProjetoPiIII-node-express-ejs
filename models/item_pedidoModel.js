const Database = require("../db/database");

const banco = new Database();

class item_pedido
{
    #itens_qntd;
    #itens_valor;
    #itens_valorUnidade;
    #id_produto;
    #id_pedido;
    #id_lote;

    constructor(itens_qntd, itens_valor, itens_valorUnidade, id_produto, id_pedido, id_lote)
    {
        this.#itens_qntd = itens_qntd;
        this.#itens_valor = itens_valor;
        this.#itens_valorUnidade = itens_valorUnidade;
        this.#id_produto = id_produto;
        this.#id_pedido = id_pedido;
        this.#id_lote = id_lote;
    }

    // Gets
    get itens_qntd()
    {
        return this.#itens_qntd;
    }

    get itens_valor()
    {
        return this.#itens_valor;
    }

    get itens_valorUnidade()
    {
        return this.#itens_valorUnidade;
    }

    get id_produto()
    {
        return this.#id_produto;
    }

    get id_pedido()
    {
        return this.#id_pedido;
    }

    get id_lote()
    {
        return this.#id_lote;
    }

    // Sets
    set itens_qntd(itens_qntd)
    {
        this.#itens_qntd = itens_qntd;
    }

    set itens_valor(itens_valor)
    {
        this.#itens_valor = itens_valor;
    }

    set itens_valorUnidade(itens_valorUnidade)
    {
        this.#itens_valorUnidade = itens_valorUnidade;
    }

    set id_produto(id_produto)
    {
        this.#id_produto = id_produto;
    }

    set id_pedido(id_pedido)
    {
        this.#id_pedido = id_pedido;
    }

    set id_lote(id_lote)
    {
        this.#id_lote = id_lote;
    }

async gravar() {
        let sql = "insert into tb_item_pedido (id_pedido,id_produto, id_lote, itens_qntd, itens_valor, item_valorUnitario) values (?, ?, ?, ?, ?,?)";

        let valores = [this.#id_pedido, this.#id_produto, this.#id_lote, this.#itens_qntd, this.#itens_valor,this.#itens_valorUnidade];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
    
}

module.exports = item_pedido;