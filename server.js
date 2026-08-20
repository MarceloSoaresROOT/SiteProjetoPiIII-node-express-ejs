const express = require("express");
const server = express();

// Configurações do EJS
server.set("view engine", "ejs");
// server.set('views', './views'); // (opcional, dependendo da sua estrutura)

// 1. IMPORTANTE: Importar o arquivo de rotas que você criou
const hortifrutirouter = require("./routes/hortifrutirouter");

// 2. Chamada das nossas rotas que estão no arquivo hortifrutirouter.ejs
server.use("/", hortifrutirouter);

// Iniciando o servidor
server.listen(5000, () => {
    console.log("Servidor rodando! Acesse: http://localhost:5000/index");
});