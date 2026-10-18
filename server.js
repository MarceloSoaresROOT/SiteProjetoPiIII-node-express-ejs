const express = require("express");
const path = require("path");
const app = express();

// Configurações do EJS
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos (css, js, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Lê JSON enviado pelo front-end (fetch)
app.use(express.json());

// Rotas
// server.use("/api", require("./routes/apirouter"));
app.use("/", require("./routes/hortifrutirouter"));

// Tratamento de erros (ex.: banco fora do ar)
app.use((err, req, res, next) => {
    console.error(err);
    if (req.path.startsWith('/api')) {
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
    res.status(500).send('Erro interno do servidor. Verifique se o MySQL está ligado e a senha em db/config.js está correta.');
});

// Cria o banco/tabelas automaticamente (se precisar) e só então liga o site
const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});
