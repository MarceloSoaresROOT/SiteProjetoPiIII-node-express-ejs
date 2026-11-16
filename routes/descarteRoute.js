const express = require('express');
const descarteController = require('../controllers/descarteController');

const router = express.Router();

let controller = new descarteController();

// tela de devoluções e descartes
router.get('/', controller.descarteView);
// registra uma devolução (cada item vai para o estoque ou para o descarte)
router.post('/devolucao', controller.registrarDevolucao);

module.exports = router;