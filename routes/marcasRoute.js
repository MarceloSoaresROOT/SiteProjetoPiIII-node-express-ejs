const express = require('express');
const marcasController = require('../controllers/marcasController');

const router = express.Router();

let controller = new marcasController();

// 2 - Rota de listagem e pesquisa de marcas
router.get('/', (req, res) => controller.listarMarca(req, res));
router.get('/obter/:id', (req, res) => controller.obterMarca(req, res));

// 1 - Rota para cadastrar nova marca
router.post('/cadastrar', (req, res) => controller.cadastrarMarca(req, res));

// 3 - Rota para editar marca existente
router.post('/alterar', (req, res) => controller.alterarMarca(req, res));

// 4 - Rota para excluir marca (individual ou selecionadas)
router.post('/excluir', (req, res) => controller.excluirMarca(req, res));

module.exports = router;