const MarcaModel = require("../models/marcasModel");

class marcasController {

    // 6 - Validação auxiliar de permissão de acesso ao gerenciamento de marcas
    possuiPermissao(req) {
        let perfil = req.headers["x-perfil"] || (req.body && req.body.perfil) || (req.query && req.query.perfil) || "";
        perfil = String(perfil).toUpperCase().trim();

        // Se houver um perfil identificado como cliente/sócio comum, bloqueia ações de modificação
        if (perfil === "CLIENTE" || perfil === "SOCIO") {
            return false;
        }
        return true;
    }

    // 5 - Validação auxiliar das regras de negócio do nome da marca
    validarNome(nome) {
        if (nome === undefined || nome === null) {
            return "Informe o nome da marca.";
        }

        let nomeLimpo = String(nome).trim();

        if (nomeLimpo === "") {
            return "O nome da marca é obrigatório.";
        }

        if (nomeLimpo.length < 2) {
            return "O nome da marca deve ter pelo menos 2 caracteres.";
        }

        if (nomeLimpo.length > 100) {
            return "O nome da marca deve ter no máximo 100 caracteres.";
        }

        // Permite letras (com acentos), números, espaços, hífen, e comercial (&), ponto e apóstrofo
        let formatoValido = /^[A-Za-zÀ-ÿ0-9\s\-&.'’]+$/.test(nomeLimpo);
        if (!formatoValido || /^[\d\s\W]+$/.test(nomeLimpo)) {
            return "Informe um nome de marca válido (deve conter letras e não usar caracteres especiais inválidos).";
        }

        return "";
    }

    // 2 - Listar marcas na tela principal (views/marcas/marcas.ejs)
    async listarMarca(req, res) {
        try {
            let termoBusca = req.query.busca || "";
            let filtro = req.query.filtro || "todos";

            let marca = new MarcaModel();
            let todasMarcas = await marca.listarMarcas();

            let totalMarcas = todasMarcas.length;
            let marcasComProdutos = todasMarcas.filter(m => m.total_produtos > 0).length;
            let marcasSemProdutos = todasMarcas.filter(m => m.total_produtos === 0).length;

            // Aplica busca por texto, se informada
            let lista = termoBusca.trim() !== ""
                ? await marca.listarMarcas(termoBusca)
                : todasMarcas;

            // Aplica filtro básico (com produtos / sem produtos)
            if (filtro === "com_produtos") {
                lista = lista.filter(m => m.total_produtos > 0);
            } else if (filtro === "sem_produtos") {
                lista = lista.filter(m => m.total_produtos === 0);
            }

            res.render("marcas/marcas", {
                lista: lista,
                totalMarcas: totalMarcas,
                marcasComProdutos: marcasComProdutos,
                marcasSemProdutos: marcasSemProdutos,
                termoBusca: termoBusca,
                filtroAtual: filtro
            });
        } catch (e) {
            console.log(e);
            res.render("marcas/marcas", {
                lista: [],
                totalMarcas: 0,
                marcasComProdutos: 0,
                marcasSemProdutos: 0,
                termoBusca: "",
                filtroAtual: "todos"
            });
        }
    }

    // 2 - Endpoint JSON para pesquisa/listagem dinâmica e obtenção de marca por ID
    async obterMarca(req, res) {
        try {
            if (req.params.id != undefined && req.params.id != "") {
                let marcaModel = new MarcaModel();
                let marca = await marcaModel.obter(req.params.id);

                if (marca) {
                    res.send({
                        ok: true,
                        marca: {
                            id_marca: marca.id_marca,
                            nome: marca.nome
                        }
                    });
                } else {
                    res.send({ ok: false, msg: "Marca não encontrada." });
                }
            } else {
                res.send({ ok: false, msg: "ID da marca não informado." });
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, msg: "Erro ao buscar dados da marca." });
        }
    }

    // 1 - Cadastrar nova marca
    async cadastrarMarca(req, res) {
        try {
            if (!this.possuiPermissao(req)) {
                return res.status(403).send({
                    ok: false,
                    msg: "Acesso negado: seu perfil não possui permissão para cadastrar marcas."
                });
            }

            let nome = req.body.nome ? String(req.body.nome).trim() : "";
            let erroValidacao = this.validarNome(nome);

            if (erroValidacao !== "") {
                return res.send({ ok: false, msg: erroValidacao });
            }

            let marcaModel = new MarcaModel();
            let jaExiste = await marcaModel.existeNome(nome, 0);

            if (jaExiste) {
                return res.send({
                    ok: false,
                    msg: "Já existe uma marca cadastrada com este nome!"
                });
            }

            let novaMarca = new MarcaModel(0, nome);
            let result = await novaMarca.gravar();

            if (result) {
                res.send({
                    ok: true,
                    msg: "Marca cadastrada com sucesso!"
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao cadastrar marca no banco de dados!"
                });
            }
        } catch (e) {
            console.log(e);
            res.send({
                ok: false,
                msg: "Erro ao cadastrar marca!"
            });
        }
    }

