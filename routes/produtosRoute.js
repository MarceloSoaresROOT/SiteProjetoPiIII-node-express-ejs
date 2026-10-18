const express = require('express');
const produtosController = require('../controllers/produtosController');

const router = express.Router();

let controller = new produtosController();

// rota cadastro de clientes
router.get('/', controller.produtoListar);

module.exports = router;
