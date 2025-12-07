using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Inventory
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly string _connectionString;

        public InventoryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // ========= ITENS DE ESTOQUE =========

        public async Task<IReadOnlyList<InventoryItem>> GetAllItemsAsync()
        {
            const string sql = @"
                SELECT 
                    id                 AS ""Id"",
                    name               AS ""Name"",
                    unit               AS ""Unit"",
                    current_quantity   AS ""CurrentQuantity"",
                    created_at         AS ""CreatedAt""
                FROM inventory_items
                ORDER BY name ASC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var items = await conn.QueryAsync<InventoryItem>(sql);
            return items.AsList();
        }

        public async Task<InventoryItem?> GetItemByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    id                 AS ""Id"",
                    name               AS ""Name"",
                    unit               AS ""Unit"",
                    current_quantity   AS ""CurrentQuantity"",
                    created_at         AS ""CreatedAt""
                FROM inventory_items
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var item = await conn.QuerySingleOrDefaultAsync<InventoryItem>(sql, new { Id = id });
            return item;
        }

        public async Task<InventoryItem> CreateItemAsync(InventoryItem item)
        {
            const string sql = @"
                INSERT INTO inventory_items
                    (id, name, unit, current_quantity, created_at)
                VALUES
                    (@Id, @Name, @Unit, @CurrentQuantity, @CreatedAt);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                item.Id,
                item.Name,
                Unit = (object?)item.Unit ?? DBNull.Value,
                item.CurrentQuantity,
                item.CreatedAt
            });

            return item;
        }

        public async Task UpdateItemAsync(InventoryItem item)
        {
            const string sql = @"
                UPDATE inventory_items
                SET name             = @Name,
                    unit             = @Unit,
                    current_quantity = @CurrentQuantity
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                item.Id,
                item.Name,
                Unit = (object?)item.Unit ?? DBNull.Value,
                item.CurrentQuantity
            });
        }

        // ========= MOVIMENTAÇÕES =========

        public async Task AddMovementAsync(InventoryMovement movement)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            await using var tx = await conn.BeginTransactionAsync();

            try
            {
                const string insertSql = @"
                    INSERT INTO inventory_movements
                        (id, inventory_item_id, quantity, type, reason, created_at)
                    VALUES
                        (@Id, @InventoryItemId, @Quantity, @Type, @Reason, @CreatedAt);
                ";

                await conn.ExecuteAsync(insertSql, new
                {
                    movement.Id,
                    movement.InventoryItemId,
                    movement.Quantity,
                    movement.Type,
                    Reason = (object?)movement.Reason ?? DBNull.Value,
                    movement.CreatedAt
                }, tx);

                const string updateItemSql = @"
                    UPDATE inventory_items
                    SET current_quantity = current_quantity + @Delta
                    WHERE id = @ItemId;
                ";

                await conn.ExecuteAsync(updateItemSql, new
                {
                    Delta = movement.Quantity,
                    ItemId = movement.InventoryItemId
                }, tx);

                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<IReadOnlyList<InventoryMovement>> GetMovementsByItemIdAsync(Guid itemId)
        {
            const string sql = @"
                SELECT 
                    id                  AS ""Id"",
                    inventory_item_id   AS ""InventoryItemId"",
                    quantity            AS ""Quantity"",
                    type                AS ""Type"",
                    reason              AS ""Reason"",
                    created_at          AS ""CreatedAt""
                FROM inventory_movements
                WHERE inventory_item_id = @ItemId
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var movements = await conn.QueryAsync<InventoryMovement>(sql, new { ItemId = itemId });
            return movements.AsList();
        }
    }
}