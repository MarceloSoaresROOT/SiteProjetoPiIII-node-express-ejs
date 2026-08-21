const express = require("express");
const path = require("path"); // Necessário para caminhos de pastas
const server = express();

// Configurações do EJS
server.set("view engine", "ejs");
server.set('views', path.join(__dirname, 'views')); 

// ESSENCIAL: Permite que o EJS encontre o style.css, script.js e imagens
server.use(express.static(path.join(__dirname, 'public')));

// Importar o arquivo de rotas
const hortifrutirouter = require("./routes/hortifrutirouter");

// Chamada das rotas
server.use("/", hortifrutirouter);

// Iniciando o servidor
server.listen(5000, () => {
    console.log("Servidor rodando! Acesse: http://localhost:5000/index");
});