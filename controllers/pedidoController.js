const item_pedido = require("../models/item_pedidoModel");
const loteModel = require("../models/loteModel");
const Pedido = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");
const itens_promocao = require("../models/promocaoItem");

class PedidoController
{
    async gravar(req, res)
    {
        let ok = true;
        let msg = "";

        if (req.body.length > 0)
        {
            let prod = new ProdutoModel();
            let p = new Pedido();
            let lote = new loteModel();
            let promoItens = new itens_promocao();
            p.data_pedido = new Date();

            // ---------- validação ----------
            for (let i = 0; i < req.body.length; i++)
            {
                let produto_id = req.body[i].id;
                let quantidade = Number(req.body[i].quantidade);
                let nomeProd = req.body[i].nome;
                let id_promo = req.body[i].id_promocao;

                if (id_promo)
                {
                    let promo = await promoItens.buscarPromoAtiva(produto_id);

                    if (!promo || String(promo.id_promocao) !== String(id_promo)) {
                        ok = false;
                        msg = "A promoção de " + nomeProd + " não está mais disponível.";
                        break;
                    }
                    if (promo.disponivel < quantidade) {
                        ok = false;
                        msg = "Estoque insuficiente na promoção de " + nomeProd;
                        break;
                    }
                }
                else
                {
                    let totalLotes = await lote.somarLotes(produto_id);

                    if (!await prod.consultaEstoque(produto_id, quantidade) ||
                        totalLotes < quantidade) {
                        ok = false;
                        msg = "Estoque insuficiente para " + nomeProd;
                        break;
                    }
                }
            }

            // ---------- gravação ----------
            if (ok)
            {
                if (await p.cadastrar())
                {
                    let valorTotal = 0;

                    for (let i = 0; i < req.body.length; i++)
                    {
                        let produto_id = req.body[i].id;
                        let quantidade = Number(req.body[i].quantidade);
                        let id_promo = req.body[i].id_promocao;

                        if (id_promo)
                        {
                            // preço e lote vêm do banco, não do navegador
                            let promoProd = await promoItens.buscarPromoAtiva(produto_id);

                            let item = new item_pedido();
                            item.id_pedido = p.id_pedido;
                            item.id_produto = produto_id;
                            item.id_lote = promoProd.id_lote;
                            item.itens_qntd = quantidade;
                            item.itens_valor = promoProd.valor * quantidade;
                            item.itens_valorUnidade = promoProd.valor;
                            valorTotal += item.itens_valor;
                            await item.gravar();

                            // abate do lote e da quantidade promocional
                            await lote.atualizarLote(promoProd.id_lote, quantidade);
                            await promoItens.baixarItensPromo(promoProd.id_promocao, produto_id, quantidade);
                        }
                        else
                        {
                            let produto = await prod.buscarProduto(produto_id);

                            let lotes = await lote.buscarLotes(produto_id);
                            let restante = quantidade;

                            for (let j = 0; j < lotes.length; j++)
                            {
                                if (restante > 0)
                                {
                                    let retirada = Math.min(restante, lotes[j].quantidade_atual);
                                    let item = new item_pedido();

                                    item.id_pedido = p.id_pedido;
                                    item.id_produto = produto_id;
                                    item.id_lote = lotes[j].id_lote;
                                    item.itens_qntd = retirada;
                                    item.itens_valor = produto.preco * retirada;
                                    item.itens_valorUnidade = produto.preco;
                                    valorTotal += item.itens_valor;
                                    await item.gravar();

                                    await lote.atualizarLote(lotes[j].id_lote, retirada);
                                    restante -= retirada;
                                }
                            }
                        }

                        // estoque geral do produto (vale para os dois casos)
                        await prod.atualizarEstoque(produto_id, quantidade);
                    }

                    p.valor_total = valorTotal;
                    await p.atualizarValorTotal();
                }
                else
                {
                    ok = false;
                    msg = "Erro ao gravar pedido";
                }
            }
        }
        else
        {
            ok = false;
            msg = "Coloque um item no carrinho";
        }

        res.send({ ok: ok, msg: msg });
    }
}

module.exports = PedidoController;