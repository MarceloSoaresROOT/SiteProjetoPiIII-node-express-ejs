// controllers/apicontroller.js - endpoints JSON usados pelo front-end
const bcrypt = require('bcryptjs');
const pool = require('../db/db');

const CATEGORIAS = ['Frutas', 'Legumes', 'Verduras'];
const PAGAMENTOS = ['Pix', 'Cartão', 'Dinheiro'];

function digitos(valor) { return String(valor == null ? '' : valor).replace(/\D/g, ''); }
function texto(valor) { return String(valor == null ? '' : valor).trim(); }
function dataValida(valor) { return /^\d{4}-\d{2}-\d{2}$/.test(valor) && !isNaN(new Date(valor + 'T00:00:00')); }

function mensagemRepetido(porCpf) {
    return porCpf
        ? 'Este CPF já está sendo utilizado em outro cadastro.'
        : 'Este e-mail já está sendo utilizado em outro cadastro.';
}

class ApiController {

    // ---------- PRODUTOS ----------
    async listarProdutos(req, res) {
        const [linhas] = await pool.query(
            `SELECT p.id, p.nome, p.categoria, p.preco, p.unidade, p.estoque, p.fornecedor_id,
                    COALESCE(f.nome_fantasia, '—') AS fornecedor
               FROM produtos p LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
              WHERE p.ativo = 1 ORDER BY p.id`
        );
        res.json(linhas);
    }

    async criarProduto(req, res) {
        const nome = texto(req.body.nome);
        const categoria = texto(req.body.categoria);
        const preco = Number(req.body.preco);
        const estoque = Number(req.body.estoque);
        const unidade = texto(req.body.unidade) || 'kg';
        const fornecedorId = Number(req.body.fornecedor_id);

        if (nome.length < 2 || nome.length > 100) return res.status(400).json({ erro: 'Informe o nome do produto.' });
        if (CATEGORIAS.indexOf(categoria) === -1) return res.status(400).json({ erro: 'Categoria inválida.' });
        if (!(preco > 0)) return res.status(400).json({ erro: 'Preço inválido.' });
        if (!Number.isInteger(estoque) || estoque < 0) return res.status(400).json({ erro: 'Estoque inválido.' });
        if (!Number.isInteger(fornecedorId) || fornecedorId <= 0) return res.status(400).json({ erro: 'Selecione o fornecedor.' });

        const [forn] = await pool.query('SELECT id FROM fornecedores WHERE id = ?', [fornecedorId]);
        if (forn.length == 0) return res.status(400).json({ erro: 'Fornecedor não encontrado.' });

        const [r] = await pool.query(
            'INSERT INTO produtos (nome, categoria, preco, unidade, estoque, fornecedor_id) VALUES (?,?,?,?,?,?)',
            [nome, categoria, preco.toFixed(2), unidade.slice(0, 10), estoque, fornecedorId]
        );
        res.status(201).json({ id: r.insertId });
    }

    async excluirProdutos(req, res) {
        const ids = (Array.isArray(req.body.ids) ? req.body.ids : []).map(Number).filter(Number.isInteger);
        if (ids.length == 0) return res.status(400).json({ erro: 'Nenhum produto informado.' });
        // pedidos antigos continuam com nome e preço gravados em pedido_itens
        const [r] = await pool.query('DELETE FROM produtos WHERE id IN (?)', [ids]);
        res.json({ removidos: r.affectedRows });
    }

    // ---------- FORNECEDORES ----------
    async listarFornecedores(req, res) {
        const [linhas] = await pool.query('SELECT id, nome_fantasia FROM fornecedores ORDER BY nome_fantasia');
        res.json(linhas);
    }

