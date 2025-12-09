-- ========================================
-- VERIFICAR ENDEREÇOS NOS PEDIDOS
-- ========================================
-- 
-- Este script verifica se os pedidos têm endereços salvos
-- e identifica quais pedidos estão sem endereço
--

-- Ver pedidos com e sem endereço por status
SELECT 
    status,
    COUNT(*) as total_pedidos,
    COUNT(shipping_street) as com_endereco,
    COUNT(*) - COUNT(shipping_street) as sem_endereco
FROM orders
GROUP BY status
ORDER BY status;

-- Ver detalhes dos pedidos sem endereço
SELECT 
    id,
    order_number,
    status,
    created_at,
    shipping_street,
    shipping_city,
    shipping_state
FROM orders
WHERE shipping_street IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Ver exemplo de pedido COM endereço
SELECT 
    id,
    order_number,
    status,
    created_at,
    shipping_street,
    shipping_number,
    shipping_complement,
    shipping_neighborhood,
    shipping_city,
    shipping_state,
    shipping_zip_code
FROM orders
WHERE shipping_street IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
