const Database = require("../db/database");

const conexao = new Database();



class MarcaModel
{

    #id_marca;
    #nome;

    get id_marca() { return this.#id_marca; } set id_marca(marcaId) {this.#id_marca = marcaId;}
    get nome() { return this.#nome; } set nome(marcaNome) {this.#nome = marcaNome;}

    constructor(id_marca, nome) {
        this.#id_marca = id_marca
        this.#nome = nome
    }

       async listarMarcas() {

        let sql = 'select * from tb_marca';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new MarcaModel
                    (row['id_marca'], row['nome']));
            }
        }

        return listaRetorno;
    }

}

module.exports = MarcaModel;