    async criarFornecedor(req, res) {
        const b = req.body;
        const f = {
            razao_social: texto(b.razaoSocial), nome_fantasia: texto(b.nomeFantasia), cnpj: digitos(b.cnpj),
            inscricao_estadual: digitos(b.inscricaoEstadual) || null, data_cadastro: texto(b.dataCadastro),
            responsavel: texto(b.responsavel), email: texto(b.email), telefone: digitos(b.telefone),
            celular: digitos(b.celular) || null, site: texto(b.site) || null, cep: digitos(b.cep),
            logradouro: texto(b.logradouro), numero: texto(b.numero), bairro: texto(b.bairro),
            cidade: texto(b.cidade), estado: texto(b.estado).toUpperCase(), complemento: texto(b.complemento) || null,
            categoria_principal: texto(b.categoriaPrincipal), valor_minimo: Number(b.valorMinimo),
            prazo_entrega: Number(b.prazoEntrega), tipo_entrega: texto(b.tipoEntrega),
            produtos_fornecidos: (Array.isArray(b.produtosFornecidos) ? b.produtosFornecidos : []).map(texto).join(','),
            observacoes: texto(b.observacoes) || null
        };

        if (f.razao_social.length < 3 || f.nome_fantasia.length < 3 || f.responsavel.length < 3)
            return res.status(400).json({ erro: 'Preencha razão social, nome fantasia e responsável.' });
        if (f.cnpj.length != 14) return res.status(400).json({ erro: 'CNPJ inválido.' });
        if (!dataValida(f.data_cadastro)) return res.status(400).json({ erro: 'Data de cadastro inválida.' });
        if (f.email.indexOf('@') < 1) return res.status(400).json({ erro: 'E-mail inválido.' });
        if (f.telefone.length < 10 || f.telefone.length > 11) return res.status(400).json({ erro: 'Telefone inválido.' });
        if (f.cep.length != 8 || f.estado.length != 2) return res.status(400).json({ erro: 'Endereço inválido.' });
        if (!f.logradouro || !f.numero || !f.bairro || !f.cidade) return res.status(400).json({ erro: 'Preencha o endereço.' });
        if (!(f.valor_minimo > 0) || !(f.prazo_entrega > 0)) return res.status(400).json({ erro: 'Valor mínimo ou prazo inválido.' });
        if (!f.categoria_principal || !f.tipo_entrega || !f.produtos_fornecidos)
            return res.status(400).json({ erro: 'Preencha categoria, entrega e produtos fornecidos.' });

        const colunas = Object.keys(f);
        try {
            const [r] = await pool.query(
                'INSERT INTO fornecedores (' + colunas.join(',') + ') VALUES (' + colunas.map(() => '?').join(',') + ')',
                colunas.map((c) => f[c])
            );
            res.status(201).json({ id: r.insertId });
        } catch (e) {
            if (e.code == 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Este CNPJ já está sendo utilizado em outro cadastro.' });
            throw e;
        }
    }

    // ---------- CLIENTES ----------
    // Serve para o cadastro completo e para o "Criar conta" rápido da home (campos opcionais).
    async criarCliente(req, res) {
        const b = req.body;
        const c = {
            nome: texto(b.nome), cpf: digitos(b.cpf), data_nascimento: texto(b.dataNascimento) || null,
            celular: digitos(b.celular) || null, telefone: digitos(b.telefone) || null, email: texto(b.email).toLowerCase(),
            cep: digitos(b.cep) || null, rua: texto(b.rua) || null, numero: texto(b.numero) || null,
            bairro: texto(b.bairro) || null, cidade: texto(b.cidade) || null,
            estado: texto(b.estado).toUpperCase() || null, complemento: texto(b.complemento) || null,
            preferencia_entrega: texto(b.preferenciaEntrega) || null, pagamento_preferido: texto(b.pagamentoPreferido) || null,
            interesses: (Array.isArray(b.interesses) ? b.interesses : []).map(texto).join(',') || null,
            observacoes: texto(b.observacoes) || null
        };
        const senha = String(b.senha || '');

        if (c.nome.length < 3) return res.status(400).json({ erro: 'Informe o nome completo.' });
        if (c.cpf.length != 11) return res.status(400).json({ erro: 'CPF inválido.' });
        if (c.email.indexOf('@') < 1) return res.status(400).json({ erro: 'E-mail inválido.' });
        if (senha.length < 6) return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
        if (c.data_nascimento && !dataValida(c.data_nascimento)) return res.status(400).json({ erro: 'Data de nascimento inválida.' });
        if (c.cep && c.cep.length != 8) return res.status(400).json({ erro: 'CEP inválido.' });
        if (c.estado && c.estado.length != 2) return res.status(400).json({ erro: 'UF inválida.' });

        // CPF e e-mail não podem repetir
        const [repetido] = await pool.query('SELECT cpf, email FROM clientes WHERE cpf = ? OR email = ?', [c.cpf, c.email]);
        if (repetido.length > 0) return res.status(409).json({ erro: mensagemRepetido(repetido[0].cpf == c.cpf) });

        c.senha_hash = await bcrypt.hash(senha, 10);

        const colunas = Object.keys(c);
        try {
            const [r] = await pool.query(
                'INSERT INTO clientes (' + colunas.join(',') + ') VALUES (' + colunas.map(() => '?').join(',') + ')',
                colunas.map((k) => c[k])
            );
            res.status(201).json({ id: r.insertId });
        } catch (e) {
            if (e.code == 'ER_DUP_ENTRY') {
                return res.status(409).json({ erro: mensagemRepetido(/cpf/i.test(e.sqlMessage || '')) });
            }
            throw e;
        }
    }

    async login(req, res) {
        const email = texto(req.body.email).toLowerCase();
        const senha = String(req.body.senha || '');
        const [linhas] = await pool.query(
            `SELECT id, nome, celular, telefone, cep, rua, numero, bairro, cidade, estado, senha_hash
               FROM clientes WHERE email = ?`, [email]);
        const ok = linhas.length > 0 && await bcrypt.compare(senha, linhas[0].senha_hash);
        if (!ok) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

        const u = linhas[0];
        // devolve os dados para preencher a entrega automaticamente (nunca a senha)
        res.json({ id: u.id, nome: u.nome, telefone: u.celular || u.telefone || '', cep: u.cep || '',
                   rua: u.rua || '', numero: u.numero || '', bairro: u.bairro || '', cidade: u.cidade || '', uf: u.estado || '' });
    }

    // ---------- PEDIDOS ----------
    // Preço e estoque são sempre lidos do banco; o navegador só diz "nome + quantidade".
    async criarPedido(req, res) {
        const b = req.body;
        const p = {
            nome: texto(b.nome), telefone: digitos(b.telefone), cep: digitos(b.cep), rua: texto(b.rua),
            numero: texto(b.numero), bairro: texto(b.bairro), cidade: texto(b.cidade),
            uf: texto(b.uf).toUpperCase(), observacao: texto(b.observacao).slice(0, 300) || null,
            pagamento: texto(b.pagamento)
        };
        if (p.nome.length < 3 || p.telefone.length < 10 || p.cep.length != 8 || !p.rua || !p.numero ||
            !p.bairro || !p.cidade || p.uf.length != 2)
            return res.status(400).json({ erro: 'Preencha corretamente os dados de entrega.' });
        if (PAGAMENTOS.indexOf(p.pagamento) === -1) return res.status(400).json({ erro: 'Forma de pagamento inválida.' });

        // junta itens repetidos
        const quantidades = {};
        (Array.isArray(b.itens) ? b.itens : []).forEach((i) => {
            const q = Number(i.quantidade);
            if (Number.isInteger(q) && q > 0 && q <= 999) quantidades[texto(i.nome)] = (quantidades[texto(i.nome)] || 0) + q;
        });
        const nomes = Object.keys(quantidades);
        if (nomes.length == 0) return res.status(400).json({ erro: 'O carrinho está vazio.' });

        // se o cliente estiver logado, o pedido fica ligado ao cadastro dele
        let clienteId = null;
        if (Number.isInteger(Number(b.clienteId)) && Number(b.clienteId) > 0) {
            const [cli] = await pool.query('SELECT id FROM clientes WHERE id = ?', [Number(b.clienteId)]);
            if (cli.length > 0) clienteId = cli[0].id;
        }

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            let total = 0;
            const itens = [];

            for (const nome of nomes) {
                const [achou] = await conn.query(
                    'SELECT id, nome, preco, estoque FROM produtos WHERE nome = ? AND ativo = 1 FOR UPDATE', [nome]);
                if (achou.length == 0) { await conn.rollback(); return res.status(400).json({ erro: 'Produto indisponível: ' + nome }); }
                const prod = achou[0];
                if (prod.estoque < quantidades[nome]) {
                    await conn.rollback();
                    return res.status(409).json({ erro: 'Estoque insuficiente de ' + prod.nome + ' (restam ' + prod.estoque + ').' });
                }
                total += prod.preco * quantidades[nome];
                itens.push({ prod, quantidade: quantidades[nome] });
            }

            const [ped] = await conn.query(
                `INSERT INTO pedidos (cliente_id, nome, telefone, cep, rua, numero, bairro, cidade, uf, observacao, pagamento, total)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [clienteId, p.nome, p.telefone, p.cep, p.rua, p.numero, p.bairro, p.cidade, p.uf, p.observacao, p.pagamento, total.toFixed(2)]
            );
            for (const it of itens) {
                await conn.query(
                    'INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, preco_unitario, quantidade) VALUES (?,?,?,?,?)',
                    [ped.insertId, it.prod.id, it.prod.nome, it.prod.preco, it.quantidade]);
                await conn.query('UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?', [it.quantidade, it.prod.id, it.quantidade]);
            }
            await conn.commit();
            res.status(201).json({ id: ped.insertId, total: Number(total.toFixed(2)) });
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }
    }
}

module.exports = ApiController;
