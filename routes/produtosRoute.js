const express = require('express');
const produtosController = require('../controllers/produtosController');
const multer = require('multer');
const router = express.Router();
const upload = multer({});

let controller = new produtosController();

// rota cadastro de clientes
router.get('/', controller.listarView);
router.post("/cadastro", upload.single("imagem"), controller.cadastrarProduto);
router.post("/excluir", controller.excluirProduto);
router.get("/alterar/:id", controller.alterarView);
router.post("/alterar",upload.single("imagem"), controller.alterarProduto);


module.exports = router;
