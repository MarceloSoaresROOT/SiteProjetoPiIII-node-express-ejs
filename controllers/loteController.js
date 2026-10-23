const loteModel = require("../models/loteModel");
const ProdutoModel = require("../models/produtoModel");

class loteController
{
     async listarLotesView(req, res) {
        let lote = new loteModel();
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAtual.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        let lotes = await lote.listarLotes()

        let produto = new ProdutoModel();
        let produtos = await produto.listarProduto()

        res.render('lotes/lote',{lotes,dataFormatada,produtos});
    }

    async cadastroLote(req,resp)
    {
        if(req.body.lote !="" && req.body.data !="" && req.body.qnt>0)
        {
            let lote = new loteModel(0,1,req.body.lote,req.body.data,req.body.qnt)
            let result = await lote.cadastrarLote()
            console.log(lote)
            if(result) {
                resp.send({
                    ok: true,
                    msg: "Lote cadastrado com sucesso!"
                });
            }   
            else{
                resp.send({
                    ok: false,
                    msg: "Erro ao cadastrar lote!"
                });
            }
        }
        else
        {
            resp.send({
                ok: false,
                msg: "Parâmetros preenchidos incorretamente!"
            });
        }
        }
        async alterarLoteView(req, res){
        let produto = new ProdutoModel();
        let lote = new loteModel();
        let produtos = await produto.listarProduto()
        if(req.params.id != undefined && req.params.id != ""){
            lote = await lote.obter(req.params.id);
        }
        res.render("lotes/lote", {produtos, lote});
    }
        

    }

module.exports = loteController
