const express = require('express');
const loteController = require('../controllers/loteController');

const router = express.Router();

let controller = new loteController();

// rota cadastro de clientes
router.get('/', controller.listarLote);

module.exports = router;
