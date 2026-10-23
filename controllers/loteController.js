const loteModel = require("../models/loteModel");

class loteController
{
     async listarLotesView(req, res) {
        let lote = new loteModel();
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toISOString().split('T')[0]; 
        let lotes = await lote.listarLotes()
        res.render('lotes/lote',{lotes,dataFormatada});
    }

    async cadastroLote()
    {
        if( req.body.lote !="" && req.body.data !="" && req.body.qnt>0)
        {
            let lote = new loteModel(0,1,req.body.lote,req.body.data,req.body.qnt)
            let result = await lote.cadastrar();
            
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

    }

module.exports = loteController
