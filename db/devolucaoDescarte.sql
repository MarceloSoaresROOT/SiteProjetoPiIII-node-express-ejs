-- =====================================================================
-- GreenGo - Ajustes no banco para a funcionalidade de Devolução e Descarte
-- Rodar UMA vez no MySQL Workbench, conectado ao banco PFS1_10442521970
-- =====================================================================

USE PFS1_10442521970;

-- 1) Quantidade cadastrada do lote (limite para devoluções que voltam ao estoque)
ALTER TABLE tb_lote
    ADD COLUMN quantidade_inicial BIGINT NOT NULL DEFAULT 0;

-- Lotes que já existem: a quantidade cadastrada passa a ser a quantidade atual
UPDATE tb_lote SET quantidade_inicial = quantidade_atual WHERE id_lote > 0;

-- 2) Motivo e observação de cada item descartado
ALTER TABLE tb_item_descarte
    ADD COLUMN motivo VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN observacao VARCHAR(255) NULL DEFAULT NULL;

-- 3) Devolução ao estoque: pedido opcional (por enquanto), funcionário que registrou,
--    e motivo/observação de cada item devolvido
ALTER TABLE tb_devolucao
    MODIFY COLUMN id_pedido BIGINT NULL,
    ADD COLUMN id_funcionario BIGINT NULL;

ALTER TABLE tb_item_devolucao
    ADD COLUMN motivo VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN observacao VARCHAR(255) NULL DEFAULT NULL;

-- 4) Funcionário que registra as devoluções (enquanto não existe login)
INSERT INTO tb_pessoa (email, senha, telefone, tipo_pessoa, ativo)
VALUES ('funcionario@greengo.com', '123456', NULL, 'PF', 'S');

INSERT INTO tb_pessoa_fisica (id_pessoa, nome, cpf, matricula, cargo, data_admissao)
VALUES (LAST_INSERT_ID(), 'Funcionário GreenGo', '000.000.000-00', 'F0001', 'Atendente', NOW());

-- Conferência
SELECT p.id_pessoa, f.nome, f.matricula FROM tb_pessoa p
INNER JOIN tb_pessoa_fisica f ON f.id_pessoa = p.id_pessoa
WHERE f.matricula = 'F0001';