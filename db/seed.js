// Dados iniciais (os mesmos produtos que estavam fixos no HTML e no gestao.js)
const fornecedores = [
  ['Sítio Boa Terra LTDA', 'Sítio Boa Terra', '11111111000191'],
  ['Fazenda Verde LTDA', 'Fazenda Verde', '22222222000191'],
  ['Horta Moranguinho LTDA', 'Horta Moranguinho', '33333333000191'],
  ['Agro Prudente LTDA', 'Agro Prudente', '44444444000191'],
  ['Sítio Raiz LTDA', 'Sítio Raiz', '55555555000191'],
  ['Hidroponia Sol LTDA', 'Hidroponia Sol', '66666666000191'],
  ['Horta Verde LTDA', 'Horta Verde', '77777777000191']
];

// nome, categoria, preco, unidade, estoque, descricao, imagem, fornecedor
const produtos = [
  ['Banana', 'Frutas', 4.99, 'kg', 30, 'Bananas doces e maduras, perfeitas para vitaminas e lanches.', 'banana.jpg', 'Sítio Boa Terra'],
  ['Laranja', 'Frutas', 5.20, 'kg', 30, 'Laranjas suculentas e perfeitas para sucos frescos.', 'laranja.jpg', 'Fazenda Verde'],
  ['Maçã Gala', 'Frutas', 5.99, 'kg', 25, 'Maçã Gala crocante e adocicada, ótima para saladas e sobremesas.', 'maçã.jpg', 'Fazenda Verde'],
  ['Melancia', 'Frutas', 8.90, 'un', 12, 'Melancia fresca e doce, ótima para dias quentes.', 'melancia.jpg', 'Fazenda Verde'],
  ['Morango', 'Frutas', 10.22, 'kg', 18, 'Morangos vermelhos e aromáticos, saborosos e frescos.', 'morango.jpg', 'Horta Moranguinho'],
  ['Abóbora', 'Legumes', 4.80, 'kg', 20, 'Abóbora macia e nutritiva, ótima para sopas e refogados.', 'abobora.jpg', 'Sítio Raiz'],
  ['Batata', 'Legumes', 3.50, 'kg', 50, 'Batatas firmes e versáteis, ideais para assar, fritar ou cozinhar.', 'batatas.jpg', 'Agro Prudente'],
  ['Cenoura', 'Legumes', 4.50, 'kg', 35, 'Cenouras crocantes e doces, ricas em vitamina A.', 'cenoura.jpg', 'Sítio Raiz'],
  ['Repolho', 'Legumes', 3.20, 'un', 20, 'Repolho fresco para saladas, refogados e pratos saudáveis.', 'repolho.jpg', 'Agro Prudente'],
  ['Tomate', 'Legumes', 6.99, 'kg', 40, 'Tomates maduros e suculentos, perfeitos para salada e molho.', 'tomates.jpg', 'Agro Prudente'],
  ['Acelga', 'Verduras', 3.50, 'maço', 15, 'Acelga fresca com talos crocantes, fonte de fibras.', 'acelga.jpg', 'Horta Verde'],
  ['Alface Crespa', 'Verduras', 3.99, 'un', 20, 'Alface crocante para sanduíches e saladas frescas.', 'alface.jpg', 'Hidroponia Sol'],
  ['Couve', 'Verduras', 2.99, 'maço', 20, 'Couve verde para sucos, refogados e acompanhamentos.', 'couve.jpg', 'Horta Verde'],
  ['Espinafre', 'Verduras', 4.20, 'maço', 15, 'Espinafre fresco e saudável, rico em ferro.', 'espinafre.jpg', 'Horta Verde'],
  ['Rúcula', 'Verduras', 3.80, 'maço', 15, 'Rúcula picante para dar sabor extra às suas receitas.', 'rucula.jpg', 'Horta Verde']
];

async function semear(pool) {
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM produtos');
  if (total > 0) return false;

  const ids = {};
  for (const f of fornecedores) {
    const [r] = await pool.query(
      `INSERT INTO fornecedores (razao_social, nome_fantasia, cnpj, data_cadastro, responsavel, email, telefone,
        cep, logradouro, numero, bairro, cidade, estado, categoria_principal, valor_minimo, prazo_entrega, tipo_entrega, produtos_fornecidos)
       VALUES (?, ?, ?, CURDATE(), 'A definir', 'contato@exemplo.com', '1899999999',
        '19000000', 'A definir', 'S/N', 'Centro', 'Presidente Prudente', 'SP', 'Frutas', 50, 2, 'Entrega própria', 'Frutas')`,
      f
    );
    ids[f[1]] = r.insertId;
  }
  for (const p of produtos) {
    await pool.query(
      `INSERT INTO produtos (nome, categoria, preco, unidade, estoque, descricao, imagem, fornecedor_id) VALUES (?,?,?,?,?,?,?,?)`,
      [p[0], p[1], p[2], p[3], p[4], p[5], p[6], ids[p[7]]]
    );
  }
  return true;
}

module.exports = semear;
