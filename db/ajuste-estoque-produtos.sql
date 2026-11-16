-- =====================================================================
-- GreenGo - Acerta o estoque dos produtos (tb_produto.qnt)
-- O estoque de cada produto passa a ser a SOMA da quantidade atual dos lotes dele.
-- Rodar UMA vez no MySQL Workbench (selecione tudo com Ctrl+A e use o 1º raio).
-- A partir daqui, o sistema mantém o estoque certo sozinho:
--   cadastrar lote = soma | excluir lote = subtrai | trocar o produto do lote = transfere
-- =====================================================================

USE PFS1_10442521970;

UPDATE tb_produto p
SET p.qnt = (
    SELECT COALESCE(SUM(l.quantidade_atual), 0)
    FROM tb_lote l
    WHERE l.id_produto = p.id_produto
)
WHERE p.id_produto > 0;

-- Conferência: estoque do produto x soma dos lotes (as duas colunas devem ser iguais)
SELECT p.id_produto, p.nome, p.qnt AS estoque_produto,
       (SELECT COALESCE(SUM(l.quantidade_atual), 0) FROM tb_lote l WHERE l.id_produto = p.id_produto) AS soma_lotes
FROM tb_produto p
ORDER BY p.nome;