const express = require('express');
const loteController = require('../controllers/loteController');

const router = express.Router();

let controller = new loteController();

// rota cadastro de clientes
router.get('/', controller.listarLotesView);
router.post('/cadastrar',controller.cadastroLote)
// router.post("/excluir", ctrl.excluirProduto);
// router.get("/alterar/:id", controller.alterarLoteView);
// router.post("/alterar", controller.alterarLote);
module.exports = router;
