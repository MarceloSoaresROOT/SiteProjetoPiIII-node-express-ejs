document.addEventListener("DOMContentLoaded", function() {

    let btns = document.querySelectorAll(".btnExclusao");

    for(let i = 0; i<btns.length; i++) {
        btns[i].addEventListener("click", excluir);
    }

    function excluir() {
        let id = this.dataset.codigoexclusao;

        if(id != null) {
            if(confirm("Tem certeza que deseja excluir esse Lote?")) {
                let obj = {
                    id: id
                }

                fetch('/lotes/excluir', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
                .then(r => {
                    return r.json()
                })
                .then(r=> {
                    if(r.ok) {
                        // a mensagem aparece depois de recarregar (lote.js mostra) e some em 4 segundos
                        guardarMensagem(r.msg, "success");
                        window.location.reload();
                    }
                    else{
                        alert(r.msg);
                    }
                })
                .catch(() => {
                    alert("Erro de conexão com o servidor.");
                });

            }
        }
        else{
            alert("Nenhum ID encontrado para exclusão");
        }
    }
})