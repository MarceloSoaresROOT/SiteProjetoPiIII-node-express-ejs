-- Schema do banco GreenGo (MySQL 5.7+ / 8 / MariaDB)
CREATE DATABASE IF NOT EXISTS greengo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE greengo;

CREATE TABLE IF NOT EXISTS fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  razao_social VARCHAR(150) NOT NULL,
  nome_fantasia VARCHAR(150) NOT NULL,
  cnpj CHAR(14) NOT NULL UNIQUE,
  inscricao_estadual VARCHAR(15),
  data_cadastro DATE NOT NULL,
  responsavel VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  celular VARCHAR(15),
  site VARCHAR(200),
  cep CHAR(8) NOT NULL,
  logradouro VARCHAR(150) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado CHAR(2) NOT NULL,
  complemento VARCHAR(100),
  categoria_principal VARCHAR(30) NOT NULL,
  valor_minimo DECIMAL(10,2) NOT NULL,
  prazo_entrega TINYINT NOT NULL,
  tipo_entrega VARCHAR(30) NOT NULL,
  produtos_fornecidos VARCHAR(100) NOT NULL,
  observacoes VARCHAR(300),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  data_nascimento DATE NULL,
  celular VARCHAR(15),
  telefone VARCHAR(15),
  email VARCHAR(120) NOT NULL UNIQUE,
  cep CHAR(8) NULL,
  rua VARCHAR(150) NULL,
  numero VARCHAR(10) NULL,
  bairro VARCHAR(100) NULL,
  cidade VARCHAR(100) NULL,
  estado CHAR(2) NULL,
  complemento VARCHAR(100),
  preferencia_entrega VARCHAR(30),
  pagamento_preferido VARCHAR(20),
  interesses VARCHAR(100),
  observacoes VARCHAR(250),
  senha_hash VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria ENUM('Frutas','Legumes','Verduras') NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  unidade VARCHAR(10) NOT NULL DEFAULT 'kg',
  estoque INT NOT NULL DEFAULT 0,
  descricao VARCHAR(255),
  imagem VARCHAR(100),
  fornecedor_id INT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_prod_forn FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NULL,
  nome VARCHAR(120) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  cep CHAR(8) NOT NULL,
  rua VARCHAR(150) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  uf CHAR(2) NOT NULL,
  observacao VARCHAR(300),
  pagamento VARCHAR(20) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Recebido',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ped_cli FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NULL,
  nome_produto VARCHAR(100) NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  quantidade INT NOT NULL,
  CONSTRAINT fk_item_ped FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_prod FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
) ENGINE=InnoDB;
