const loteModel = require("../models/loteModel");

class PromocaoController {

    async listarLotePromo(req, res) {
        try {
            let lotesPromo = new loteModel();
            let lotes = await lotesPromo.lotesvencimento();

            res.render("promocao/promocao", { lotes });
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao listar lotes a vencer.");
        }
    }

    
}

module.exports = PromocaoController;