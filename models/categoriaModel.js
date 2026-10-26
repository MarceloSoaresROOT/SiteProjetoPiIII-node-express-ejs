const Database = require("../db/database");

const conexao = new Database();



class categoriaModel
{

    #id_categoria;
    #nome;
    #descricao;

    get id_categoria() { return this.#id_categoria; } set id_categoria(categoriaId) {this.#id_categoria = categoriaId;}
    get nome() { return this.#nome; } set nome(categoriaNome) {this.#nome = categoriaNome;}
    get descricao() { return this.#descricao; } set descricao(categoriaDescricao) {this.#descricao = categoriaDescricao;}

    constructor(id_categoria, nome,descricao) {
        this.#id_categoria = id_categoria
        this.#nome = nome
        this.#descricao = descricao
    }





       async listarCategorias() {

        let sql = 'select * from tb_categoria';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new categoriaModel(row['id_categoria'], row['nome'],row['descricao']));
            }
        }

        return listaRetorno;
    }

}


module.exports = categoriaModel