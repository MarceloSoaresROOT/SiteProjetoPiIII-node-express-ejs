const loteModel = require("../models/loteModel");
const ProdutoModel = require("../models/produtoModel");
const itens_promocao = require("../models/promocaoItem");
const Promocao = require("../models/promocaoModel");
const ProdutoController = require("./produtosController");

class PromocaoController {

    async listarLotePromo(req, res) {
    try {
        let promo = new itens_promocao();
        let lotesPromo = new loteModel();
        let lotes = await lotesPromo.lotesvencimento();
        let atualizarPromo = new Promocao();
        atualizarPromo = await atualizarPromo.atualizarPromoFlag();
        let listaPromo = await promo.listarpromo();
        let promocoes = listaPromo.map(p => p.toJson());
        
        res.render("promocao/promocao", { lotes, promocoes, atualizarPromo });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao listar lotes a vencer.");
    }
}
    async gravarPromo(req,res)
    {
        console.log(req.body)
        var ok = false;
        let msg = "";
        if(req.body.id_lote !="" && req.body.id_produto !="" && req.body.descricao !="" && req.body.percentual !="" && req.body.qnt!="" && req.body.inicio !="" && req.body.fim!="" && req.body.ativo!="")
    {
        let promo = new Promocao( 
        req.body.id_promocao,
        req.body.descricao,
        req.body.percentual,
        req.body.inicio,
        req.body.fim,
        req.body.ativo)

         ok = true;
            
                if(ok)
                {
                    if(await promo.cadastrar())
                    {
                        let item = new itens_promocao();
                        let produto = new ProdutoModel();
                        produto = await produto.buscarProduto(req.body.id_produto)
                        item.id_promocao = promo.id_promocao;
                        item.id_produto = req.body.id_produto;
                        item.id_lote = req.body.id_lote;
                        item.itens_qntd = req.body.qnt;
                        item.itens_valor = produto.preco - (produto.preco * promo.percentual_desconto / 100);    
                        item.gravar();
                    }
                }
                else
                {
                    msg = "erro ao gravar"
                }


    }
    else {
            msg = "Preencha todos os campos corretamente.";
        }



    res.send({ok: ok})

    }

    async atualizarPromo(req, res) {
    let ok = false;
    let msg = "";
    try {
        const { id_promocao, descricao, percentual_desconto, ativo } = req.body;

        if (id_promocao && percentual_desconto && (ativo === "S" || ativo === "N")) {
            let promo = new Promocao();
            promo.id_promocao = id_promocao;
            promo.descricao = descricao;
            promo.percentual_desconto = percentual_desconto;
            promo.ativa = ativo;

            if (await promo.alterar()) {
                // recalcula o preço promocional dos itens com o novo desconto
                let item = new itens_promocao();
                ok = await item.recalcularValor(id_promocao, percentual_desconto);
            }
            if (!ok) msg = "Erro ao atualizar promoção.";
        } else {
            msg = "Preencha todos os campos corretamente.";
        }
    } catch (erro) {
        console.log(erro);
        msg = "Erro interno ao atualizar.";
    }
    res.send({ ok, msg });
}

}

module.exports = PromocaoController;