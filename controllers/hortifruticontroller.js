const ProdutoModel = require("../models/produtoModel");

class Quitandacontroller {


  async rotaPrincipal(req, res) {
       let vitrine = new ProdutoModel();
        let lista = await vitrine.vitrine();
        // A tabela é montada no navegador com os dados de /api/produtos
            res.render('home/index',{lista});
    } 
    
    rotagestao_produtos(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('gestao/gestao-produtos');
    }     
}

module.exports = Quitandacontroller;