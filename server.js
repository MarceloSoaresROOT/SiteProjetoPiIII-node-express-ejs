const express = require("express");
const path = require("path");
const server = express();

// Configurações do EJS
server.set("view engine", "ejs");
server.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos (css, js, imagens)
server.use(express.static(path.join(__dirname, 'public')));

// Lê JSON enviado pelo front-end (fetch)
server.use(express.json());

// Rotas
server.use("/api", require("./routes/apirouter"));
server.use("/", require("./routes/hortifrutirouter"));

// Tratamento de erros (ex.: banco fora do ar)
server.use((err, req, res, next) => {
    console.error(err);
    if (req.path.startsWith('/api')) {
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
    res.status(500).send('Erro interno do servidor. Verifique se o MySQL está ligado e a senha em db/config.js está correta.');
});

const { iniciarBanco, mensagemErro } = require("./db/init");
const porta = process.env.PORT || 5000;

// Cria o banco/tabelas automaticamente (se precisar) e só então liga o site
iniciarBanco()
    .then(() => {
        server.listen(porta, () => {
            console.log("Banco de dados conectado.");
            console.log("Servidor rodando! Acesse: http://localhost:" + porta + "/index");
        });
    })
    .catch((e) => {
        console.error("\n" + mensagemErro(e) + "\n");
        process.exit(1);
    });
