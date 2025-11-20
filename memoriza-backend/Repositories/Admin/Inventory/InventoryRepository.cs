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
            var list = new List<InventoryItem>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, name, unit, current_quantity, created_at
                FROM inventory_items
                ORDER BY name ASC;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new InventoryItem
                {
                    Id = reader.GetGuid(0),
                    Name = reader.GetString(1),
                    Unit = reader.IsDBNull(2) ? null : reader.GetString(2),
                    CurrentQuantity = reader.GetDecimal(3),
                    CreatedAt = reader.GetDateTime(4)
                });
            }

            return list;
        }

        public async Task<InventoryItem?> GetItemByIdAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, name, unit, current_quantity, created_at
                FROM inventory_items
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                return null;

            return new InventoryItem
            {
                Id = reader.GetGuid(0),
                Name = reader.GetString(1),
                Unit = reader.IsDBNull(2) ? null : reader.GetString(2),
                CurrentQuantity = reader.GetDecimal(3),
                CreatedAt = reader.GetDateTime(4)
            };
        }

        public async Task<InventoryItem> CreateItemAsync(InventoryItem item)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO inventory_items
                    (id, name, unit, current_quantity, created_at)
                VALUES
                    (@id, @name, @unit, @current_quantity, @created_at);";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", item.Id);
            cmd.Parameters.AddWithValue("name", item.Name);
            cmd.Parameters.AddWithValue("unit", (object?)item.Unit ?? DBNull.Value);
            cmd.Parameters.AddWithValue("current_quantity", item.CurrentQuantity);
            cmd.Parameters.AddWithValue("created_at", item.CreatedAt);

            await cmd.ExecuteNonQueryAsync();
            return item;
        }

        public async Task UpdateItemAsync(InventoryItem item)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                UPDATE inventory_items
                SET name = @name,
                    unit = @unit,
                    current_quantity = @current_quantity
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", item.Id);
            cmd.Parameters.AddWithValue("name", item.Name);
            cmd.Parameters.AddWithValue("unit", (object?)item.Unit ?? DBNull.Value);
            cmd.Parameters.AddWithValue("current_quantity", item.CurrentQuantity);

            await cmd.ExecuteNonQueryAsync();
        }

        // ========= MOVIMENTAÇÕES =========

        public async Task AddMovementAsync(InventoryMovement movement)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            // Vamos garantir que a movimentação e o update do saldo
            // aconteçam na MESMA transação
            await using var tx = await conn.BeginTransactionAsync();

            try
            {
                const string insertSql = @"
                    INSERT INTO inventory_movements
                        (id, inventory_item_id, quantity, type, reason, created_at)
                    VALUES
                        (@id, @inventory_item_id, @quantity, @type, @reason, @created_at);";

                await using (var cmd = new NpgsqlCommand(insertSql, conn, tx))
                {
                    cmd.Parameters.AddWithValue("id", movement.Id);
                    cmd.Parameters.AddWithValue("inventory_item_id", movement.InventoryItemId);
                    cmd.Parameters.AddWithValue("quantity", movement.Quantity);
                    cmd.Parameters.AddWithValue("type", movement.Type);
                    cmd.Parameters.AddWithValue("reason", (object?)movement.Reason ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("created_at", movement.CreatedAt);

                    await cmd.ExecuteNonQueryAsync();
                }

                // Atualiza o saldo atual no item
                const string updateItemSql = @"
                    UPDATE inventory_items
                    SET current_quantity = current_quantity + @delta
                    WHERE id = @item_id;";

                await using (var cmd = new NpgsqlCommand(updateItemSql, conn, tx))
                {
                    cmd.Parameters.AddWithValue("delta", movement.Quantity);
                    cmd.Parameters.AddWithValue("item_id", movement.InventoryItemId);

                    await cmd.ExecuteNonQueryAsync();
                }

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
            var list = new List<InventoryMovement>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, inventory_item_id, quantity, type, reason, created_at
                FROM inventory_movements
                WHERE inventory_item_id = @item_id
                ORDER BY created_at DESC;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("item_id", itemId);

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new InventoryMovement
                {
                    Id = reader.GetGuid(0),
                    InventoryItemId = reader.GetGuid(1),
                    Quantity = reader.GetDecimal(2),
                    Type = reader.GetString(3),
                    Reason = reader.IsDBNull(4) ? null : reader.GetString(4),
                    CreatedAt = reader.GetDateTime(5)
                });
            }

            return list;
        }
    }
}