const express = require('express');
const Quitandacontroller = require('../controllers/hortifruticontroller');

const router = express.Router();

let controller = new Quitandacontroller();
router.get('/index', controller.rotaindex);
router.get('/gestao-produtos', controller.rotagestao_produtos);
router.get('/cartilhas', controller.rotacartilhas);
router.get('/cadastro-fornecedores', controller.rotacadastro_fornecedores);
router.get('/cadastro-clientes', controller.rotacadastro_clientes);

module.exports = router;