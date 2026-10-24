document.addEventListener("DOMContentLoaded",function(){
   
   
   let btnloteAlterar = document.querySelector("#btnSalvarAlteracao")
    btnloteAlterar.addEventListener("click",alterar)
 function alterar(){
        let id = document.querySelector('#idEdicao').value;
        let produto = document.querySelector('#novoProduto').value;
        let lote  = document.querySelector('#novoNumeroLote').value;
        let data = document.querySelector('#novaValidade').value;
        let qnt = document.querySelector('#novaQuantidade').value;

         let obj= 
            {
            id: id,
            produto: produto,
            lote: lote,
            data: data,
            qnt: qnt
            }

            
            fetch("/lotes/alterar", {
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
        console.log(r.ok);
        window.location.href = "/lotes";
    } else {
        console.log(r.ok);
        alert(r.msg);
    }
})
.catch(erro => {
    console.error("Erro na requisição:", erro);
    alert("Ocorreu um erro ao processar a solicitação.");
});
        


    }
})