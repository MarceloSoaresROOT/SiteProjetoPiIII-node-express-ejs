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
    #produtoImagem;
    #qnt;
    #nome_marca;
    #nome_categoria;

    constructor(id_produto, nome, descricao, preco, produtoImagem = "", ativo, qnt, id_marca, id_categoria, nome_marca = "", nome_categoria = "") {
        this.#id_produto = id_produto;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#preco = preco;
        this.#produtoImagem = produtoImagem;
        this.#ativo = ativo;
        this.#qnt = qnt;
        this.#id_marca = id_marca;
        this.#id_categoria = id_categoria;
        this.#nome_marca = nome_marca;
        this.#nome_categoria = nome_categoria;
    }

    get id_produto() { return this.#id_produto; }
    set id_produto(id_produto) { this.#id_produto = id_produto; }

    get nome() { return this.#nome; }
    set nome(nome) { this.#nome = nome; }

    get descricao() { return this.#descricao; }
    set descricao(descricao) { this.#descricao = descricao; }

    get preco() { return this.#preco; }
    set preco(preco) { this.#preco = preco; }

    get id_marca() { return this.#id_marca; }
    set id_marca(id_marca) { this.#id_marca = id_marca; }

    get id_categoria() { return this.#id_categoria; }
    set id_categoria(id_categoria) { this.#id_categoria = id_categoria; }

    get ativo() { return this.#ativo; }
    set ativo(ativo) { this.#ativo = ativo; }

    get produtoImagem() { return this.#produtoImagem; }
    set produtoImagem(produtoImagem) { this.#produtoImagem = produtoImagem; }

    get qnt() { return this.#qnt; }
    set qnt(qnt) { this.#qnt = qnt; }

    get nome_marca() { return this.#nome_marca; }
    set nome_marca(nome_marca) { this.#nome_marca = nome_marca; }

    get nome_categoria() { return this.#nome_categoria; }
    set nome_categoria(nome_categoria) { this.#nome_categoria = nome_categoria; }

    async excluir(codigo) {
        let sql = "delete from tb_produto where id_produto = ?";
        let valores = [codigo];

        return await conexao.ExecutaComandoNonQuery(sql, valores);
    }

    async gravar() {
        if (this.#id_produto == 0) {
            let sql = `insert into tb_produto
                (nome, descricao, preco, prd_imagem, ativo, qnt, id_marca, id_categoria)
                values (?, ?, ?, ?, ?, ?, ?, ?)`;

            let valores = [
                this.#nome,
                this.#descricao,
                this.#preco,
                this.#produtoImagem,
                this.#ativo,
                this.#qnt,
                this.#id_marca,
                this.#id_categoria,
            ];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        } else {
            let sql = `update tb_produto set
                nome = ?, descricao = ?, preco = ?, prd_imagem = ?, ativo = ?, qnt = ?, id_marca = ?,
                id_categoria = ? 
                where id_produto = ?`;

            let valores = [
                this.#nome,
                this.#descricao,
                this.#preco,
                this.#produtoImagem,
                this.#ativo,
                this.#qnt,
                this.#id_marca,
                this.#id_categoria,
                this.#id_produto
            ];

            return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
        }
    }

    async buscarProduto(id) {
        let sql = "select * from tb_produto where id_produto = ?";
        let valores = [id];
        var rows = await conexao.ExecutaComando(sql, valores);

        let produto = null;

        if (rows.length > 0) {
            var row = rows[0];

            produto = new ProdutoModel(
                row["id_produto"],
                row["nome"],
                row["descricao"],
                row["preco"],
                "",
                row["ativo"],
                row["qnt"],
                row["id_marca"],
                row["id_categoria"]
            );

            if (row["prd_imagem"] != null) {
                produto.produtoImagem =
                    "data:image/png;base64," + row["prd_imagem"].toString("base64");
            } else {
                produto.produtoImagem =
                    global.CAMINHO_IMG_BROWSER + "sem-foto.png";
            }
        }

        return produto;
    }

    async listarProdutos() {
        let sql = `select p.*, m.nome as nome_marca, c.descricao as nome_categoria
                   from tb_produto p
                   inner join tb_categoria c on p.id_categoria = c.id_categoria
                   inner join tb_marca m on p.id_marca = m.id_marca
                   order by p.id_produto`;

        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            var row = rows[i];

            let imagemBase64 = "";
            if (row["prd_imagem"] != null) {
                imagemBase64 = "data:image/png;base64," + row["prd_imagem"].toString("base64");
            }

            listaRetorno.push(new ProdutoModel(
                row["id_produto"],
                row["nome"],
                row["descricao"],
                row["preco"],
                imagemBase64,
                row["ativo"],
                row["qnt"],
                row["id_marca"],
                row["id_categoria"],
                row["nome_marca"],
                row["nome_categoria"]
            ));
        }

        return listaRetorno;
    }   

   
async vitrine() {
    let sql = `
        SELECT
            p.id_produto,
            p.nome,
            p.descricao,
            p.preco,
            p.prd_imagem,
            p.qnt,
            c.descricao AS categoria,
            m.nome AS marca

        FROM tb_produto p

        INNER JOIN tb_categoria c
            ON c.id_categoria = p.id_categoria

        INNER JOIN tb_marca m
            ON m.id_marca = p.id_marca

        WHERE
            p.ativo = 'S'
            AND p.qnt > 0

            AND EXISTS (
                SELECT 1
                FROM tb_lote l
                WHERE
                    l.id_produto = p.id_produto
                    AND l.data_validade >= CURDATE()
            )

        ORDER BY p.nome
    `;

    let rows = await conexao.ExecutaComando(sql);

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
            qnt: Number(rows[i]["qnt"]),
            categoria: rows[i]["categoria"],
            marca: rows[i]["marca"],
        });
    }

    return lista;
}

}

module.exports = ProdutoModel;