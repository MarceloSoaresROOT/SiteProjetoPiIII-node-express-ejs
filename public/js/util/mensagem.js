// =====================================================================
// Mensagens da tela (sucesso, erro, aviso) que somem sozinhas.
// Usado nas telas de lotes e de devoluções/descartes.
// =====================================================================

const TEMPO_MENSAGEM = 4000; // 4 segundos

// Mostra a mensagem no elemento (uma <div class="alert ...">) e esconde depois de 4 segundos.
// tipo: "success" (verde), "danger" (vermelho), "warning" (amarelo)
function exibirMensagem(elemento, texto, tipo) {
    if (!elemento) return;

    // guarda as classes "de layout" do elemento (margens etc.) para não perdê-las
    if (elemento.dataset.classeBase == undefined) {
        elemento.dataset.classeBase = elemento.className
            .replace(/\balert-(success|danger|warning|info)\b/g, "")
            .replace(/\bd-none\b/g, "")
            .replace(/\balert\b/g, "")
            .trim();
    }

    elemento.className = "alert alert-" + tipo + " " + elemento.dataset.classeBase;
    elemento.textContent = texto;

    clearTimeout(elemento._temporizador);
    elemento._temporizador = setTimeout(function () {
        elemento.classList.add("d-none");
    }, TEMPO_MENSAGEM);
}

// Guarda uma mensagem para ser mostrada DEPOIS que a página recarregar
function guardarMensagem(texto, tipo) {
    try {
        sessionStorage.setItem("greengoMensagem", JSON.stringify({ texto: texto, tipo: tipo }));
    } catch (e) { }
}

// Se houver mensagem guardada, mostra no elemento e apaga a mensagem guardada
function mostrarMensagemGuardada(elemento) {
    try {
        let salva = sessionStorage.getItem("greengoMensagem");
        if (salva) {
            sessionStorage.removeItem("greengoMensagem");
            salva = JSON.parse(salva);
            exibirMensagem(elemento, salva.texto, salva.tipo);
        }
    } catch (e) { }
}