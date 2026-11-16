document.addEventListener("DOMContentLoaded", function () {
    console.log("entrou")

    let btns = document.querySelectorAll('#btnSalvarPromocao');

    btns.forEach(function (btn) {
        btn.addEventListener("click", gravar)
    })

    function gravar(e) {
        // evita o envio normal do formulário
        e.preventDefault();
        
        // pega o formulário da linha onde o botão foi clicado
        let form = e.target.closest('.form-promocao');

        // mantém as validações do HTML (min, max, required)
        if (!form.reportValidity()) {
            return;
        }

        let id_lote = form.querySelector('#id_lote').value;
        let id_produto = form.querySelector('#id_produto').value;
        let descricao = form.querySelector('#descricao').value;
        let percentual = form.querySelector('#percentual_desconto').value;
        let qnt = form.querySelector('#itens_qntd').value;
        let inicio = form.querySelector('#data_inicio').value;
        let fim = form.querySelector('#data_fim').value;

        let obj =
        {
            id_lote: id_lote,
            id_produto: id_produto,
            descricao: descricao,
            percentual: percentual,
            qnt: qnt,
            inicio: inicio,
            fim: fim
        }

        fetch("/promocao/cadastrar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => {
            return r.json();
        })
        .then(r => {
            if (r.ok) {
                console.log(r.ok)
                window.location.reload();
            }
            else {
                console.log(r.ok)
                alert(r.msg);
            }
        })
    }

})
