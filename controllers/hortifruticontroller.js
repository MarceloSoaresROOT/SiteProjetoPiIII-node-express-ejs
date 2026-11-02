const loteModel = require("../models/loteModel");

class Quitandacontroller {


  async rotaPrincipal(req, res) {
       let vitrine = new loteModel();
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