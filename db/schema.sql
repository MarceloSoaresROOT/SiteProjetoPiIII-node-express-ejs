-- ============================================================
-- TABELAS
-- ============================================================

CREATE TABLE tb_pessoa (
    id_pessoa   BIGINT AUTO_INCREMENT NOT NULL,
    email       VARCHAR(150) NOT NULL,
    senha       VARCHAR(255) NOT NULL,
    telefone    VARCHAR(20),
    tipo_pessoa CHAR(2) NOT NULL,
    ativo       CHAR(1) NOT NULL DEFAULT 'S',
    CONSTRAINT pk_pessoa PRIMARY KEY (id_pessoa),
    CONSTRAINT uk_pessoa_email UNIQUE (email),
    CONSTRAINT ck_pessoa_tipo CHECK (tipo_pessoa IN ('PF', 'PJ')),
    CONSTRAINT ck_pessoa_ativo CHECK (ativo IN ('N', 'S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_pessoa_fisica (
    id_pessoa       BIGINT NOT NULL,
    nome            VARCHAR(150) NOT NULL,
    cpf             VARCHAR(14) NOT NULL,
    data_nascimento DATE,
    CONSTRAINT pk_pf PRIMARY KEY (id_pessoa),
    CONSTRAINT uk_pf_cpf UNIQUE (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_pessoa_juridica (
    id_pessoa     BIGINT NOT NULL,
    razao_social  VARCHAR(180) NOT NULL,
    nome_fantasia VARCHAR(150),
    cnpj          VARCHAR(18) NOT NULL,
    CONSTRAINT pk_pj PRIMARY KEY (id_pessoa),
    CONSTRAINT uk_pj_cnpj UNIQUE (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_socio (
    id_pessoa     BIGINT NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT pk_socio PRIMARY KEY (id_pessoa),
    CONSTRAINT ck_socio_status CHECK (status IN ('ATIVO', 'BLOQUEADO', 'INATIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_fornecedor (
    id_pessoa     BIGINT NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT pk_fornecedor PRIMARY KEY (id_pessoa),
    CONSTRAINT ck_forn_status CHECK (status IN ('ATIVO', 'INATIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_funcionario (
    id_pessoa     BIGINT NOT NULL,
    matricula     VARCHAR(30) NOT NULL,
    cargo         VARCHAR(100),
    data_admissao DATE,
    CONSTRAINT pk_funcionario PRIMARY KEY (id_pessoa),
    CONSTRAINT uk_func_mat UNIQUE (matricula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_endereco (
    id_endereco BIGINT AUTO_INCREMENT NOT NULL,
    id_pessoa   BIGINT NOT NULL,
    cep         VARCHAR(9) NOT NULL,
    logradouro  VARCHAR(150) NOT NULL,
    numero      VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro      VARCHAR(100) NOT NULL,
    cidade      VARCHAR(100) NOT NULL,
    uf          CHAR(2) NOT NULL,
    principal   CHAR(1) NOT NULL DEFAULT 'N',
    CONSTRAINT pk_endereco PRIMARY KEY (id_endereco),
    CONSTRAINT ck_end_princ CHECK (principal IN ('N', 'S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_categoria (
    id_categoria BIGINT AUTO_INCREMENT NOT NULL,
    nome         VARCHAR(100) NOT NULL,
    descricao    VARCHAR(255),
    CONSTRAINT pk_categoria PRIMARY KEY (id_categoria),
    CONSTRAINT uk_cat_nome UNIQUE (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_marca (
    id_marca BIGINT AUTO_INCREMENT NOT NULL,
    nome     VARCHAR(100) NOT NULL,
    CONSTRAINT pk_marca PRIMARY KEY (id_marca),
    CONSTRAINT uk_marca_nome UNIQUE (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_produto (
    id_produto   BIGINT AUTO_INCREMENT NOT NULL,
    nome         VARCHAR(150) NOT NULL,
    descricao    VARCHAR(500),
    preco        DECIMAL(10, 2) NOT NULL,
    id_marca     BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,
    ativo        CHAR(1) NOT NULL DEFAULT 'S',
    CONSTRAINT pk_produto PRIMARY KEY (id_produto),
    CONSTRAINT ck_prod_preco CHECK (preco >= 0),
    CONSTRAINT ck_prod_ativo CHECK (ativo IN ('N', 'S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_produto_fornecedor (
    id_produto    BIGINT NOT NULL,
    id_fornecedor BIGINT NOT NULL,
    CONSTRAINT pk_prod_forn PRIMARY KEY (id_produto, id_fornecedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_lote (
    id_lote          BIGINT AUTO_INCREMENT NOT NULL,
    id_produto       BIGINT NOT NULL,
    numero_lote      VARCHAR(50) NOT NULL,
    data_validade    DATE NOT NULL,
    quantidade_atual BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT pk_lote PRIMARY KEY (id_lote),
    CONSTRAINT uk_lote UNIQUE (id_produto, numero_lote),
    CONSTRAINT ck_lote_qtd CHECK (quantidade_atual >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_plano_clube (
    id_plano      BIGINT AUTO_INCREMENT NOT NULL,
    nome          VARCHAR(100) NOT NULL,
    descricao     VARCHAR(300),
    valor         DECIMAL(10, 2) NOT NULL,
    duracao_meses SMALLINT NOT NULL,
    ativo         CHAR(1) NOT NULL DEFAULT 'S',
    CONSTRAINT pk_plano PRIMARY KEY (id_plano),
    CONSTRAINT uk_plano_nome UNIQUE (nome),
    CONSTRAINT ck_plano_valor CHECK (valor >= 0),
    CONSTRAINT ck_plano_dur CHECK (duracao_meses > 0),
    CONSTRAINT ck_plano_ativo CHECK (ativo IN ('N', 'S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_assinatura (
    id_assinatura BIGINT AUTO_INCREMENT NOT NULL,
    id_socio      BIGINT NOT NULL,
    id_plano      BIGINT NOT NULL,
    data_inicio   DATE NOT NULL DEFAULT (CURRENT_DATE),
    data_fim      DATE NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    CONSTRAINT pk_assinatura PRIMARY KEY (id_assinatura),
    CONSTRAINT ck_ass_status CHECK (status IN ('ATIVA', 'CANCELADA', 'VENCIDA')),
    CONSTRAINT ck_ass_data CHECK (data_fim >= data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_pedido (
    id_pedido   BIGINT AUTO_INCREMENT NOT NULL,
    id_socio    BIGINT NOT NULL,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status      VARCHAR(30) NOT NULL DEFAULT 'ABERTO',
    valor_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    CONSTRAINT pk_pedido PRIMARY KEY (id_pedido),
    CONSTRAINT ck_ped_status CHECK (status IN ('ABERTO', 'AGUARDANDO_PAGAMENTO', 'CANCELADO', 'DISPONIVEL_RETIRADA', 'ENVIADO',
                                               'FINALIZADO', 'PAGO', 'PREPARANDO', 'RETIRADO')),
    CONSTRAINT ck_ped_valor CHECK (valor_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_item_pedido (
    id_pedido      BIGINT NOT NULL,
    id_lote        BIGINT NOT NULL,
    quantidade     BIGINT NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT pk_item_ped PRIMARY KEY (id_pedido, id_lote),
    CONSTRAINT ck_ip_qtd CHECK (quantidade > 0),
    CONSTRAINT ck_ip_valor CHECK (valor_unitario >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_entrega (
    id_entrega      BIGINT AUTO_INCREMENT NOT NULL,
    id_pedido       BIGINT NOT NULL,
    modalidade      VARCHAR(20) NOT NULL,
    id_endereco     BIGINT,
    codigo_rastreio VARCHAR(80),
    status          VARCHAR(30) NOT NULL DEFAULT 'DEFINIDA',
    data_prevista   DATE,
    data_conclusao  DATETIME,
    CONSTRAINT pk_entrega PRIMARY KEY (id_entrega),
    CONSTRAINT uk_ent_ped UNIQUE (id_pedido),
    CONSTRAINT ck_ent_modal CHECK (modalidade IN ('DOMICILIAR', 'RETIRADA')),
    CONSTRAINT ck_ent_status CHECK (status IN ('CANCELADA', 'CONCLUIDA', 'DEFINIDA', 'DISPONIVEL_RETIRADA', 'EM_PREPARACAO',
                                               'EM_TRANSITO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_retirada (
    id_entrega          BIGINT NOT NULL,
    id_funcionario      BIGINT,
    data_disponivel     DATETIME,
    data_retirada       DATETIME,
    identidade_validada CHAR(1) NOT NULL DEFAULT 'N',
    CONSTRAINT pk_retirada PRIMARY KEY (id_entrega),
    CONSTRAINT ck_ret_valid CHECK (identidade_validada IN ('N', 'S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_recebimento (
    id_recebimento   BIGINT AUTO_INCREMENT NOT NULL,
    id_pedido        BIGINT,
    id_assinatura    BIGINT,
    data_recebimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor            DECIMAL(12, 2) NOT NULL,
    forma_pagamento  VARCHAR(30) NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT pk_recebimento PRIMARY KEY (id_recebimento),
    CONSTRAINT ck_rec_valor CHECK (valor >= 0),
    CONSTRAINT ck_rec_status CHECK (status IN ('APROVADO', 'ESTORNADO', 'PENDENTE', 'RECUSADO')),
    CONSTRAINT ck_rec_origem CHECK (((id_pedido IS NOT NULL) AND (id_assinatura IS NULL))
                                    OR ((id_assinatura IS NOT NULL) AND (id_pedido IS NULL)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_compra (
    id_compra      BIGINT AUTO_INCREMENT NOT NULL,
    id_fornecedor  BIGINT NOT NULL,
    id_funcionario BIGINT NOT NULL,
    data_compra    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_total    DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status         VARCHAR(20) NOT NULL DEFAULT 'REGISTRADA',
    CONSTRAINT pk_compra PRIMARY KEY (id_compra),
    CONSTRAINT ck_comp_valor CHECK (valor_total >= 0),
    CONSTRAINT ck_comp_status CHECK (status IN ('CANCELADA', 'REGISTRADA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_item_compra (
    id_compra      BIGINT NOT NULL,
    id_lote        BIGINT NOT NULL,
    quantidade     BIGINT NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT pk_item_comp PRIMARY KEY (id_compra, id_lote),
    CONSTRAINT ck_ic_qtd CHECK (quantidade > 0),
    CONSTRAINT ck_ic_valor CHECK (valor_unitario >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_devolucao (
    id_devolucao   BIGINT AUTO_INCREMENT NOT NULL,
    id_pedido      BIGINT NOT NULL,
    id_funcionario BIGINT NOT NULL,
    data_devolucao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo         VARCHAR(255) NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'REGISTRADA',
    CONSTRAINT pk_devolucao PRIMARY KEY (id_devolucao),
    CONSTRAINT ck_dev_status CHECK (status IN ('CANCELADA', 'CONCLUIDA', 'REGISTRADA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_item_devolucao (
    id_devolucao     BIGINT NOT NULL,
    id_lote          BIGINT NOT NULL,
    quantidade       BIGINT NOT NULL,
    condicao_produto VARCHAR(20) NOT NULL,
    destino          VARCHAR(20) NOT NULL,
    CONSTRAINT pk_item_dev PRIMARY KEY (id_devolucao, id_lote),
    CONSTRAINT ck_idev_qtd CHECK (quantidade > 0),
    CONSTRAINT ck_idev_cond CHECK (condicao_produto IN ('APTO', 'INAPTO')),
    CONSTRAINT ck_idev_dest CHECK (destino IN ('DESCARTE', 'ESTOQUE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_descarte (
    id_descarte    BIGINT AUTO_INCREMENT NOT NULL,
    id_lote        BIGINT NOT NULL,
    id_funcionario BIGINT NOT NULL,
    data_descarte  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantidade     BIGINT NOT NULL,
    motivo         VARCHAR(255) NOT NULL,
    CONSTRAINT pk_descarte PRIMARY KEY (id_descarte),
    CONSTRAINT ck_desc_qtd CHECK (quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_atualizar_estoque (
    id_movimentacao   BIGINT AUTO_INCREMENT NOT NULL,
    id_lote           BIGINT NOT NULL,
    data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_movimentacao VARCHAR(30) NOT NULL,
    quantidade        BIGINT NOT NULL,
    id_compra         BIGINT,
    id_pedido         BIGINT,
    id_devolucao      BIGINT,
    id_descarte       BIGINT,
    observacao        VARCHAR(255),
    CONSTRAINT pk_mov_estoque PRIMARY KEY (id_movimentacao),
    CONSTRAINT ck_mov_tipo CHECK (tipo_movimentacao IN ('AJUSTE_ENTRADA', 'AJUSTE_SAIDA', 'ENTRADA_COMPRA', 'ENTRADA_DEVOLUCAO',
                                                        'SAIDA_DESCARTE', 'SAIDA_PEDIDO')),
    CONSTRAINT ck_mov_qtd CHECK (quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_promocao (
    id_promocao         BIGINT AUTO_INCREMENT NOT NULL,
    descricao           VARCHAR(200),
    percentual_desconto DECIMAL(5, 2) NOT NULL,
    data_inicio         DATE NOT NULL,
    data_fim            DATE NOT NULL,
    ativa               CHAR(1) NOT NULL DEFAULT 'S',
    CONSTRAINT pk_promocao PRIMARY KEY (id_promocao),
    CONSTRAINT ck_promo_desc CHECK (percentual_desconto > 0 AND percentual_desconto <= 100),
    CONSTRAINT ck_promo_ativa CHECK (ativa IN ('N', 'S')),
    CONSTRAINT ck_promo_data CHECK (data_fim >= data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tb_promocao_lote (
    id_promocao BIGINT NOT NULL,
    id_lote     BIGINT NOT NULL,
    CONSTRAINT pk_promo_lote PRIMARY KEY (id_promocao, id_lote)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CHAVES ESTRANGEIRAS
-- ============================================================

ALTER TABLE tb_assinatura
    ADD CONSTRAINT fk_ass_plano FOREIGN KEY (id_plano) REFERENCES tb_plano_clube (id_plano),
    ADD CONSTRAINT fk_ass_socio FOREIGN KEY (id_socio) REFERENCES tb_socio (id_pessoa);

ALTER TABLE tb_compra
    ADD CONSTRAINT fk_comp_forn FOREIGN KEY (id_fornecedor) REFERENCES tb_fornecedor (id_pessoa),
    ADD CONSTRAINT fk_comp_func FOREIGN KEY (id_funcionario) REFERENCES tb_funcionario (id_pessoa);

ALTER TABLE tb_descarte
    ADD CONSTRAINT fk_desc_func FOREIGN KEY (id_funcionario) REFERENCES tb_funcionario (id_pessoa),
    ADD CONSTRAINT fk_desc_lote FOREIGN KEY (id_lote) REFERENCES tb_lote (id_lote);

ALTER TABLE tb_devolucao
    ADD CONSTRAINT fk_dev_func FOREIGN KEY (id_funcionario) REFERENCES tb_funcionario (id_pessoa),
    ADD CONSTRAINT fk_dev_ped FOREIGN KEY (id_pedido) REFERENCES tb_pedido (id_pedido);

ALTER TABLE tb_endereco
    ADD CONSTRAINT fk_end_pessoa FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa (id_pessoa);

ALTER TABLE tb_entrega
    ADD CONSTRAINT fk_ent_end FOREIGN KEY (id_endereco) REFERENCES tb_endereco (id_endereco),
    ADD CONSTRAINT fk_ent_ped FOREIGN KEY (id_pedido) REFERENCES tb_pedido (id_pedido);

ALTER TABLE tb_fornecedor
    ADD CONSTRAINT fk_forn_pj FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa_juridica (id_pessoa);

ALTER TABLE tb_funcionario
    ADD CONSTRAINT fk_func_pf FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa_fisica (id_pessoa);

ALTER TABLE tb_item_compra
    ADD CONSTRAINT fk_ic_comp FOREIGN KEY (id_compra) REFERENCES tb_compra (id_compra),
    ADD CONSTRAINT fk_ic_lote FOREIGN KEY (id_lote) REFERENCES tb_lote (id_lote);

ALTER TABLE tb_item_devolucao
    ADD CONSTRAINT fk_idev_dev FOREIGN KEY (id_devolucao) REFERENCES tb_devolucao (id_devolucao),
    ADD CONSTRAINT fk_idev_lote FOREIGN KEY (id_lote) REFERENCES tb_lote (id_lote);

ALTER TABLE tb_item_pedido
    ADD CONSTRAINT fk_ip_lote FOREIGN KEY (id_lote) REFERENCES tb_lote (id_lote),
    ADD CONSTRAINT fk_ip_ped FOREIGN KEY (id_pedido) REFERENCES tb_pedido (id_pedido);

ALTER TABLE tb_lote
    ADD CONSTRAINT fk_lote_prod FOREIGN KEY (id_produto) REFERENCES tb_produto (id_produto);

ALTER TABLE tb_atualizar_estoque
    ADD CONSTRAINT fk_mov_comp FOREIGN KEY (id_compra) REFERENCES tb_compra (id_compra),
    ADD CONSTRAINT fk_mov_desc FOREIGN KEY (id_descarte) REFERENCES tb_descarte (id_descarte),
    ADD CONSTRAINT fk_mov_dev FOREIGN KEY (id_devolucao) REFERENCES tb_devolucao (id_devolucao),
    ADD CONSTRAINT fk_mov_lote FOREIGN KEY (id_lote) REFERENCES tb_lote (id_lote),
    ADD CONSTRAINT fk_mov_ped FOREIGN KEY (id_pedido) REFERENCES tb_pedido (id_pedido);

ALTER TABLE tb_pedido
    ADD CONSTRAINT fk_ped_socio FOREIGN KEY (id_socio) REFERENCES tb_socio (id_pessoa);

ALTER TABLE tb_produto_fornecedor
    ADD CONSTRAINT fk_pf_forn FOREIGN KEY (id_fornecedor) REFERENCES tb_fornecedor (id_pessoa),
    ADD CONSTRAINT fk_pf_prod FOREIGN KEY (id_produto) REFERENCES tb_produto (id_produto);

ALTER TABLE tb_pessoa_fisica
    ADD CONSTRAINT fk_pf_pessoa FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa (id_pessoa);

ALTER TABLE tb_pessoa_juridica
    ADD CONSTRAINT fk_pj_pessoa FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa (id_pessoa);

ALTER TABLE tb_promocao_lote
    ADD CONSTRAINT fk_pl_lote FOREIGN KEY (id_lote) REFERENCES tb_lote (id_lote),
    ADD CONSTRAINT fk_pl_promo FOREIGN KEY (id_promocao) REFERENCES tb_promocao (id_promocao);

ALTER TABLE tb_produto
    ADD CONSTRAINT fk_prod_cat FOREIGN KEY (id_categoria) REFERENCES tb_categoria (id_categoria),
    ADD CONSTRAINT fk_prod_marca FOREIGN KEY (id_marca) REFERENCES tb_marca (id_marca);

ALTER TABLE tb_recebimento
    ADD CONSTRAINT fk_rec_ass FOREIGN KEY (id_assinatura) REFERENCES tb_assinatura (id_assinatura),
    ADD CONSTRAINT fk_rec_ped FOREIGN KEY (id_pedido) REFERENCES tb_pedido (id_pedido);

ALTER TABLE tb_retirada
    ADD CONSTRAINT fk_ret_ent FOREIGN KEY (id_entrega) REFERENCES tb_entrega (id_entrega),
    ADD CONSTRAINT fk_ret_func FOREIGN KEY (id_funcionario) REFERENCES tb_funcionario (id_pessoa);

ALTER TABLE tb_socio
    ADD CONSTRAINT fk_socio_pf FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa_fisica (id_pessoa);