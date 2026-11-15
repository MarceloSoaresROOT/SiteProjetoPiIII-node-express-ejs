const item_pedido = require("../models/item_pedidoModel");
const loteModel = require("../models/loteModel");
const Pedido = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");

class PedidoController
{

    async gravar(req,res)
    {
        console.log(req.body)
        let ok = true;
        let msg = "";
        if(req.body.length>0)
        {
            let prod = new ProdutoModel();
            let p = new Pedido();
            let lote = new loteModel();
            p.data_pedido = new Date()
            for(let i = 0; i<req.body.length;i++)
            {
                let produto_id = req.body[i].id;
                let quantidade = req.body[i].quantidade;
                let nomeProd = req.body[i].nome

               let totalLotes = await lote.somarLotes(produto_id);

                if (!await prod.consultaEstoque(produto_id, quantidade) ||
                    totalLotes < quantidade) {

                    ok = false;
                    msg = "Estoque insuficiente para " + nomeProd;
                }
            }
            if(ok)
            {
                if(await p.cadastrar())
                { 
                    let valorTotal = 0;

                    for(let i = 0; i<req.body.length;i++)
                    {
                        let produto_id = req.body[i].id;
                        let quantidade = req.body[i].quantidade;

                        prod = await prod.buscarProduto(produto_id)

                        let lotes = await lote.buscarLotes(produto_id);
                        let restante = quantidade;

                        for(let j=0; j<lotes.length;j++)
                        {
                            if(restante>0)
                            {
                                let retirada = Math.min(restante, lotes[j].quantidade_atual);
                                let item = new item_pedido();

                                item.id_pedido = p.id_pedido;
                                item.id_produto = produto_id;
                                item.id_lote = lotes[j].id_lote;
                                item.itens_qntd = retirada;
                                item.itens_valor = prod.preco * retirada;
                                valorTotal += item.itens_valor;
                                item.itens_valorUnidade = prod.preco;
                                await item.gravar();

                                // Abate do lote
                                await lote.atualizarLote(lotes[j].id_lote, retirada);
                                restante -= retirada;
                            }
                        }
                        await prod.atualizarEstoque(produto_id,quantidade);


                      
                    }
                    p.valor_total = valorTotal;
                            
                    await p.atualizarValorTotal();
                }
                else
                {
                    ok = false;
                    msg =  "Erro ao gravar pedido";
                }
            }

        }
        else
        {
            ok = false;
            msg = "Coloque um item no carrinho"
        }

        res.send({ok:ok,msg:msg})
    }


}

module.exports = PedidoController