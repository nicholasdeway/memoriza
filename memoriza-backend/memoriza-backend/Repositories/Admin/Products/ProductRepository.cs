using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Products
{
    public class ProductRepository : IProductRepository
    {
        private readonly string _connectionString;

        public ProductRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<Product>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    id                      AS ""Id"",
                    category_id             AS ""CategoryId"",
                    name                    AS ""Name"",
                    description             AS ""Description"",
                    price                   AS ""Price"",
                    promotional_price       AS ""PromotionalPrice"",
                    is_personalizable       AS ""IsPersonalizable"",
                    is_active               AS ""IsActive"",
                    created_at              AS ""CreatedAt""
                FROM products
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var list = await conn.QueryAsync<Product>(sql);
            return list.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<Product?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    id                      AS ""Id"",
                    category_id             AS ""CategoryId"",
                    name                    AS ""Name"",
                    description             AS ""Description"",
                    price                   AS ""Price"",
                    promotional_price       AS ""PromotionalPrice"",
                    is_personalizable       AS ""IsPersonalizable"",
                    is_active               AS ""IsActive"",
                    created_at              AS ""CreatedAt""
                FROM products
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var product = await conn.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
            return product;
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<Product> CreateAsync(Product product)
        {
            const string sql = @"
                INSERT INTO products (
                    id,
                    category_id,
                    name,
                    description,
                    price,
                    promotional_price,
                    is_personalizable,
                    is_active,
                    created_at
                )
                VALUES (
                    @Id,
                    @CategoryId,
                    @Name,
                    @Description,
                    @Price,
                    @PromotionalPrice,
                    @IsPersonalizable,
                    @IsActive,
                    @CreatedAt
                );
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                product.Id,
                product.CategoryId,
                product.Name,
                Description = (object?)product.Description ?? DBNull.Value,
                product.Price,
                PromotionalPrice = (object?)product.PromotionalPrice ?? DBNull.Value,
                product.IsPersonalizable,
                product.IsActive,
                product.CreatedAt
            });

            return product;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(Product product)
        {
            const string sql = @"
                UPDATE products
                SET category_id         = @CategoryId,
                    name                = @Name,
                    description         = @Description,
                    price               = @Price,
                    promotional_price   = @PromotionalPrice,
                    is_personalizable   = @IsPersonalizable,
                    is_active           = @IsActive
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                product.Id,
                product.CategoryId,
                product.Name,
                Description = (object?)product.Description ?? DBNull.Value,
                product.Price,
                PromotionalPrice = (object?)product.PromotionalPrice ?? DBNull.Value,
                product.IsPersonalizable,
                product.IsActive
            });
        }

        // ======================================================
        // SOFT DELETE (is_active = FALSE)
        // ======================================================
        // SOFT DELETE / HARD DELETE COM REGRA DE PEDIDOS
        public async Task DeleteAsync(Guid id)
        {
            const string getSql = @"
                SELECT 
                    id          AS ""Id"",
                    is_active   AS ""IsActive""
                FROM products
                WHERE id = @Id;
            ";

                    const string softDeleteSql = @"
                UPDATE products
                SET is_active = FALSE
                WHERE id = @Id;
            ";

                    const string hasOrdersSql = @"
                SELECT EXISTS(
                    SELECT 1 
                    FROM order_items 
                    WHERE product_id = @Id
                );
            ";

                    const string hardDeleteSql = @"
                DELETE FROM products
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            // 1) Verifica se o produto existe
            var product = await conn.QuerySingleOrDefaultAsync<Product>(getSql, new { Id = id });
            if (product == null)
            {
                // nada pra fazer
                return;
            }

            // 2) Se ainda está ativo -> apenas inativa (primeiro clique)
            if (product.IsActive)
            {
                await conn.ExecuteAsync(softDeleteSql, new { Id = id });
                return;
            }

            // 3) Se já está inativo -> verifica se tem pedidos
            var hasOrders = await conn.ExecuteScalarAsync<bool>(hasOrdersSql, new { Id = id });

            if (hasOrders)
            {
                // Produto já foi usado em pedidos:
                // não vamos apagar definitivamente pra não quebrar histórico
                // (mantém só como inativo e NÃO dá erro)
                return;
            }

            // 4) Já está inativo e NÃO tem pedidos -> pode apagar de vez
            await conn.ExecuteAsync(hardDeleteSql, new { Id = id });
        }

        // ======================================================
        // HARD DELETE (remove de vez o produto e vínculos)
        // ======================================================
        public async Task HardDeleteAsync(Guid id)
        {
            const string deleteImagesSql = @"DELETE FROM product_images WHERE product_id = @Id;";
            const string deleteSizesSql = @"DELETE FROM product_sizes  WHERE product_id = @Id;";
            const string deleteColorsSql = @"DELETE FROM product_colors WHERE product_id = @Id;";
            const string deleteProductSql = @"DELETE FROM products      WHERE id         = @Id;";

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var tx = await conn.BeginTransactionAsync();

            try
            {
                // Apaga dependências primeiro (evita problemas de FK)
                await conn.ExecuteAsync(deleteImagesSql, new { Id = id }, tx);
                await conn.ExecuteAsync(deleteSizesSql, new { Id = id }, tx);
                await conn.ExecuteAsync(deleteColorsSql, new { Id = id }, tx);

                // Depois apaga o próprio produto
                await conn.ExecuteAsync(deleteProductSql, new { Id = id }, tx);

                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        // ======================================================
        // RELAÇÃO PRODUTO ⇄ TAMANHOS (product_sizes)
        // ======================================================

        private sealed class ProductSizeRow
        {
            public Guid ProductId { get; set; }
            public int SizeId { get; set; }
        }

        public async Task<IReadOnlyList<int>> GetSizeIdsByProductIdAsync(Guid productId)
        {
            const string sql = @"
                SELECT size_id
                FROM product_sizes
                WHERE product_id = @ProductId;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var ids = await conn.QueryAsync<int>(sql, new { ProductId = productId });
            return ids.AsList();
        }

        public async Task<IDictionary<Guid, IReadOnlyList<int>>> GetSizeIdsByProductIdsAsync(IEnumerable<Guid> productIds)
        {
            var idsArr = productIds.Distinct().ToArray();
            if (idsArr.Length == 0)
                return new Dictionary<Guid, IReadOnlyList<int>>();

            const string sql = @"
                SELECT 
                    product_id  AS ""ProductId"",
                    size_id     AS ""SizeId""
                FROM product_sizes
                WHERE product_id = ANY(@ProductIds);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var rows = await conn.QueryAsync<ProductSizeRow>(sql, new { ProductIds = idsArr });

            return rows
                .GroupBy(r => r.ProductId)
                .ToDictionary(
                    g => g.Key,
                    g => (IReadOnlyList<int>)g.Select(r => r.SizeId).ToList()
                );
        }

        public async Task ReplaceProductSizesAsync(Guid productId, IEnumerable<int> sizeIds)
        {
            var ids = sizeIds?.Distinct().ToArray() ?? Array.Empty<int>();

            const string deleteSql = @"DELETE FROM product_sizes WHERE product_id = @ProductId;";
            const string insertSql = @"
                INSERT INTO product_sizes (product_id, size_id)
                VALUES (@ProductId, @SizeId);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var tx = await conn.BeginTransactionAsync();

            // Remove todos os vínculos antigos
            await conn.ExecuteAsync(deleteSql, new { ProductId = productId }, tx);

            // Insere os novos
            if (ids.Length > 0)
            {
                var param = ids.Select(sizeId => new { ProductId = productId, SizeId = sizeId });
                await conn.ExecuteAsync(insertSql, param, tx);
            }

            await tx.CommitAsync();
        }

        // ======================================================
        // RELAÇÃO PRODUTO ⇄ CORES (product_colors)
        // ======================================================

        private sealed class ProductColorRow
        {
            public Guid ProductId { get; set; }
            public int ColorId { get; set; }
        }

        public async Task<IReadOnlyList<int>> GetColorIdsByProductIdAsync(Guid productId)
        {
            const string sql = @"
                SELECT color_id
                FROM product_colors
                WHERE product_id = @ProductId;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var ids = await conn.QueryAsync<int>(sql, new { ProductId = productId });
            return ids.AsList();
        }

        public async Task<IDictionary<Guid, IReadOnlyList<int>>> GetColorIdsByProductIdsAsync(IEnumerable<Guid> productIds)
        {
            var idsArr = productIds.Distinct().ToArray();
            if (idsArr.Length == 0)
                return new Dictionary<Guid, IReadOnlyList<int>>();

            const string sql = @"
                SELECT 
                    product_id  AS ""ProductId"",
                    color_id    AS ""ColorId""
                FROM product_colors
                WHERE product_id = ANY(@ProductIds);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var rows = await conn.QueryAsync<ProductColorRow>(sql, new { ProductIds = idsArr });

            return rows
                .GroupBy(r => r.ProductId)
                .ToDictionary(
                    g => g.Key,
                    g => (IReadOnlyList<int>)g.Select(r => r.ColorId).ToList()
                );
        }

        public async Task ReplaceProductColorsAsync(Guid productId, IEnumerable<int> colorIds)
        {
            var ids = colorIds?.Distinct().ToArray() ?? Array.Empty<int>();

            const string deleteSql = @"DELETE FROM product_colors WHERE product_id = @ProductId;";
            const string insertSql = @"
                INSERT INTO product_colors (product_id, color_id)
                VALUES (@ProductId, @ColorId);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var tx = await conn.BeginTransactionAsync();

            // Remove todos os vínculos antigos
            await conn.ExecuteAsync(deleteSql, new { ProductId = productId }, tx);

            // Insere os novos
            if (ids.Length > 0)
            {
                var param = ids.Select(colorId => new { ProductId = productId, ColorId = colorId });
                await conn.ExecuteAsync(insertSql, param, tx);
            }

            await tx.CommitAsync();
        }
    }
}