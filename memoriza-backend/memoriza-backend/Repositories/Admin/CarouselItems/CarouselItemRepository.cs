using System;
using System.Linq;
using Dapper;
using memoriza_backend.Models.Entities;
using Npgsql;
using memoriza_backend.Models.DTO.Admin.Product;

namespace memoriza_backend.Repositories.Admin.CarouselItems
{
    public class CarouselItemRepository : ICarouselItemRepository
    {
        private readonly string _connectionString;

        public CarouselItemRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<CarouselItem>> GetAllAsync()
        {
            const string sql = @"
                SELECT
                    id             AS ""Id"",
                    title          AS ""Title"",
                    subtitle       AS ""Subtitle"",
                    cta_text       AS ""CtaText"",
                    cta_link       AS ""CtaLink"",
                    image_path     AS ""ImagePath"",
                    is_active      AS ""IsActive"",
                    display_order  AS ""DisplayOrder"",
                    created_at     AS ""CreatedAt"",
                    template_type  AS ""TemplateType""
                FROM carousel_items
                ORDER BY display_order ASC, created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var list = await conn.QueryAsync<CarouselItem>(sql);
            return list.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<CarouselItem?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT
                    id             AS ""Id"",
                    title          AS ""Title"",
                    subtitle       AS ""Subtitle"",
                    cta_text       AS ""CtaText"",
                    cta_link       AS ""CtaLink"",
                    image_path     AS ""ImagePath"",
                    is_active      AS ""IsActive"",
                    display_order  AS ""DisplayOrder"",
                    created_at     AS ""CreatedAt"",
                    template_type  AS ""TemplateType""
                FROM carousel_items
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<CarouselItem>(sql, new { Id = id });
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<CarouselItem> CreateAsync(CarouselItem item)
        {
            const string sql = @"
                INSERT INTO carousel_items
                    (id, title, subtitle, cta_text, cta_link, image_path, is_active, display_order, created_at, template_type)
                VALUES
                    (@Id, @Title, @Subtitle, @CtaText, @CtaLink, @ImagePath, @IsActive, @DisplayOrder, @CreatedAt, @TemplateType);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                item.Id,
                item.Title,
                Subtitle = (object?)item.Subtitle ?? DBNull.Value,
                CtaText = (object?)item.CtaText ?? DBNull.Value,
                CtaLink = (object?)item.CtaLink ?? DBNull.Value,
                item.ImagePath,
                item.IsActive,
                item.DisplayOrder,
                item.CreatedAt,
                TemplateType = (object?)item.TemplateType ?? "default"
            });

            return item;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(CarouselItem item)
        {
            const string sql = @"
                UPDATE carousel_items
                SET
                    title          = @Title,
                    subtitle       = @Subtitle,
                    cta_text       = @CtaText,
                    cta_link       = @CtaLink,
                    image_path     = @ImagePath,
                    is_active      = @IsActive,
                    display_order  = @DisplayOrder,
                    template_type  = @TemplateType
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                item.Id,
                item.Title,
                Subtitle = (object?)item.Subtitle ?? DBNull.Value,
                CtaText = (object?)item.CtaText ?? DBNull.Value,
                CtaLink = (object?)item.CtaLink ?? DBNull.Value,
                item.ImagePath,
                item.IsActive,
                item.DisplayOrder,
                TemplateType = (object?)item.TemplateType ?? "default"
            });
        }

        // ======================================================
        // DELETE
        // ======================================================
        public async Task DeleteAsync(Guid id)
        {
            const string sql = @"DELETE FROM carousel_items WHERE id = @Id;";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id });
        }

        // ======================================================
        // Próxima ordem de exibição
        // ======================================================
        public async Task<int> GetNextDisplayOrderAsync()
        {
            const string sql = @"SELECT COALESCE(MAX(display_order), -1) FROM carousel_items;";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var max = await conn.ExecuteScalarAsync<int>(sql);
            return max + 1;
        }

        // ======================================================
        // Reorder
        // ======================================================
        public async Task ReorderAsync(IReadOnlyList<ReorderImageItemDto> items)
        {
            if (items == null || items.Count == 0)
                return;

            const string sql = @"
                UPDATE carousel_items
                SET display_order = @DisplayOrder
                WHERE id = @Id;
            ";

            var parameters = items.Select(i => new
            {
                Id = i.ImageId,
                i.DisplayOrder
            });

            await using var conn = GetConnection();
            await conn.OpenAsync();

            using var tx = await conn.BeginTransactionAsync();

            foreach (var p in parameters)
            {
                await conn.ExecuteAsync(sql, p, tx);
            }

            await tx.CommitAsync();
        }
    }
}