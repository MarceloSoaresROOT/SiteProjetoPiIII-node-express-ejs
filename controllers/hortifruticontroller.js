

class Quitandacontroller {

    rotagestao_produtos(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('produtos/gestao-produtos');
    }

     rotaPrincipal(req, res) {
        // A tabela é montada no navegador com os dados de /api/produtos
        res.render('home/index');
    }
    rotacartilhas(req, res) {
        res.render('cartilhas');
    }

    rotacadastro_fornecedores(req, res) {
        res.render('usuarios/fornecedor/cadastro-fornecedores');
    }

    rotacadastro_clientes(req, res) {
        res.render('usuarios/clientes/cadastro-clientes');
    }
}

module.exports = Quitandacontroller;