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
    #nome_marca;
    #nome_categoria;

    constructor(id_produto, nome, descricao, preco, id_marca, id_categoria, ativo, produtoImagem = "", nome_marca = "", nome_categoria = "") {
        this.#id_produto = id_produto;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#preco = preco;
        this.#id_marca = id_marca;
        this.#id_categoria = id_categoria;
        this.#ativo = ativo;
        this.#produtoImagem = produtoImagem;
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
                (nome, descricao, preco, id_marca, id_categoria, ativo, prd_imagem)
                values (?, ?, ?, ?, ?, ?, ?)`;

            let valores = [
                this.#nome,
                this.#descricao,
                this.#preco,
                this.#id_marca,
                this.#id_categoria,
                this.#ativo,
                this.#produtoImagem
            ];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        } else {
            let sql = `update tb_produto set
                nome = ?, descricao = ?, preco = ?, id_marca = ?,
                id_categoria = ?, ativo = ?, prd_imagem = ?
                where id_produto = ?`;

            let valores = [
                this.#nome,
                this.#descricao,
                this.#preco,
                this.#id_marca,
                this.#id_categoria,
                this.#ativo,
                this.#produtoImagem,
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
                row["id_marca"],
                row["id_categoria"],
                row["ativo"]
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
        let sql = `select p.*, m.nome as nome_marca, c.nome as nome_categoria
                   from tb_produto p
                   inner join tb_categoria c on p.id_categoria = c.id_categoria
                   inner join tb_marca m on p.id_marca = m.id_marca
                   order by p.id_produto`;

        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            var row = rows[i];

            // converter binário da imagem em base64
            let imagemBase64 = "";
            if (row["prd_imagem"] != null) {
                imagemBase64 = "data:image/png;base64," + row["prd_imagem"].toString("base64");
            }

            listaRetorno.push(new ProdutoModel(
                row["id_produto"],
                row["nome"],
                row["descricao"],
                row["preco"],
                row["id_marca"],
                row["id_categoria"],
                row["ativo"],
                imagemBase64,
                row["nome_marca"],
                row["nome_categoria"]
            ));
        }

        return listaRetorno;
    }   
}

module.exports = ProdutoModel;