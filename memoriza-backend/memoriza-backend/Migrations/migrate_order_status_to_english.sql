-- ========================================
-- MIGRAÇÃO: Padronizar Status de Pedidos
-- ========================================
-- 
-- Este script migra os status de pedidos de português para inglês
-- para garantir compatibilidade com o código e webhook do Mercado Pago
--
-- IMPORTANTE: Fazer backup do banco antes de executar!
--

-- Verificar status atuais antes da migração
SELECT status, COUNT(*) as total
FROM orders
GROUP BY status
ORDER BY status;

-- Migrar status de português para inglês
UPDATE orders 
SET status = CASE 
    WHEN status = 'Pendente' THEN 'Pending'
    WHEN status = 'Aprovado' THEN 'Paid'
    WHEN status = 'Em produção' THEN 'InProduction'
    WHEN status = 'À caminho' THEN 'Shipped'
    WHEN status = 'Finalizado' THEN 'Delivered'
    WHEN status = 'Reembolsado' THEN 'Refunded'
    WHEN status = 'Cancelado' THEN 'Cancelled'
    ELSE status
END
WHERE status IN ('Pendente', 'Aprovado', 'Em produção', 'À caminho', 'Finalizado', 'Reembolsado', 'Cancelado');

-- Verificar status após migração
SELECT status, COUNT(*) as total
FROM orders
GROUP BY status
ORDER BY status;

-- Verificar se há algum status não mapeado
SELECT DISTINCT status
FROM orders
WHERE status NOT IN ('Pending', 'Paid', 'InProduction', 'Shipped', 'Delivered', 'Refunded', 'Cancelled');
