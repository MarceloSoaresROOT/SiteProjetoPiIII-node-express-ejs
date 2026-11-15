const express = require('express');
const multer = require('multer');
const PedidoController = require('../controllers/pedidoController');
const router = express.Router();

let controller = new PedidoController();

// rota cadastro de clientes
router.post("/gravar", controller.gravar);

module.exports = router;
