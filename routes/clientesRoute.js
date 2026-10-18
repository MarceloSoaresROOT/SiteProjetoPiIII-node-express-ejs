const express = require('express');
const clientesController = require('../controllers/clientesController');

const router = express.Router();

let controller = new clientesController();

// rota cadastro de clientes
router.get('/', controller.ListarCliente);

module.exports = router;
