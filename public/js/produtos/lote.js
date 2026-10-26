document.addEventListener("DOMContentLoaded",function(){
console.log("entrou")

   let btnlote = document.querySelector('#btnSalvarLote');

 

   btnlote.addEventListener("click",gravar)


    function gravar()
    {
        let produto = document.querySelector('#novoProduto').value;
        let lote  = document.querySelector('#novoNumeroLote').value;
        let data = document.querySelector('#novaValidade').value;
        let qnt = document.querySelector('#novaQuantidade').value;

        
            let obj= 
            {
            produto: produto,
            lote: lote,
            data: data,
            qnt: qnt
            }

            
            fetch("/lotes/cadastrar", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r=> {
                return r.json();

            })
            .then(r=> {
                
                if(r.ok) {
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
    



