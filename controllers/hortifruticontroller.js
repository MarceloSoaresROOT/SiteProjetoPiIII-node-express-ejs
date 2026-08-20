// controllers/hortifruticontroller.js

class Quitandacontroller {

    // Em uma classe, declaramos os métodos assim, sem o "exports."
    rotaindex(req, res) {
        // Renderiza o arquivo views/index.ejs
        res.render('index'); 
    }

    rotagestao_produtos(req, res) {
        // Renderiza o arquivo views/gestao-produtos.ejs
        res.render('gestao-produtos');
    }

    rotacartilhas(req, res) {
        // Renderiza o arquivo views/cartilhas.ejs
        res.render('cartilhas');
    }

    rotacadastro_fornecedores(req, res) {
        // Renderiza o arquivo views/cadastro-fornecedores.ejs
        res.render('cadastro-fornecedores');
    }
    rotacadastro_clientes(req,res){
        //Renderiza o arquivo views/cadastro-clientes.ejs
        res.render('cadastro-clientes');
    }
}

// Exporta a classe inteira no final
module.exports = Quitandacontroller;