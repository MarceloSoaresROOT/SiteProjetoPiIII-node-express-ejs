const express = require('express');
const PessoaFisicaController = require('../controllers/pessoaFisicaController');

const router = express.Router();

let controller = new PessoaFisicaController();

router.get('/', controller.listarFuncionario);

module.exports = router;
