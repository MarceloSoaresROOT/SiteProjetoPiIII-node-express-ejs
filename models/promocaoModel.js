const Database = require("../db/database");

const banco = new Database();

class Promocao {

    #id_promocao;
    #descricao;
    #percentual_desconto;
    #data_inicio;
    #data_fim;
    #ativa;

    constructor(
        id_promocao = 0,
        descricao = "",
        percentual_desconto = 0,
        data_inicio = "",
        data_fim = "",
        ativa = "",
    ) {
        this.#id_promocao = id_promocao;
        this.#descricao = descricao;
        this.#percentual_desconto = percentual_desconto;
        this.#data_inicio = data_inicio;
        this.#data_fim = data_fim;
        this.#ativa = ativa;
    }

    // ---------- GETTERS E SETTERS ----------
    get id_promocao() { return this.#id_promocao; }
    set id_promocao(v) { this.#id_promocao = v; }

    get descricao() { return this.#descricao; }
    set descricao(v) { this.#descricao = v; }

    get percentual_desconto() { return this.#percentual_desconto; }
    set percentual_desconto(v) { this.#percentual_desconto = v; }

    get data_inicio() { return this.#data_inicio; }
    set data_inicio(v) { this.#data_inicio = v; }

    get data_fim() { return this.#data_fim; }
    set data_fim(v) { this.#data_fim = v; }

    get ativa() { return this.#ativa; }
    set ativa(v) { this.#ativa = v; }

    // ---------- BANCO ----------
    async cadastrar() {
        let sql = `insert into tb_promocao
            (descricao, percentual_desconto, data_inicio, data_fim, ativa)
            values (?, ?, ?, ?, ?)`;

        let valores = [
            this.#descricao,
            this.#percentual_desconto,
            this.#data_inicio,
            this.#data_fim,
            this.#ativa
        ];

        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        if (result) {
            this.#id_promocao = result;
            return true;
        }
        return false;
    }

    async alterar() {
        let sql = `update tb_promocao
            set descricao = ?, percentual_desconto = ?, data_inicio = ?, data_fim = ?, ativa = ?
            where id_promocao = ?`;

        let valores = [
            this.#descricao,
            this.#percentual_desconto,
            this.#data_inicio,
            this.#data_fim,
            this.#ativa,
            this.#id_promocao
        ];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async excluir() {
        let sql = "delete from tb_promocao where id_promocao = ?";

        let result = await banco.ExecutaComandoNonQuery(sql, [this.#id_promocao]);

        return result;
    }

    async listar() {
        let sql = "select * from tb_promocao";

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let row of rows) {
            lista.push(new Promocao(
                row["id_promocao"],
                row["descricao"],
                row["percentual_desconto"],
                row["data_inicio"],
                row["data_fim"],
                row["ativa"]
            ));
        }

        return lista;
    }

    async obter(id) {
        let sql = "select * from tb_promocao where id_promocao = ?";

        let rows = await banco.ExecutaComando(sql, [id]);

        if (rows.length > 0) {
            let row = rows[0];
            this.#id_promocao = row["id_promocao"];
            this.#descricao = row["descricao"];
            this.#percentual_desconto = row["percentual_desconto"];
            this.#data_inicio = row["data_inicio"];
            this.#data_fim = row["data_fim"];
            this.#ativa = row["ativa"];
            return true;
        }
        return false;
    }

    toJson() {
        return {
            id_promocao: this.#id_promocao,
            descricao: this.#descricao,
            percentual_desconto: this.#percentual_desconto,
            data_inicio: this.#data_inicio,
            data_fim: this.#data_fim,
            ativa: this.#ativa
        };
    }
}

module.exports = Promocao;