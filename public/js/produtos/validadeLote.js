// =====================================================================
// Regra da validade do lote (usada no cadastro e na alteração):
//  - mais de 7 dias antes de hoje  -> bloqueia
//  - de 1 a 7 dias antes de hoje   -> só avisa (data retroativa)
//  - hoje ou depois                -> normal
// O servidor confere a mesma regra antes de gravar.
// =====================================================================

const DIAS_RETROATIVOS_PERMITIDOS = 7;

// Quantos dias a data (formato aaaa-mm-dd) está ANTES de hoje (negativo = no futuro)
function diasAntesDeHoje(dataISO) {
    if (!dataISO) return null;
    let partes = dataISO.split("-");
    let data = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.round((hoje - data) / 86400000);
}

// Analisa a validade e devolve { situacao: "vazia" | "ok" | "retroativa" | "bloqueada", msg }
function analisarValidade(dataISO) {
    let dias = diasAntesDeHoje(dataISO);

    if (dias === null) {
        return { situacao: "vazia", msg: "" };
    }
    if (dias > DIAS_RETROATIVOS_PERMITIDOS) {
        return { situacao: "bloqueada", msg: "A validade não pode ser anterior a " + DIAS_RETROATIVOS_PERMITIDOS + " dias da data de hoje." };
    }
    if (dias >= 1) {
        return { situacao: "retroativa", msg: "Atenção: a validade informada é retroativa (" + dias + " dia(s) antes de hoje)." };
    }
    return { situacao: "ok", msg: "" };
}

// Mostra o aviso embaixo do campo de validade
function mostrarAvisoValidade(elementoAviso, analise) {
    if (!elementoAviso) return;
    if (analise.situacao == "bloqueada") {
        elementoAviso.className = "form-text text-danger fw-semibold";
        elementoAviso.innerHTML = '<i class="bi bi-x-octagon me-1"></i>' + analise.msg;
    } else if (analise.situacao == "retroativa") {
        elementoAviso.className = "form-text text-warning-emphasis fw-semibold";
        elementoAviso.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i>' + analise.msg;
    } else {
        elementoAviso.className = "form-text";
        elementoAviso.innerHTML = "";
    }
}