const Database = require("../db/database");

const banco = new Database()

class Pedido
{
    #id_pedido;
    #id_pessoa;
    #data_pedido;
    #valor_total;

    constructor(id_pedido, id_pessoa, data_pedido, valor_total =0)
    {
        this.#id_pessoa = id_pessoa
        this.#id_pedido = id_pedido;
        this.#data_pedido = data_pedido;
        this.#valor_total = valor_total;
    }

    // Gets
    get id_pedido()
    {
        return this.#id_pedido;
    }
    get id_pessoa()
    {
        return this.#id_pessoa
    }



    get data_pedido()
    {
        return this.#data_pedido;
    }


    get valor_total()
    {
        return this.#valor_total;
    }

    // Sets
    set id_pedido(id_pedido)
    {
        this.#id_pedido = id_pedido;
    }

    set id_pessoa(id_pessoa)
    {
        this.#id_pessoa = id_pessoa
    }

    set data_pedido(data_pedido)
    {
        this.#data_pedido = data_pedido;
    }


    set valor_total(valor_total)
    {
        this.#valor_total = valor_total;
    }


     async atualizarValorTotal() {
        let sql = "update tb_pedido set valor_total = ? where id_pedido = ?";
        let valores = [this.#valor_total, this.#id_pedido];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;

    }

    async cadastrar()
    {
        let sql = "insert into tb_pedido (id_pessoa,data_pedido,valor_total) values(?,?,?)"
        let valores = [1,this.#data_pedido,this.#valor_total]
        let result = await banco.ExecutaComandoLastInserted(sql,valores);

        if(result)
        {
            this.#id_pedido = result;
            return true;
        }

        return false;
    }



}

module.exports = Pedido;