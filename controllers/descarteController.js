const DescarteModel = require("../models/descarteModel");

// Enquanto não existe login, toda devolução é registrada por este funcionário
// (criado pelo script db/devolucao-descarte.sql)
const MATRICULA_FUNCIONARIO = "F0001";

// Motivos aceitos (o motivo determina o destino)
//  VENCIDO   -> só para lote com validade vencida      -> DESCARTE
//  IMPROPRIO -> qualquer lote                           -> DESCARTE (observação obrigatória)
//  OUTRO     -> só para lote dentro da validade         -> DEVOLUÇÃO ao estoque (observação obrigatória)
//
// Mesmo lote: pode aparecer no máximo 2 vezes na devolução (uma em cada destino).
// Limite: para cada lote, a SOMA das linhas não pode passar da quantidade cadastrada do lote.
const MOTIVOS = {
    VENCIDO: "Vencido",
    IMPROPRIO: "Impróprio para consumo",
    OUTRO: "Outro"
};

class descarteController {

    // Abre a tela de devoluções e descartes
    async descarteView(req, res) {
        let model = new DescarteModel();
        let funcionario = await model.obterFuncionarioPorMatricula(MATRICULA_FUNCIONARIO);
        let lotes = await model.listarLotes();
        let descartes = await model.listarDescartes();
        let devolucoes = await model.listarDevolucoes();
        res.render('descartes/descarte', { funcionario, lotes, descartes, devolucoes });
    }

    // Recebe a devolução (vários itens) e decide o destino de cada um
    async registrarDevolucao(req, res) {
        try {
            let model = new DescarteModel();

            let funcionario = await model.obterFuncionarioPorMatricula(MATRICULA_FUNCIONARIO);
            if (funcionario == null) {
                return res.send({ ok: false, msg: "Funcionário " + MATRICULA_FUNCIONARIO + " não encontrado. Rode o script db/devolucao-descarte.sql no banco." });
            }

            let itens = req.body.itens;
            if (!Array.isArray(itens) || itens.length == 0) {
                return res.send({ ok: false, msg: "Adicione pelo menos um item à devolução." });
            }

            let itensDescarte = [];
            let itensEstoque = [];
            let lotesUsados = [];      // "idLote|destino" já usados
            let somaPorLote = {};      // idLote -> { lote, total }

            // 1ª etapa: confere TODOS os itens antes de gravar qualquer coisa
            for (let i = 0; i < itens.length; i++) {
                let item = itens[i];
                let n = "Item " + (i + 1) + ": ";
                let quantidade = Number(item.quantidade);
                let motivo = item.motivo;
                let observacao = (item.observacao || "").trim();

                if (!item.idLote || item.idLote == "0") {
                    return res.send({ ok: false, msg: n + "selecione o produto/lote." });
                }
                if (!Number.isInteger(quantidade) || quantidade <= 0) {
                    return res.send({ ok: false, msg: n + "informe uma quantidade inteira maior que zero." });
                }
                if (!MOTIVOS[motivo]) {
                    return res.send({ ok: false, msg: n + "selecione o motivo." });
                }

                // o mesmo lote só pode aparecer uma vez em cada destino
                let destino = motivo == "OUTRO" ? "Devolução" : "Descarte";
                let chave = String(item.idLote) + "|" + destino;
                if (lotesUsados.indexOf(chave) >= 0) {
                    return res.send({ ok: false, msg: n + "este lote já está em outro item com destino " + destino + ". Junte as quantidades em uma linha só." });
                }
                lotesUsados.push(chave);

                let lote = await model.obterLote(item.idLote);
                if (lote == null) {
                    return res.send({ ok: false, msg: n + "lote não encontrado." });
                }

                let vencido = lote.vencido == 1;

                if (vencido && motivo == "OUTRO") {
                    return res.send({ ok: false, msg: n + "o lote " + lote.numero_lote + " está vencido e não pode voltar ao estoque. Troque o motivo (Vencido ou Impróprio para consumo) ou troque o lote." });
                }
                if (!vencido && motivo == "VENCIDO") {
                    return res.send({ ok: false, msg: n + "o lote " + lote.numero_lote + " ainda está dentro da validade. O motivo \"Vencido\" só vale para lote com validade passada." });
                }
                if ((motivo == "OUTRO" || motivo == "IMPROPRIO") && observacao == "") {
                    return res.send({ ok: false, msg: n + "a observação é obrigatória quando o motivo é \"" + MOTIVOS[motivo] + "\"." });
                }

                let dados = {
                    idLote: lote.id_lote,
                    idProduto: lote.id_produto,
                    quantidade: quantidade,
                    motivo: MOTIVOS[motivo],
                    observacao: observacao == "" ? null : observacao.substring(0, 255)
                };

                // soma das quantidades de cada lote (Devolução + Descarte)
                if (!somaPorLote[lote.id_lote]) {
                    somaPorLote[lote.id_lote] = { lote: lote, total: 0 };
                }
                somaPorLote[lote.id_lote].total += quantidade;

                if (motivo == "OUTRO") {
                    itensEstoque.push(dados);
                }
                else {
                    itensDescarte.push(dados);
                }
            }

            // limite: a soma das linhas de cada lote não pode passar da quantidade cadastrada do lote
            for (let id in somaPorLote) {
                let s = somaPorLote[id];
                if (s.total > s.lote.quantidade_inicial) {
                    return res.send({ ok: false, msg: "Lote " + s.lote.numero_lote + ": a soma das quantidades (" + s.total + ") passa da quantidade cadastrada do lote (" + s.lote.quantidade_inicial + ")." });
                }
            }

            // 2ª etapa: grava tudo de uma vez (transação)
            let numeros = await model.registrarDevolucao(funcionario.id_pessoa, itensDescarte, itensEstoque);

            let msg = "Devolução registrada.";
            if (itensEstoque.length > 0) {
                let total = itensEstoque.reduce((soma, it) => soma + it.quantidade, 0);
                msg += " " + total + " unidade(s) voltaram para o estoque (devolução nº " + numeros.idDevolucao + ").";
            }
            if (itensDescarte.length > 0) {
                let total = itensDescarte.reduce((soma, it) => soma + it.quantidade, 0);
                msg += " " + total + " unidade(s) foram para o descarte (descarte nº " + numeros.idDescarte + ").";
            }

            return res.send({ ok: true, msg: msg });
        }
        catch (erro) {
            console.error(erro);
            return res.send({ ok: false, msg: "Erro ao registrar a devolução. Nada foi gravado. Veja o terminal do servidor." });
        }
    }
}

module.exports = descarteController;