const Database = require("../db/database");
const banco = new Database();

class descarteModel {

    // Busca o funcionário que registra as devoluções (enquanto não existe login)
    async obterFuncionarioPorMatricula(matricula) {
        let sql = `
            SELECT p.id_pessoa, f.nome, f.matricula
            FROM tb_pessoa p
            INNER JOIN tb_pessoa_fisica f ON f.id_pessoa = p.id_pessoa
            WHERE f.matricula = ? AND p.ativo = 'S'
        `;
        let rows = await banco.ExecutaComando(sql, [matricula]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Lista todos os lotes com o nome do produto e já diz se estão vencidos
    async listarLotes() {
        let sql = `
            SELECT l.id_lote, l.id_produto, l.numero_lote,
                   l.quantidade_atual, l.quantidade_inicial, p.nome,
                   DATE_FORMAT(l.data_validade, '%d/%m/%Y') AS validade_br,
                   (l.data_validade < CURDATE()) AS vencido
            FROM tb_lote l
            INNER JOIN tb_produto p ON p.id_produto = l.id_produto
            ORDER BY p.nome, l.data_validade
        `;
        return await banco.ExecutaComando(sql);
    }

    // Busca um lote específico (o servidor confere a validade e a quantidade cadastrada)
    async obterLote(idLote) {
        let sql = `
            SELECT id_lote, id_produto, numero_lote, quantidade_inicial,
                   (data_validade < CURDATE()) AS vencido
            FROM tb_lote
            WHERE id_lote = ?
        `;
        let rows = await banco.ExecutaComando(sql, [idLote]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Grava a devolução inteira numa TRANSAÇÃO:
    // ou grava tudo, ou não grava nada (se der erro no meio, desfaz).
    //  - itensDescarte: vão para UM descarte (tb_descarte + tb_item_descarte)
    //  - itensEstoque: vão para UMA devolução (tb_devolucao + tb_item_devolucao)
    //                  e voltam para o estoque do lote e do produto
    // Retorna os números gerados: { idDescarte, idDevolucao }
    async registrarDevolucao(idFuncionario, itensDescarte, itensEstoque) {
        let cnn = await banco.conexao.promise().getConnection();

        try {
            await cnn.beginTransaction();

            let idDescarte = null;
            let idDevolucao = null;

            if (itensDescarte.length > 0) {
                // a data do descarte é a data/hora atual do sistema (CURRENT_TIMESTAMP do banco)
                let motivoGeral = "Devolução - " + itensDescarte.length + " item(ns) descartado(s)";
                let [resultado] = await cnn.query(
                    `INSERT INTO tb_descarte (id_funcionario, motivo) VALUES (?, ?)`,
                    [idFuncionario, motivoGeral]
                );
                idDescarte = resultado.insertId;

                for (let i = 0; i < itensDescarte.length; i++) {
                    let item = itensDescarte[i];
                    await cnn.query(
                        `INSERT INTO tb_item_descarte (id_descarte, id_produto, id_lote, itens_qntd, motivo, observacao)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [idDescarte, item.idProduto, item.idLote, item.quantidade, item.motivo, item.observacao]
                    );
                }
            }

            if (itensEstoque.length > 0) {
                // id_pedido fica vazio por enquanto (os pedidos ainda não existem)
                // a data da devolução é a data/hora atual do sistema (CURRENT_TIMESTAMP do banco)
                let motivoGeral = "Devolução ao estoque - " + itensEstoque.length + " item(ns)";
                let [resultado] = await cnn.query(
                    `INSERT INTO tb_devolucao (id_pedido, id_funcionario, motivo, status) VALUES (NULL, ?, ?, 'REGISTRADA')`,
                    [idFuncionario, motivoGeral]
                );
                idDevolucao = resultado.insertId;

                for (let i = 0; i < itensEstoque.length; i++) {
                    let item = itensEstoque[i];

                    await cnn.query(
                        `INSERT INTO tb_item_devolucao (id_devolucao, id_produto, id_lote, itens_qntd, motivo, observacao)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [idDevolucao, item.idProduto, item.idLote, item.quantidade, item.motivo, item.observacao]
                    );
                    await cnn.query(
                        `UPDATE tb_lote SET quantidade_atual = quantidade_atual + ? WHERE id_lote = ?`,
                        [item.quantidade, item.idLote]
                    );
                    // tb_produto.qnt é o estoque que a loja usa para mostrar o produto à venda
                    await cnn.query(
                        `UPDATE tb_produto SET qnt = qnt + ? WHERE id_produto = ?`,
                        [item.quantidade, item.idProduto]
                    );
                }
            }

            await cnn.commit();
            return { idDescarte: idDescarte, idDevolucao: idDevolucao };
        }
        catch (erro) {
            await cnn.rollback();
            throw erro;
        }
        finally {
            cnn.release();
        }
    }

    // Histórico de descartes (um item por linha)
    async listarDescartes() {
        let sql = `
            SELECT d.id_descarte, fu.nome AS funcionario,
                   DATE_FORMAT(d.data_descarte, '%d/%m/%Y %H:%i') AS data_br,
                   p.nome, l.numero_lote, i.itens_qntd, i.motivo, i.observacao
            FROM tb_descarte d
            INNER JOIN tb_item_descarte i ON i.id_descarte = d.id_descarte
            INNER JOIN tb_produto p ON p.id_produto = i.id_produto
            INNER JOIN tb_lote l ON l.id_lote = i.id_lote
            LEFT JOIN tb_pessoa_fisica fu ON fu.id_pessoa = d.id_funcionario
            ORDER BY d.data_descarte DESC, d.id_descarte DESC
        `;
        return await banco.ExecutaComando(sql);
    }

    // Histórico de devoluções que voltaram ao estoque (um item por linha)
    async listarDevolucoes() {
        let sql = `
            SELECT d.id_devolucao, fu.nome AS funcionario,
                   DATE_FORMAT(d.data_devolucao, '%d/%m/%Y %H:%i') AS data_br,
                   p.nome, l.numero_lote, i.itens_qntd, i.motivo, i.observacao
            FROM tb_devolucao d
            INNER JOIN tb_item_devolucao i ON i.id_devolucao = d.id_devolucao
            INNER JOIN tb_produto p ON p.id_produto = i.id_produto
            INNER JOIN tb_lote l ON l.id_lote = i.id_lote
            LEFT JOIN tb_pessoa_fisica fu ON fu.id_pessoa = d.id_funcionario
            ORDER BY d.data_devolucao DESC, d.id_devolucao DESC
        `;
        return await banco.ExecutaComando(sql);
    }
}

module.exports = descarteModel;