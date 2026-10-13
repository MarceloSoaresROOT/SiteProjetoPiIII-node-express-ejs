// Cria o banco, as tabelas e os produtos iniciais (só se ainda não existirem).
// É chamado sozinho ao iniciar o servidor; também funciona com: npm run db:init
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config');
const semear = require('./seed');

async function iniciarBanco() {
  const conn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8').replace(/greengo/g, config.database);
    await conn.query(sql);
    await conn.changeUser({ database: config.database });
    return await semear(conn);
  } finally {
    await conn.end();
  }
}

function mensagemErro(e) {
  let dica = e.message;
  if (e.code == 'ECONNREFUSED') dica = 'O MySQL parece estar desligado. Ligue o servidor MySQL (ou o XAMPP) e tente de novo.';
  if (e.code == 'ER_ACCESS_DENIED_ERROR') dica = 'Usuário ou senha incorretos. Ajuste "user" e "password" em db/config.js.';
  return 'Não foi possível conectar ao MySQL (' + config.user + '@' + config.host + ':' + config.port + ').\n' + dica;
}

module.exports = { iniciarBanco, mensagemErro };

if (require.main === module) {
  iniciarBanco()
    .then((criou) => console.log('Banco "' + config.database + '" pronto.' + (criou ? ' Produtos iniciais inseridos.' : '')))
    .catch((e) => { console.error(mensagemErro(e)); process.exit(1); });
}
