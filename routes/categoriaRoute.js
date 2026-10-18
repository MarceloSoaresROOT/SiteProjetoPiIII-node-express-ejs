const express = require('express');
const categoriasController = require('../controllers/categoriaController');

const router = express.Router();

let controller = new categoriasController();

// rota cadastro de clientes
router.get('/', controller.ListarCategoria);

module.exports = router;
