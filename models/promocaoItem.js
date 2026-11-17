import Database from "../utils/database.js";

const banco = new Database();

export default class itens_promocao {

    #id_promocao;
    #descricao;
    #percentual_desconto;
    #data_inicio;
    #data_fim;
    #ativa;
    #itens_qntd;
    #itens_valor;
    #id_lote;
    #quantidade_atual; // do lote
    #produto;
    #preco;
    #id_produto;

    constructor(
        id_promocao = 0,
        descricao = "",
        percentual_desconto = 0,
        data_inicio = "",
        data_fim = "",
        ativa = 1,
        itens_qntd = 0,
        itens_valor = 0,
        id_lote = 0,
        quantidade_atual = 0,
        produto = "",
        preco = 0,
        id_produto = 0
    ) {
        this.#id_promocao = id_promocao;
        this.#descricao = descricao;
        this.#percentual_desconto = percentual_desconto;
        this.#data_inicio = data_inicio;
        this.#data_fim = data_fim;
        this.#ativa = ativa;
        this.#itens_qntd = itens_qntd;
        this.#itens_valor = itens_valor;
        this.#id_lote = id_lote;
        this.#quantidade_atual = quantidade_atual;
        this.#produto = produto;
        this.#preco = preco;
        this.#id_produto = id_produto;
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

    get itens_qntd() { return this.#itens_qntd; }
    set itens_qntd(v) { this.#itens_qntd = v; }

    get itens_valor() { return this.#itens_valor; }
    set itens_valor(v) { this.#itens_valor = v; }

    get id_lote() { return this.#id_lote; }
    set id_lote(v) { this.#id_lote = v; }

    get quantidade_atual() { return this.#quantidade_atual; }
    set quantidade_atual(v) { this.#quantidade_atual = v; }

    get produto() { return this.#produto; }
    set produto(v) { this.#produto = v; }

    get preco() { return this.#preco; }
    set preco(v) { this.#preco = v; }

    get id_produto() { return this.#id_produto; }
    set id_produto(v) { this.#id_produto = v; }

    // ---------- BANCO ----------
    async gravar() {
        let sql = `insert into tb_item_promocao
            (id_promocao, id_lote, itens_qntd, itens_valor, id_produto)
            values (?, ?, ?, ?, ?)`;

        let valores = [
            this.#id_promocao,
            this.#id_lote,
            this.#itens_qntd,
            this.#itens_valor,
            this.#id_produto
        ];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async listarpromo() {
        let sql = `select
                p.id_promocao,
                p.descricao,
                p.percentual_desconto,
                p.data_inicio,
                p.data_fim,
                p.ativa,
                i.itens_qntd,
                i.itens_valor,
                l.id_lote,
                l.quantidade_atual,
                pr.nome as produto,
                pr.preco as precoNormal,
                i.id_produto
            from tb_promocao p
            inner join tb_item_promocao i on p.id_promocao = i.id_promocao
            inner join tb_produto pr on pr.id_produto = i.id_produto
            inner join tb_lote l on l.id_lote = i.id_lote`;

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let row of rows) {
            lista.push(new itens_promocao(
                row["id_promocao"],
                row["descricao"],
                row["percentual_desconto"],
                row["data_inicio"],
                row["data_fim"],
                row["ativa"],
                row["itens_qntd"],
                row["itens_valor"],
                row["id_lote"],
                row["quantidade_atual"],
                row["produto"],
                row["precoNormal"],
                row["id_produto"]
            ));
        }

        return lista;
    }

    toJson() {
        return {
            id_promocao: this.#id_promocao,
            descricao: this.#descricao,
            percentual_desconto: this.#percentual_desconto,
            data_inicio: this.#data_inicio,
            data_fim: this.#data_fim,
            ativa: this.#ativa,
            itens_qntd: this.#itens_qntd,
            itens_valor: this.#itens_valor
        };
    }
}