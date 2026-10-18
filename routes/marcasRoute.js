const express = require('express');
const marcasController = require('../controllers/marcasController');

const router = express.Router();

let controller = new marcasController();

// rota cadastro de clientes
router.get('/', controller.listarMarca);

module.exports = router;
