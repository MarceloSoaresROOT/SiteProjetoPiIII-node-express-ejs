
const Database = require("../db/database");
const banco = new Database();

class loteModel {
    #id_lote;
    #id_produto;
    #numero_lote;
    #data_validade;
    #quantidade_atual;
    #nome;
    #categoria;
    #marca;
    #descricao;
    #preco;
    #produtoImagem;

    constructor(
        id_lote,
        id_produto,
        numero_lote,
        data_validade,
        quantidade_atual,
        nome,
        categoria,
        marca,
        descricao,
        preco,
        produtoImagem=""
    ) {
        this.#id_lote = id_lote;
        this.#id_produto = id_produto;
        this.#numero_lote = numero_lote;
        this.#data_validade = data_validade;
        this.#quantidade_atual = quantidade_atual;
        this.#nome = nome;
        this.#categoria = categoria;
        this.#marca = marca;
        this.#descricao = descricao;
        this.#preco = preco;
        this.#produtoImagem = produtoImagem;
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

    // Nome do produto
    set nome(valor) {
        this.#nome = valor;
    }

    get nome() {
        return this.#nome;
    }

    // Categoria
    set categoria(valor) {
        this.#categoria = valor;
    }

    get categoria() {
        return this.#categoria;
    }

    // Marca
    set marca(valor) {
        this.#marca = valor;
    }

    get marca() {
        return this.#marca;
    }

    // Descrição do produto
    set descricao(valor) {
        this.#descricao = valor;
    }

    get descricao() {
        return this.#descricao;
    }

    // Preço do produto
    set preco(valor) {
        this.#preco = valor;
    }

    get preco() {
        return this.#preco;
    }
    get produtoImagem() { return this.#produtoImagem; }
    set produtoImagem(produtoImagem) { this.#produtoImagem = produtoImagem; }

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

  
async vitrine() {

    let sql = `
        SELECT
            p.id_produto,
            p.nome,
            p.descricao,
            p.preco,
            p.prd_imagem,
            c.nome AS categoria,
            m.nome AS marca,
            COALESCE(
                SUM(
                    CASE
                        WHEN l.data_validade >= CURDATE()
                        THEN l.quantidade_atual
                        ELSE 0
                    END
                ), 0
            ) AS quantidade_atual
        FROM tb_produto p
        INNER JOIN tb_categoria c
            ON c.id_categoria = p.id_categoria
        INNER JOIN tb_marca m
            ON m.id_marca = p.id_marca
        LEFT JOIN tb_lote l
            ON l.id_produto = p.id_produto
        WHERE p.ativo = 'S'
        GROUP BY
            p.id_produto,
            p.nome,
            p.descricao,
            p.preco,
            p.prd_imagem,
            c.nome,
            m.nome
        ORDER BY p.nome
    `;

    let rows = await banco.ExecutaComando(sql);

    let lista = [];

    for (let i = 0; i < rows.length; i++) {

        let imagemBase64 = "";

        if (rows[i]["prd_imagem"] != null) {
            imagemBase64 =
                "data:image/png;base64," +
                rows[i]["prd_imagem"].toString("base64");
        }

        lista.push({
            id_produto: rows[i]["id_produto"],
            nome: rows[i]["nome"],
            descricao: rows[i]["descricao"],
            preco: Number(rows[i]["preco"]),
            produtoImagem: imagemBase64,
            categoria: rows[i]["categoria"],
            marca: rows[i]["marca"],
            quantidade_atual: Number(rows[i]["quantidade_atual"])
        });
    }

    return lista;
}

}

module.exports = loteModel;
