// controllers/hortifruticontroller.js
const pool = require('../db/db');

class Quitandacontroller {

    // Home: a vitrine vem do banco de dados
    async rotaindex(req, res) {
        const [produtos] = await pool.query(
            `SELECT id, nome, categoria, preco, unidade, estoque, descricao, imagem
               FROM produtos WHERE ativo = 1
              ORDER BY FIELD(categoria,'Frutas','Legumes','Verduras'), nome`
        );
        res.render('index', { produtos });
    }

    rotagestao_produtos(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('gestao-produtos');
    }

    rotacartilhas(req, res) {
        res.render('cartilhas');
    }

    rotacadastro_fornecedores(req, res) {
        res.render('cadastro-fornecedores');
    }

    rotacadastro_clientes(req, res) {
        res.render('cadastro-clientes');
    }
}

module.exports = Quitandacontroller;
