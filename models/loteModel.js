
const Database = require("../db/database");
const banco = new Database();

class loteModel {
    #id_lote;
    #id_produto;
    #numero_lote;
    #data_validade;
    #quantidade_atual;
    #nome
    constructor(
        id_lote,
        id_produto,
        numero_lote,
        data_validade,
        quantidade_atual,
        nome

    ) {
        this.#id_lote = id_lote;
        this.#id_produto = id_produto;
        this.#numero_lote = numero_lote;
        this.#data_validade = data_validade;
        this.#quantidade_atual = quantidade_atual;
        this.#nome = nome
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
    get nome()
    {
        return this.#nome
    }
    set nome(nome)
    {
        this.#nome = nome
    }

    async somarLotes(id_produto) 
    {

    let sql = `SELECT SUM(quantidade_atual) AS total
               FROM tb_lote
               WHERE id_produto = ?
               AND data_validade >= CURDATE()
               AND quantidade_atual > 0`;

    let rows = await banco.ExecutaComando(sql, [id_produto]);

    return Number(rows[0].total || 0);
    }

    
    async buscarLotes(id_produto,qnt) {

    let sql = `SELECT id_lote, id_produto, data_validade, quantidade_atual
               FROM tb_lote
               WHERE id_produto = ?
               AND data_validade >= CURDATE()
               AND quantidade_atual >0
               ORDER BY data_validade ASC`;

    let valores = [id_produto,qnt];

    let rows = await banco.ExecutaComando(sql, valores);

    return rows;
}
        async atualizarLote(id_lote, quantidade) {

    let sql = `UPDATE tb_lote
               SET quantidade_atual = quantidade_atual - ?
               WHERE id_lote = ?
               AND quantidade_atual >= ?`;

    let valores = [quantidade, id_lote, quantidade];

    return await banco.ExecutaComando(sql, valores);
    }   
  
    async cadastrarLote() {

        if (this.#id_lote == 0) {

            let sql = `insert into tb_lote
                (id_produto, numero_lote, data_validade, quantidade_atual)
                values (?, ?, ?, ?)`;

            let valores = [
                this.#id_produto,
                this.#numero_lote,
                this.#data_validade,
                this.#quantidade_atual
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);

            return result;
        }
        else {

            let sql = `update tb_lote
                set id_produto = ?, numero_lote = ?, data_validade = ?
                where id_lote = ?`;

            let valores = [
                this.#id_produto,
                this.#numero_lote,
                this.#data_validade,
                this.#id_lote
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);

            return result;
        }
    }

    async listarLotes() {

        let sql = `
            SELECT p.nome, l.*
            FROM tb_lote l
            INNER JOIN tb_produto p
                ON p.id_produto = l.id_produto
        `;

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {

            lista.push(new loteModel(
                rows[i]["id_lote"],
                rows[i]["id_produto"],
                rows[i]["numero_lote"],
                rows[i]["data_validade"],
                rows[i]["quantidade_atual"],
                rows[i]["nome"]
            ));
        }

        return lista;
    }

    async obter(id) {

        let sql = `
            SELECT id_lote, id_produto, numero_lote,
                data_validade,
                DATE_FORMAT(data_validade, '%d/%m/%Y') AS validade_br,
                quantidade_atual
            FROM tb_lote
            WHERE id_lote = ?
        `;

        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {

            let row = rows[0];

            let lote = new loteModel(
                row["id_lote"],
                row["id_produto"],
                row["numero_lote"],
                row["data_validade"],
                row["quantidade_atual"]
            );

            lote.validade_br = row["validade_br"];

            return lote;
        }

        return null;
    }

    async excluir(id) {

        let sql = "DELETE FROM tb_lote WHERE id_lote = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

  


}

module.exports = loteModel;
