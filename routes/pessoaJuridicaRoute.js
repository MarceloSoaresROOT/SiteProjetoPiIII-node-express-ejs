const express = require('express');
const pessoaJuridicaController = require('../controllers/pessoaJuridicaController');

const router = express.Router();

let controller = new pessoaJuridicaController();

// rota cadastro de clientes
router.get('/', controller.listarFornecedor);

module.exports = router;
