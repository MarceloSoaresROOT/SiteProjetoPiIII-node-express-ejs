const Database = require("../db/database");

const conexao = new Database();

class MarcaModel {

    #id_marca;
    #nome;
    #total_produtos;

    get id_marca() { return this.#id_marca; }
    set id_marca(marcaId) { this.#id_marca = marcaId; }

    get nome() { return this.#nome; }
    set nome(marcaNome) { this.#nome = marcaNome; }

    get total_produtos() { return this.#total_produtos; }
    set total_produtos(total) { this.#total_produtos = total; }

    constructor(id_marca = 0, nome = "", total_produtos = 0) {
        this.#id_marca = id_marca;
        this.#nome = nome;
        this.#total_produtos = total_produtos;
    }

    // 1 e 3 - Cadastrar nova marca (id_marca == 0) ou Editar marca existente (id_marca > 0)
    async gravar() {
        if (this.#id_marca == 0) {
            let sql = "INSERT INTO tb_marca (nome) VALUES (?)";
            let valores = [this.#nome];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        } else {
            let sql = "UPDATE tb_marca SET nome = ? WHERE id_marca = ?";
            let valores = [this.#nome, this.#id_marca];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
    }

    // 2 - Listar marcas (já traz a quantidade de produtos vinculados para os cards da tela)
    async listarMarcas(termoBusca = "") {
        let sql = `
            SELECT m.id_marca, m.nome, COUNT(p.id_produto) AS total_produtos
            FROM tb_marca m
            LEFT JOIN tb_produto p ON p.id_marca = m.id_marca
        `;
        let valores = [];

        if (termoBusca && termoBusca.trim() !== "") {
            sql += " WHERE m.nome LIKE ? ";
            valores.push(`%${termoBusca.trim()}%`);
        }

        sql += " GROUP BY m.id_marca, m.nome ORDER BY m.nome ASC";

        var rows = await conexao.ExecutaComando(sql, valores);

        let listaRetorno = [];

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                var row = rows[i];
                listaRetorno.push(new MarcaModel(
                    row["id_marca"],
                    row["nome"],
                    Number(row["total_produtos"] || 0)
                ));
            }
        }

        return listaRetorno;
    }

    // Obter uma marca pelo ID (usado na edição)
    async obter(id) {
        let sql = "SELECT id_marca, nome FROM tb_marca WHERE id_marca = ?";
        let valores = [id];

        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new MarcaModel(row["id_marca"], row["nome"]);
        }

        return null;
    }

    // 5 - Validar unicidade do nome da marca (evita duplicidade no cadastro e na edição)
    async existeNome(nome, idIgnorar = 0) {
        let sql = "SELECT id_marca FROM tb_marca WHERE LOWER(nome) = LOWER(?) AND id_marca != ?";
        let valores = [nome.trim(), idIgnorar || 0];

        let rows = await conexao.ExecutaComando(sql, valores);
        return rows.length > 0;
    }

    // 4 - Verificar dependências (quantos produtos usam esta marca antes de excluir)
    async contarProdutosVinculados(id) {
        let sql = "SELECT COUNT(*) AS total FROM tb_produto WHERE id_marca = ?";
        let valores = [id];

        let rows = await conexao.ExecutaComando(sql, valores);
        if (rows.length > 0) {
            return Number(rows[0]["total"] || 0);
        }
        return 0;
    }

    // 4 - Excluir marca ou inativar produtos vinculados caso solicitado
    async excluir(id) {
        let sql = "DELETE FROM tb_marca WHERE id_marca = ?";
        let valores = [id];

        return await conexao.ExecutaComandoNonQuery(sql, valores);
    }

    // Método auxiliar para converter para JSON limpo quando necessário
    toJSON() {
        return {
            id_marca: this.#id_marca,
            nome: this.#nome,
            total_produtos: this.#total_produtos
        };
    }
}

module.exports = MarcaModel;