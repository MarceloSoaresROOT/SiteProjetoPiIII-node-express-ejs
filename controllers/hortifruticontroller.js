
class Quitandacontroller {


  rotaPrincipal(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('home/index');
    } 
    
    rotagestao_produtos(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('gestao/gestao-produtos');
    }    

   
}

module.exports = Quitandacontroller;