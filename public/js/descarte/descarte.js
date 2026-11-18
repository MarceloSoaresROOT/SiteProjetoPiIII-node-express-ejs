document.addEventListener("DOMContentLoaded", function () {

    let corpo = document.querySelector("#corpoItens");
    let modelo = document.querySelector("#modeloItem");
    let mensagem = document.querySelector("#mensagemDevolucao");
    let botaoRegistrar = document.querySelector("#btnRegistrarDevolucao");

    document.querySelector("#btnAdicionarItem").addEventListener("click", adicionarItem);
    botaoRegistrar.addEventListener("click", registrar);

    // mensagem de sucesso guardada antes de a página recarregar (some em 4 segundos)
    mostrarMensagemGuardada(mensagem);

    // a tela já começa com uma linha
    adicionarItem();

    // O motivo determina o destino
    function destinoDoMotivo(motivo) {
        if (motivo == "OUTRO") return "DEVOLUCAO";
        if (motivo == "VENCIDO" || motivo == "IMPROPRIO") return "DESCARTE";
        return null;
    }

    function nomeDestino(destino) {
        return destino == "DEVOLUCAO" ? "Devolução" : "Descarte";
    }

    // Cria uma nova linha de item copiando o <template> da página
    function adicionarItem() {
        let linha = modelo.content.firstElementChild.cloneNode(true);

        linha.querySelector(".item-lote").addEventListener("change", function () { trocarLote(linha); });
        linha.querySelector(".item-motivo").addEventListener("change", function () { trocarMotivo(linha); });
        linha.querySelector(".btn-remover-item").addEventListener("click", function () { removerItem(linha); });

        corpo.appendChild(linha);
        atualizarLinha(linha);
    }

    function removerItem(linha) {
        if (corpo.querySelectorAll(".item-devolucao").length == 1) {
            exibirMensagem(mensagem, "A devolução precisa ter pelo menos um item.", "warning");
            return;
        }
        linha.remove();
    }

    // Outra linha com o MESMO lote e o MESMO destino? (o mesmo lote só pode ir uma vez para cada destino)
    function temConflito(linhaAtual) {
        let idLote = linhaAtual.querySelector(".item-lote").value;
        let destino = destinoDoMotivo(linhaAtual.querySelector(".item-motivo").value);
        if (idLote == "0" || destino == null) return false;

        let linhas = corpo.querySelectorAll(".item-devolucao");
        for (let i = 0; i < linhas.length; i++) {
            if (linhas[i] == linhaAtual) continue;
            let outroLote = linhas[i].querySelector(".item-lote").value;
            let outroDestino = destinoDoMotivo(linhas[i].querySelector(".item-motivo").value);
            if (outroLote == idLote && outroDestino == destino) return true;
        }
        return false;
    }

    // Quando o funcionário escolhe um lote
    function trocarLote(linha) {
        let selectLote = linha.querySelector(".item-lote");
        let selectMotivo = linha.querySelector(".item-motivo");

        let opcao = selectLote.options[selectLote.selectedIndex];
        let vencido = opcao.dataset.vencido == "1";

        // lote vencido: o motivo vira "Vencido" (destino Descarte); pode trocar para "Impróprio"
        if (vencido && selectMotivo.value != "IMPROPRIO") {
            selectMotivo.value = "VENCIDO";
        }
        // lote na validade: "Vencido" não vale
        if (!vencido && selectMotivo.value == "VENCIDO") {
            selectMotivo.value = "";
        }

        if (temConflito(linha)) {
            exibirMensagem(mensagem, "Esse lote já está em outro item com destino " + nomeDestino(destinoDoMotivo(selectMotivo.value)) + ". Junte as quantidades em uma linha só.", "danger");
            selectLote.value = "0";
        }

        atualizarLinha(linha);
    }

    // Quando o funcionário escolhe o motivo
    function trocarMotivo(linha) {
        let selectMotivo = linha.querySelector(".item-motivo");

        if (temConflito(linha)) {
            exibirMensagem(mensagem, "Esse lote já está em outro item com destino " + nomeDestino(destinoDoMotivo(selectMotivo.value)) + ". Junte as quantidades em uma linha só.", "danger");
            selectMotivo.value = "";
        }

        atualizarLinha(linha);
    }

    // Atualiza motivos permitidos, aviso, limite, observação e destino da linha
    function atualizarLinha(linha) {
        let selectLote = linha.querySelector(".item-lote");
        let selectMotivo = linha.querySelector(".item-motivo");
        let campoQtd = linha.querySelector(".item-qtd");
        let campoObs = linha.querySelector(".item-obs");
        let aviso = linha.querySelector(".item-aviso");
        let limite = linha.querySelector(".item-limite");

        let opcao = selectLote.options[selectLote.selectedIndex];
        let temLote = selectLote.value != "0";
        let vencido = temLote && opcao.dataset.vencido == "1";
        let motivo = selectMotivo.value;

        // motivos permitidos conforme a validade do lote
        selectMotivo.querySelector('option[value="VENCIDO"]').disabled = temLote && !vencido;
        selectMotivo.querySelector('option[value="OUTRO"]').disabled = vencido;

        // aviso de lote vencido
        if (vencido) {
            aviso.className = "small mt-1 item-aviso text-danger";
            aviso.innerHTML = '<i class="bi bi-exclamation-octagon me-1"></i>Lote vencido: vai para descarte. Para devolver ao estoque, troque o lote.';
        } else {
            aviso.className = "small mt-1 item-aviso";
            aviso.innerHTML = "";
        }

        // limite da quantidade: a soma das linhas do lote não pode passar do cadastrado
        if (temLote) {
            campoQtd.max = opcao.dataset.inicial;
            limite.textContent = "Máx.: " + opcao.dataset.inicial + " (cadastrado no lote)";
        } else {
            campoQtd.removeAttribute("max");
            limite.textContent = "";
        }

        // observação obrigatória nos motivos "Outro" e "Impróprio para consumo"
        campoObs.placeholder = (motivo == "OUTRO" || motivo == "IMPROPRIO") ? "Obrigatória" : "Opcional";

        // destino: os dois indicadores ficam na tela; o do motivo escolhido fica verde
        let destino = destinoDoMotivo(motivo);
        let indicadores = linha.querySelectorAll(".destino-ind");
        for (let i = 0; i < indicadores.length; i++) {
            indicadores[i].classList.toggle("ativo", indicadores[i].dataset.destino == destino);
        }
    }

    // Confere a tela e envia a devolução para o servidor
    function registrar() {
        let linhas = corpo.querySelectorAll(".item-devolucao");
        let itens = [];
        let usados = [];        // "idLote|destino"
        let somaPorLote = {};   // idLote -> { numero, inicial, total }

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let n = "Item " + (i + 1) + ": ";
            let selectLote = linha.querySelector(".item-lote");
            let opcao = selectLote.options[selectLote.selectedIndex];

            let item = {
                idLote: selectLote.value,
                quantidade: linha.querySelector(".item-qtd").value,
                motivo: linha.querySelector(".item-motivo").value,
                observacao: linha.querySelector(".item-obs").value.trim()
            };
            let qtd = Number(item.quantidade);

            if (item.idLote == "0") { exibirMensagem(mensagem, n + "selecione o produto/lote.", "danger"); return; }
            if (!Number.isInteger(qtd) || qtd <= 0) { exibirMensagem(mensagem, n + "informe uma quantidade inteira maior que zero.", "danger"); return; }
            if (item.motivo == "") { exibirMensagem(mensagem, n + "selecione o motivo.", "danger"); return; }
            if ((item.motivo == "OUTRO" || item.motivo == "IMPROPRIO") && item.observacao == "") {
                let nomeMotivo = item.motivo == "OUTRO" ? "Outro" : "Impróprio para consumo";
                exibirMensagem(mensagem, n + "a observação é obrigatória quando o motivo é \"" + nomeMotivo + "\".", "danger");
                return;
            }

            // o mesmo lote só pode aparecer uma vez em cada destino
            let destino = destinoDoMotivo(item.motivo);
            let chave = item.idLote + "|" + destino;
            if (usados.indexOf(chave) >= 0) {
                exibirMensagem(mensagem, n + "este lote já está em outro item com destino " + nomeDestino(destino) + ". Junte as quantidades em uma linha só.", "danger");
                return;
            }
            usados.push(chave);

            // soma por lote (Devolução + Descarte)
            if (!somaPorLote[item.idLote]) {
                somaPorLote[item.idLote] = { numero: opcao.dataset.numero, inicial: Number(opcao.dataset.inicial), total: 0 };
            }
            somaPorLote[item.idLote].total += qtd;

            itens.push(item);
        }

        // limite: a soma das linhas de cada lote não pode passar da quantidade cadastrada
        for (let id in somaPorLote) {
            let s = somaPorLote[id];
            if (s.total > s.inicial) {
                exibirMensagem(mensagem, "Lote " + s.numero + ": a soma das quantidades (" + s.total + ") passa da quantidade cadastrada do lote (" + s.inicial + ").", "danger");
                return;
            }
        }

        botaoRegistrar.disabled = true;

        fetch("/descartes/devolucao", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itens: itens })
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                // recarrega para limpar o formulário e atualizar estoque e históricos;
                // a mensagem aparece depois de recarregar e some em 4 segundos
                guardarMensagem(r.msg, "success");
                window.location.reload();
            } else {
                exibirMensagem(mensagem, r.msg, "danger");
                botaoRegistrar.disabled = false;
            }
        })
        .catch(() => {
            exibirMensagem(mensagem, "Erro de conexão com o servidor.", "danger");
            botaoRegistrar.disabled = false;
        });
    }
});