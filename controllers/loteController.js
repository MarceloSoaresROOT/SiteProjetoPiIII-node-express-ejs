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
        let produtos = await produto.listarProdutos()

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
        
        res.render("lotes/alterarLote", {produtos, lote});
    }
        async alterarLote(req, res) {
        var ok = true;
        console.log(req.body.numero_lote)
        console.log(req.body.data_validade);
        console.log(req.body.quantidade_atual);
        if(req.body.id_lote != "" && req.body.id_produto != "" && req.body.numero_lote != ""  && req.body.data_validade != "" && req.body.quantidade_atual>0) {

            let lote = new loteModel(req.body.id_lote,req.body.id_produto,req.body.numero_lote,req.body.data_validade,req.body.quantidade_atual);
            ok = await lote.cadastrarLote();
        }
        else{
            ok = false;
        }
        console.log(ok)
        res.send({ ok: ok })
    }
    async deletar(req, res) {
        if(req.body.id != null) {
            let lote = new loteModel();
            let ok = await lote.excluir(req.body.id);
            if(ok) {
                res.send({ok: true});
            }
            else{
                res.send({ok: false, msg: "Erro ao excluir lote"})
            }
        }
        else{
            res.send({ok: false, msg: "O id para exclusão não foi enviado"})
        }
    }
        

    }

module.exports = loteController
