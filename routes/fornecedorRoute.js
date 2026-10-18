const express = require('express');
const fornecedorController = require('../controllers/fornecedorController');

const router = express.Router();

let controller = new fornecedorController();

// rota cadastro de clientes
router.get('/', controller.listarFornecedor);

module.exports = router;
