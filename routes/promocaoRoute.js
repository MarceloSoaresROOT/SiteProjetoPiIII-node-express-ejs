const express = require('express');
const PromocaoController = require('../controllers/promocaoController');
const router = express.Router();

let controller = new PromocaoController();

// rota cadastro de promocao
router.get('/', controller.listarLotePromo);

module.exports = router;
