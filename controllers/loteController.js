const loteModel = require("../models/loteModel");
const ProdutoModel = require("../models/produtoModel");

// Regra da validade (a mesma da tela, em public/js/produtos/validadeLote.js):
//  - mais de 7 dias antes de hoje -> bloqueia
//  - de 1 a 7 dias antes de hoje  -> aceita, mas avisa que é retroativa
const DIAS_RETROATIVOS_PERMITIDOS = 7;

// Converte a data (texto "aaaa-mm-dd" ou Date vindo do banco) para "aaaa-mm-dd"
function paraISO(valor) {
    if (valor instanceof Date) {
        let ano = valor.getFullYear();
        let mes = String(valor.getMonth() + 1).padStart(2, '0');
        let dia = String(valor.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }
    return String(valor || "").slice(0, 10);
}

// Quantos dias a data está ANTES de hoje (negativo = no futuro). null se a data for inválida.
function diasAntesDeHoje(valor) {
    let iso = paraISO(valor);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    let partes = iso.split("-").map(Number);
    let data = new Date(partes[0], partes[1] - 1, partes[2]);
    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.round((hoje - data) / 86400000);
}

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
        try {
            let idProduto = req.body.produto;
            let numeroLote = (req.body.lote || "").trim();
            let data = req.body.data;
            let qnt = Number(req.body.qnt);

            if (!idProduto || idProduto == "0") {
                return resp.send({ ok: false, msg: "Selecione o produto." });
            }
            if (numeroLote == "" || !data || !Number.isInteger(qnt) || qnt <= 0) {
                return resp.send({ ok: false, msg: "Parâmetros preenchidos incorretamente!" });
            }

            let dias = diasAntesDeHoje(data);
            if (dias === null) {
                return resp.send({ ok: false, msg: "Informe uma validade válida." });
            }
            if (dias > DIAS_RETROATIVOS_PERMITIDOS) {
                return resp.send({ ok: false, msg: "A validade não pode ser anterior a " + DIAS_RETROATIVOS_PERMITIDOS + " dias da data de hoje." });
            }

            // o lote é gravado no produto ESCOLHIDO na tela
            let lote = new loteModel(0, idProduto, numeroLote, data, qnt);
            let result = await lote.cadastrarLote();

            if (result) {
                let msg = "Lote cadastrado com sucesso!";
                if (dias >= 1) msg += " Atenção: a validade informada é retroativa (" + dias + " dia(s) antes de hoje).";
                resp.send({ ok: true, msg: msg });
            }
            else {
                resp.send({ ok: false, msg: "Erro ao cadastrar lote!" });
            }
        }
        catch (erro) {
            console.error(erro);
            resp.send({ ok: false, msg: "Erro ao cadastrar lote. Veja o terminal do servidor." });
        }
    }

    async alterarLoteView(req, res){
        let produto = new ProdutoModel();
        let lote = new loteModel();
        let produtos = await produto.listarProdutos()
        if(req.params.id != undefined && req.params.id != ""){
            lote = await lote.obter(req.params.id);
        }

        res.render("lotes/alterarLote", {produtos, lote});
    }

    async alterarLote(req, res) {
        try {
            let idLote = req.body.id_lote;
            let idProduto = req.body.id_produto;
            let numeroLote = (req.body.numero_lote || "").trim();
            let data = req.body.data_validade;

            if (!idLote || !idProduto || idProduto == "0" || numeroLote == "" || !data) {
                return res.send({ ok: false, msg: "Preencha corretamente os campos obrigatórios." });
            }

            let atual = await new loteModel().obter(idLote);
            if (atual == null) {
                return res.send({ ok: false, msg: "Lote não encontrado." });
            }

            // lote vencido há mais de 7 dias não pode mais ser alterado
            let diasAtual = diasAntesDeHoje(atual.data_validade);
            if (diasAtual !== null && diasAtual > DIAS_RETROATIVOS_PERMITIDOS) {
                return res.send({ ok: false, msg: "Este lote está vencido há mais de " + DIAS_RETROATIVOS_PERMITIDOS + " dias e não pode ser alterado." });
            }

            let dias = diasAntesDeHoje(data);
            if (dias === null) {
                return res.send({ ok: false, msg: "Informe uma validade válida." });
            }
            if (dias > DIAS_RETROATIVOS_PERMITIDOS) {
                return res.send({ ok: false, msg: "A validade não pode ser anterior a " + DIAS_RETROATIVOS_PERMITIDOS + " dias da data de hoje." });
            }

            // a quantidade não é alterada aqui (o estoque do lote só muda por movimentação)
            let lote = new loteModel(idLote, idProduto, numeroLote, data, atual.quantidade_atual);
            let ok = await lote.cadastrarLote();

            if (ok) {
                let msg = "Lote alterado com sucesso!";
                if (dias >= 1) msg += " Atenção: a validade informada é retroativa (" + dias + " dia(s) antes de hoje).";
                res.send({ ok: true, msg: msg });
            }
            else {
                res.send({ ok: false, msg: "Erro ao alterar lote." });
            }
        }
        catch (erro) {
            console.error(erro);
            res.send({ ok: false, msg: "Erro ao alterar lote. Veja o terminal do servidor." });
        }
    }

    async deletar(req, res) {
        if(req.body.id != null) {
            try {
                let lote = new loteModel();
                let ok = await lote.excluir(req.body.id);
                if(ok) {
                    res.send({ok: true, msg: "Lote excluído com sucesso!"});
                }
                else{
                    res.send({ok: false, msg: "Erro ao excluir lote"})
                }
            }
            catch(erro) {
                // ER_ROW_IS_REFERENCED_2 (1451): o lote está ligado a outra tabela
                // (pedido, devolução, descarte...) e o banco não deixa apagar
                if(erro.code == "ER_ROW_IS_REFERENCED_2" || erro.errno == 1451) {
                    res.send({ok: false, msg: "Este lote não pode ser excluído porque está vinculado a pedidos, devoluções ou descartes."})
                }
                else {
                    console.error(erro);
                    res.send({ok: false, msg: "Erro ao excluir lote. Veja o terminal do servidor."})
                }
            }
        }
        else{
            res.send({ok: false, msg: "O id para exclusão não foi enviado"})
        }
    }
}

module.exports = loteController