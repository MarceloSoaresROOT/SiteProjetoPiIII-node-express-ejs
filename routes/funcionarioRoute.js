const express = require('express');
const funcionariosController = require('../controllers/funcionariosController');

const router = express.Router();

let controller = new funcionariosController();

router.get('/', controller.listarFuncionario);

module.exports = router;
