const loteModel = require("../models/loteModel");
const { default: itens_promocao } = require("../models/promocaoItem");
const Promocao = require("../models/promocaoModel");

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

    async gravarPromo(req,res)
    {
        console.log(req.body)
        var ok = false
        if(req.body.id_lote !="" && req.body.id_produto !="" && req.body.descricao !="" && req.body.percentual !="" && req.body.qnt!="" && req.body.inicio !="" && req.body.fim!="")
    {
        let promo = new Promocao( 
        req.id_promocao,
        req.id_produto,
        req.descricao,
        req.percentual_desconto,
        req.data_inicio,
        req.data_fim,
        req.ativa)

         ok = true;
            
                if(ok)
                {
                    if(await promo.gravar())
                    {
                        let item = new itens_promocao();

                        item.id_promocao = promo.id_promocao
                    }
                }


    }
    else {
            msg = "Preencha todos os campos corretamente.";
        }



    res.send({ok: ok})

    }
}

module.exports = PromocaoController;