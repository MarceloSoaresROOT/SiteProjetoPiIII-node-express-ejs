document.addEventListener("DOMContentLoaded", function () {

    var modalAdicionarEl = document.getElementById("modalAdicionar");
    var modalExcluirEl = document.getElementById("modalExcluir");

    var inputIdEdicao = document.getElementById("idEdicao");
    var inputNome = document.getElementById("novoNome");
    var feedbackNome = document.getElementById("feedbackNomeMarca");
    var erroModal = document.getElementById("erroAdicionarMarca");

    var textoTituloModal = document.getElementById("textoTituloModal");
    var iconeModalMarca = document.getElementById("iconeModalMarca");
    var textoBtnSalvar = document.getElementById("textoBtnSalvar");
    var btnSalvarMarca = document.getElementById("btnSalvarMarca");
    var btnAdicionar = document.getElementById("btnAdicionar");

    var buscaMarca = document.getElementById("buscaMarca");
    var filtroVinculo = document.getElementById("filtroVinculoMarca");
    var cardsFiltro = document.querySelectorAll(".card-filtro-marca");

    var marcarTodos = document.getElementById("marcarTodos");
    var btnExcluirSelecionados = document.getElementById("btnExcluirSelecionados");
    var qtdSelecionados = document.getElementById("qtdSelecionados");
    var textoModalExcluir = document.getElementById("textoModalExcluir");
    var btnConfirmarExclusao = document.getElementById("confirmarExclusao");
    var mensagemGestao = document.getElementById("mensagemGestao");

    var idsParaExcluir = [];

    // 6 - Controle de permissões de acesso no front-end
    function obterPerfilUsuario() {
        try {
            var usuario = JSON.parse(localStorage.getItem("greengoCliente"));
            if (usuario && usuario.perfil) return String(usuario.perfil).toUpperCase();
            if (usuario && usuario.cargo) return "FUNCIONARIO";
            if (usuario && usuario.cpf && !usuario.cargo) return "CLIENTE";
        } catch (e) {}
        return "FUNCIONARIO";
    }

    function aplicarPermissoesTela() {
        var perfil = obterPerfilUsuario();
        if (perfil === "CLIENTE" || perfil === "SOCIO") {
            if (btnAdicionar) btnAdicionar.style.display = "none";
            if (btnExcluirSelecionados) btnExcluirSelecionados.style.display = "none";
            if (marcarTodos) marcarTodos.disabled = true;

            var botoesEditar = document.querySelectorAll(".btnEditarMarca");
            var botoesExcluir = document.querySelectorAll(".btnExclusao");
            var checks = document.querySelectorAll(".chk-marca");

            for (var i = 0; i < botoesEditar.length; i++) botoesEditar[i].style.display = "none";
            for (var j = 0; j < botoesExcluir.length; j++) botoesExcluir[j].style.display = "none";
            for (var k = 0; k < checks.length; k++) checks[k].disabled = true;
        }
    }

    function exibirMensagemTela(texto, erro) {
        if (!mensagemGestao) return;
        mensagemGestao.textContent = texto;
        mensagemGestao.classList.remove("d-none", "alert-success", "alert-danger");
        mensagemGestao.classList.add(erro ? "alert-danger" : "alert-success");

        setTimeout(function () {
            mensagemGestao.classList.add("d-none");
        }, 4000);
    }

    // 5 - Validação dos campos e regras de negócio da marca
    function validarCampoNome() {
        var valor = inputNome.value.trim();
        var regexValido = /^[A-Za-zÀ-ÿ0-9\s\-&.'’]+$/;

        if (valor === "") {
            inputNome.classList.remove("is-valid");
            inputNome.classList.add("is-invalid");
            if (feedbackNome) feedbackNome.textContent = "O nome da marca é obrigatório.";
            return false;
        }

        if (valor.length < 2) {
            inputNome.classList.remove("is-valid");
            inputNome.classList.add("is-invalid");
            if (feedbackNome) feedbackNome.textContent = "O nome da marca deve ter pelo menos 2 caracteres.";
            return false;
        }

        if (valor.length > 100) {
            inputNome.classList.remove("is-valid");
            inputNome.classList.add("is-invalid");
            if (feedbackNome) feedbackNome.textContent = "O nome da marca deve ter no máximo 100 caracteres.";
            return false;
        }

        if (!regexValido.test(valor) || /^[\d\s\W]+$/.test(valor)) {
            inputNome.classList.remove("is-valid");
            inputNome.classList.add("is-invalid");
            if (feedbackNome) feedbackNome.textContent = "Informe um nome válido contendo letras (sem símbolos inválidos).";
            return false;
        }

        inputNome.classList.remove("is-invalid");
        inputNome.classList.add("is-valid");
        return true;
    }

    function limparFormularioModal() {
        inputNome.classList.remove("is-valid", "is-invalid");
        erroModal.classList.add("d-none");
        erroModal.textContent = "Preencha corretamente os campos obrigatórios.";
    }

    // Ao clicar em "Adicionar marca", prepara o modal para novo cadastro
    if (btnAdicionar) {
        btnAdicionar.addEventListener("click", function () {
            inputIdEdicao.value = "";
            inputNome.value = "";
            textoTituloModal.textContent = "Adicionar marca";
            textoBtnSalvar.textContent = "Adicionar";
            if (iconeModalMarca) {
                iconeModalMarca.className = "bi bi-plus-circle me-1";
            }
            limparFormularioModal();
        });
    }

    // 3 - Ao clicar em Editar (lápis), preenche o modal com os dados da marca
    var botoesEditar = document.querySelectorAll(".btnEditarMarca");
    for (var i = 0; i < botoesEditar.length; i++) {
        botoesEditar[i].addEventListener("click", function () {
            var id = this.getAttribute("data-id");
            var nome = this.getAttribute("data-nome");

            inputIdEdicao.value = id;
            inputNome.value = nome;
            textoTituloModal.textContent = "Editar marca";
            textoBtnSalvar.textContent = "Salvar alterações";
            if (iconeModalMarca) {
                iconeModalMarca.className = "bi bi-pencil-square me-1";
            }
            limparFormularioModal();

            var modal = bootstrap.Modal.getOrCreateInstance(modalAdicionarEl);
            modal.show();
        });
    }

    if (inputNome) {
        inputNome.addEventListener("input", function () {
            if (inputNome.classList.contains("is-invalid")) {
                validarCampoNome();
            }
            erroModal.classList.add("d-none");
        });

        inputNome.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                salvarMarca();
            }
        });
    }

    // 1 e 3 - Salvar (Cadastrar ou Editar)
    if (btnSalvarMarca) {
        btnSalvarMarca.addEventListener("click", salvarMarca);
    }

    function salvarMarca() {
        if (!validarCampoNome()) {
            erroModal.textContent = "Preencha corretamente os campos obrigatórios.";
            erroModal.classList.remove("d-none");
            return;
        }

        erroModal.classList.add("d-none");

        var idEdicao = inputIdEdicao.value.trim();
        var editando = idEdicao !== "" && Number(idEdicao) > 0;
        var url = editando ? "/marcas/alterar" : "/marcas/cadastrar";

        var obj = {
            id_marca: editando ? Number(idEdicao) : 0,
            nome: inputNome.value.trim()
        };

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-perfil": obterPerfilUsuario()
            },
            body: JSON.stringify(obj)
        })
        .then(function (r) {
            return r.json();
        })
        .then(function (r) {
            if (r.ok) {
                window.location.reload();
            } else {
                inputNome.classList.remove("is-valid");
                inputNome.classList.add("is-invalid");
                if (feedbackNome && r.msg) feedbackNome.textContent = r.msg;
                erroModal.textContent = r.msg || "Erro ao salvar marca!";
                erroModal.classList.remove("d-none");
            }
        })
        .catch(function (e) {
            console.error(e);
            erroModal.textContent = "Erro de comunicação com o servidor.";
            erroModal.classList.remove("d-none");
        });
    }

    // 2 - Busca e filtros básicos na tabela
    function filtrarTabela() {
        var termo = buscaMarca ? buscaMarca.value.toLowerCase().trim() : "";
        var filtro = filtroVinculo ? filtroVinculo.value : "todos";
        var linhas = document.querySelectorAll("#corpoTabelaMarcas .linha-marca");
        var visiveis = 0;

        for (var i = 0; i < linhas.length; i++) {
            var linha = linhas[i];
            var nomeMarca = (linha.getAttribute("data-nome") || "").toLowerCase();
            var idMarca = String(linha.getAttribute("data-id") || "");
            var qtdProd = Number(linha.getAttribute("data-produtos") || 0);

            var bateBusca = termo === "" || nomeMarca.indexOf(termo) >= 0 || idMarca.indexOf(termo) >= 0;
            var bateFiltro = true;

            if (filtro === "com_produtos") {
                bateFiltro = qtdProd > 0;
            } else if (filtro === "sem_produtos") {
                bateFiltro = qtdProd === 0;
            }

            if (bateBusca && bateFiltro) {
                linha.style.display = "";
                visiveis++;
            } else {
                linha.style.display = "none";
                var chk = linha.querySelector(".chk-marca");
                if (chk) chk.checked = false;
            }
        }

        var avisoVazio = document.getElementById("linhaSemResultadosBusca");
        if (visiveis === 0 && linhas.length > 0) {
            if (!avisoVazio) {
                var tr = document.createElement("tr");
                tr.id = "linhaSemResultadosBusca";
                tr.innerHTML = '<td colspan="5" class="text-center text-muted py-4">Nenhuma marca encontrada para o filtro informado.</td>';
                document.getElementById("corpoTabelaMarcas").appendChild(tr);
            }
        } else if (avisoVazio) {
            avisoVazio.remove();
        }

        atualizarContadorSelecionados();
    }

    if (buscaMarca) {
        buscaMarca.addEventListener("input", filtrarTabela);
    }

    if (filtroVinculo) {
        filtroVinculo.addEventListener("change", function () {
            for (var i = 0; i < cardsFiltro.length; i++) {
                cardsFiltro[i].classList.toggle("ativo", cardsFiltro[i].getAttribute("data-filtro") === filtroVinculo.value);
            }
            filtrarTabela();
        });
    }

    for (var c = 0; c < cardsFiltro.length; c++) {
        cardsFiltro[c].addEventListener("click", function () {
            var f = this.getAttribute("data-filtro");
            if (filtroVinculo) {
                filtroVinculo.value = f;
                filtroVinculo.dispatchEvent(new Event("change"));
            }
        });
    }

    // Seleção de checkboxes para exclusão em lote
    function atualizarContadorSelecionados() {
        var checks = document.querySelectorAll(".chk-marca:checked");
        var totalChecksVisiveis = document.querySelectorAll("#corpoTabelaMarcas .linha-marca:not([style*='display: none']) .chk-marca");

        if (qtdSelecionados) qtdSelecionados.textContent = checks.length;
        if (btnExcluirSelecionados) btnExcluirSelecionados.disabled = checks.length === 0;

        if (marcarTodos) {
            marcarTodos.checked = totalChecksVisiveis.length > 0 && checks.length === totalChecksVisiveis.length;
        }
    }

    var checksMarca = document.querySelectorAll(".chk-marca");
    for (var k = 0; k < checksMarca.length; k++) {
        checksMarca[k].addEventListener("change", atualizarContadorSelecionados);
    }

    if (marcarTodos) {
        marcarTodos.addEventListener("change", function () {
            var checksVisiveis = document.querySelectorAll("#corpoTabelaMarcas .linha-marca:not([style*='display: none']) .chk-marca");
            for (var i = 0; i < checksVisiveis.length; i++) {
                checksVisiveis[i].checked = marcarTodos.checked;
            }
            atualizarContadorSelecionados();
        });
    }

    // 4 - Exclusão individual (botão lixeira)
    var btnsExclusao = document.querySelectorAll(".btnExclusao");
    for (var m = 0; m < btnsExclusao.length; m++) {
        btnsExclusao[m].addEventListener("click", function () {
            var id = this.getAttribute("data-codigoexclusao");
            var nome = this.getAttribute("data-nome") || "";

            if (id != null && id !== "") {
                idsParaExcluir = [Number(id)];
                if (textoModalExcluir) {
                    textoModalExcluir.textContent = 'Deseja realmente excluir a marca "' + nome + '"?';
                }
                var modal = bootstrap.Modal.getOrCreateInstance(modalExcluirEl);
                modal.show();
            }
        });
    }

    // 4 - Exclusão de múltiplos selecionados
    if (btnExcluirSelecionados) {
        btnExcluirSelecionados.addEventListener("click", function () {
            var selecionados = document.querySelectorAll(".chk-marca:checked");
            idsParaExcluir = [];

            for (var i = 0; i < selecionados.length; i++) {
                idsParaExcluir.push(Number(selecionados[i].value));
            }

            if (idsParaExcluir.length > 0) {
                if (textoModalExcluir) {
                    textoModalExcluir.textContent = "Deseja realmente excluir as " + idsParaExcluir.length + " marcas selecionadas?";
                }
                var modal = bootstrap.Modal.getOrCreateInstance(modalExcluirEl);
                modal.show();
            }
        });
    }

    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener("click", function () {
            if (idsParaExcluir.length === 0) return;

            fetch("/marcas/excluir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-perfil": obterPerfilUsuario()
                },
                body: JSON.stringify({
                    id: idsParaExcluir[0],
                    ids: idsParaExcluir
                })
            })
            .then(function (r) {
                return r.json();
            })
            .then(function (r) {
                var modal = bootstrap.Modal.getInstance(modalExcluirEl);
                if (modal) modal.hide();

                if (r.ok) {
                    if (r.msg && r.msg.indexOf("possuem produtos") >= 0) {
                        alert(r.msg);
                    }
                    window.location.reload();
                } else {
                    exibirMensagemTela(r.msg || "Erro ao excluir marca.", true);
                }
            })
            .catch(function (e) {
                console.error(e);
                exibirMensagemTela("Erro ao tentar excluir a marca.", true);
            });
        });
    }

    aplicarPermissoesTela();
});