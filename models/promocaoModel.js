class Promocao
{
    #id_promocao;
    #descricao;
    #percentual_desconto;
    #data_inicio;
    #data_fim;
    #ativa;

    async cadastrar()
    {
            let sql = `insert into tb_promocao (descricao,percentual_desconto,data_inicio,data_fim,ativa) 
            values (?,?,?,?,?)`;
            
            let valores = [this.#descricao,this.#percentual_desconto,this.#data_inicio,this.#data_fim,this.#ativa];
            let result = await banco.ExecutaComandoLastInserted(sql,valores);

            if(result)
            {
                this.#id_promocao = result;
                return true;
            }
            return false;
    }

}


module.exports = Promocao