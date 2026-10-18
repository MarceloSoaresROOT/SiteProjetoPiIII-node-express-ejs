const express = require('express');
const Quitandacontroller = require('../controllers/hortifruticontroller');

const router = express.Router();

let controller = new Quitandacontroller();

// rota pagina inicial
router.get('/', controller.rotaPrincipal);
// rota gestao de produtos
router.get('/gestao-produtos', controller.rotagestao_produtos);

module.exports = router;
