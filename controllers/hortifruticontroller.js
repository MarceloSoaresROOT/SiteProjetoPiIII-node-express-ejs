const ProdutoModel = require("../models/produtoModel");
const itens_promocao = require("../models/promocaoItem");

class Quitandacontroller {


  async rotaPrincipal(req, res) {
       let vitrine = new ProdutoModel();
        let lista = await vitrine.vitrine();
        let vitrinePromo = new itens_promocao();
        let listarPromo = await vitrinePromo.listarpromoVitrine();
        console.log("PROMOS:", listarPromo.length);

        // A tabela é montada no navegador com os dados de /api/produtos
            res.render('home/index',{lista, listarPromo});
    } 
    
    rotagestao_produtos(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('gestao/gestao-produtos');
    }     

}

module.exports = Quitandacontroller;