    // 3 - Editar dados de uma marca existente
    async alterarMarca(req, res) {
        try {
            if (!this.possuiPermissao(req)) {
                return res.status(403).send({
                    ok: false,
                    msg: "Acesso negado: seu perfil não possui permissão para editar marcas."
                });
            }

            let id = Number(req.body.id_marca || req.body.id || 0);
            let nome = req.body.nome ? String(req.body.nome).trim() : "";

            if (!id || id <= 0) {
                return res.send({ ok: false, msg: "ID da marca inválido para alteração." });
            }

            let erroValidacao = this.validarNome(nome);
            if (erroValidacao !== "") {
                return res.send({ ok: false, msg: erroValidacao });
            }

            let marcaModel = new MarcaModel();
            let marcaExistente = await marcaModel.obter(id);

            if (!marcaExistente) {
                return res.send({ ok: false, msg: "A marca que você tentou editar não existe." });
            }

            let nomeDuplicado = await marcaModel.existeNome(nome, id);
            if (nomeDuplicado) {
                return res.send({
                    ok: false,
                    msg: "Já existe outra marca cadastrada com este nome!"
                });
            }

            let marcaAtualizada = new MarcaModel(id, nome);
            let ok = await marcaAtualizada.gravar();

            if (ok) {
                res.send({
                    ok: true,
                    msg: "Marca atualizada com sucesso!"
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Nenhuma alteração foi realizada na marca."
                });
            }
        } catch (e) {
            console.log(e);
            res.send({
                ok: false,
                msg: "Erro ao atualizar marca!"
            });
        }
    }

    // 4 - Excluir marca (tratando dependência com produtos vinculados)
    async excluirMarca(req, res) {
        try {
            if (!this.possuiPermissao(req)) {
                return res.status(403).send({
                    ok: false,
                    msg: "Acesso negado: seu perfil não possui permissão para excluir marcas."
                });
            }

            let idsParaExcluir = [];

            if (Array.isArray(req.body.ids) && req.body.ids.length > 0) {
                idsParaExcluir = req.body.ids.map(id => Number(id)).filter(id => id > 0);
            } else if (req.body.id != null && req.body.id !== "") {
                idsParaExcluir = [Number(req.body.id)];
            }

            if (idsParaExcluir.length === 0) {
                return res.send({
                    ok: false,
                    msg: "O ID para exclusão não foi enviado."
                });
            }

            let marcaModel = new MarcaModel();
            let bloqueadas = [];
            let excluidas = 0;

            for (let i = 0; i < idsParaExcluir.length; i++) {
                let idAtual = idsParaExcluir[i];
                let qtdProdutos = await marcaModel.contarProdutosVinculados(idAtual);

                if (qtdProdutos > 0) {
                    let dadosMarca = await marcaModel.obter(idAtual);
                    let nomeMarca = dadosMarca ? dadosMarca.nome : `#${idAtual}`;
                    bloqueadas.push(`${nomeMarca} (${qtdProdutos} produto(s) vinculado(s))`);
                } else {
                    let excluiu = await marcaModel.excluir(idAtual);
                    if (excluiu) excluidas++;
                }
            }

            if (bloqueadas.length > 0 && excluidas === 0) {
                return res.send({
                    ok: false,
                    msg: `Não é possível excluir: a marca possui produtos vinculados: ${bloqueadas.join(", ")}. Remova ou altere a marca desses produtos primeiro.`
                });
            }

            if (bloqueadas.length > 0 && excluidas > 0) {
                return res.send({
                    ok: true,
                    msg: `${excluidas} marca(s) excluída(s), mas não foi possível excluir: ${bloqueadas.join(", ")} pois possuem produtos vinculados.`
                });
            }

            if (excluidas > 0) {
                return res.send({
                    ok: true,
                    msg: excluidas > 1 ? "Marcas excluídas com sucesso!" : "Marca excluída com sucesso!"
                });
            } else {
                return res.send({
                    ok: false,
                    msg: "Erro ao excluir a marca."
                });
            }
        } catch (e) {
            console.log(e);
            res.send({
                ok: false,
                msg: "Não foi possível excluir a marca pois ela possui vínculos no sistema."
            });
        }
    }
}

module.exports = marcasController;