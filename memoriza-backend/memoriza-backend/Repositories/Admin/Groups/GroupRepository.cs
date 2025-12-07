using System.Data;
using System.Text.Json;
using Dapper;
using memoriza_backend.Models.DTO.Admin.Groups;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Groups
{
    public class GroupRepository : IGroupRepository
    {
        private readonly string _connectionString;

        public GroupRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // DTO interno para mapear user_groups (sem permissões)
        private class GroupRow
        {
            public Guid Id { get; set; }
            public string Name { get; set; } = null!;
            public string? Description { get; set; }
            public bool IsActive { get; set; }
            public int EmployeeCount { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        // DTO interno para mapear user_group_permissions
        private class PermissionRow
        {
            public Guid GroupId { get; set; }
            public string Module { get; set; } = null!;
            public string ActionsJson { get; set; } = null!;
        }

        // =====================================================
        // GET ALL
        // =====================================================
        public async Task<IEnumerable<GroupResponseDto>> GetAllAsync()
        {
            const string sqlGroups = @"
                SELECT 
                    id,
                    name,
                    description,
                    is_active      AS ""IsActive"",
                    employee_count AS ""EmployeeCount"",
                    created_at     AS ""CreatedAt""
                FROM user_groups
                ORDER BY created_at ASC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var groups = (await conn.QueryAsync<GroupRow>(sqlGroups)).ToList();
            if (!groups.Any())
                return Enumerable.Empty<GroupResponseDto>();

            var groupIds = groups.Select(g => g.Id).ToArray();

            const string sqlPermissions = @"
                SELECT 
                    group_id AS ""GroupId"",
                    module   AS ""Module"",
                    actions  AS ""ActionsJson""
                FROM user_group_permissions
                WHERE group_id = ANY(@GroupIds);
            ";

            var permRows = await conn.QueryAsync<PermissionRow>(sqlPermissions, new { GroupIds = groupIds });

            var permsByGroup = permRows
                .GroupBy(p => p.GroupId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(p => new PermissionDto
                    {
                        Module = p.Module,
                        Actions = JsonSerializer.Deserialize<Dictionary<string, bool>>(p.ActionsJson)
                                  ?? new Dictionary<string, bool>()
                    }).ToList()
                );

            return groups.Select(g => new GroupResponseDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                IsActive = g.IsActive,
                EmployeeCount = g.EmployeeCount,
                CreatedAt = g.CreatedAt,
                Permissions = permsByGroup.ContainsKey(g.Id)
                    ? permsByGroup[g.Id]
                    : new List<PermissionDto>()
            });
        }

        // =====================================================
        // GET BY ID
        // =====================================================
        public async Task<GroupResponseDto?> GetByIdAsync(Guid id)
        {
            const string sqlGroup = @"
                SELECT 
                    id,
                    name,
                    description,
                    is_active      AS ""IsActive"",
                    employee_count AS ""EmployeeCount"",
                    created_at     AS ""CreatedAt""
                FROM user_groups
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var group = await conn.QuerySingleOrDefaultAsync<GroupRow>(sqlGroup, new { Id = id });
            if (group is null)
                return null;

            const string sqlPermissions = @"
                SELECT 
                    group_id AS ""GroupId"",
                    module   AS ""Module"",
                    actions  AS ""ActionsJson""
                FROM user_group_permissions
                WHERE group_id = @GroupId;
            ";

            var permRows = await conn.QueryAsync<PermissionRow>(sqlPermissions, new { GroupId = id });

            var permissions = permRows.Select(p => new PermissionDto
            {
                Module = p.Module,
                Actions = JsonSerializer.Deserialize<Dictionary<string, bool>>(p.ActionsJson)
                          ?? new Dictionary<string, bool>()
            }).ToList();

            return new GroupResponseDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                IsActive = group.IsActive,
                EmployeeCount = group.EmployeeCount,
                CreatedAt = group.CreatedAt,
                Permissions = permissions
            };
        }

        // =====================================================
        // CREATE
        // =====================================================
        public async Task<Guid> CreateAsync(GroupFormDto dto)
        {
            const string sqlInsertGroup = @"
                INSERT INTO user_groups (id, name, description, is_active, employee_count, created_at, updated_at)
                VALUES (@Id, @Name, @Description, @IsActive, 0, now(), now());
            ";

            const string sqlInsertPerm = @"
                INSERT INTO user_group_permissions (group_id, module, actions)
                VALUES (@GroupId, @Module, CAST(@ActionsJson AS jsonb));
            ";

            var newId = Guid.NewGuid();

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var tx = await conn.BeginTransactionAsync();

            await conn.ExecuteAsync(sqlInsertGroup, new
            {
                Id = newId,
                Name = dto.Name.Trim(),
                Description = (object?)dto.Description ?? DBNull.Value,
                IsActive = dto.IsActive
            }, tx);

            if (dto.Permissions is { Count: > 0 })
            {
                foreach (var perm in dto.Permissions)
                {
                    var json = JsonSerializer.Serialize(
                        perm.Actions ?? new Dictionary<string, bool>());

                    await conn.ExecuteAsync(sqlInsertPerm, new
                    {
                        GroupId = newId,
                        Module = perm.Module,
                        ActionsJson = json
                    }, tx);
                }
            }

            await tx.CommitAsync();
            return newId;
        }

        // =====================================================
        // UPDATE
        // =====================================================
        public async Task UpdateAsync(Guid id, GroupFormDto dto)
        {
            const string sqlUpdateGroup = @"
                UPDATE user_groups
                SET name        = @Name,
                    description = @Description,
                    is_active   = @IsActive,
                    updated_at  = now()
                WHERE id = @Id;
            ";

            const string sqlDeletePerms = @"
                DELETE FROM user_group_permissions
                WHERE group_id = @GroupId;
            ";

            const string sqlInsertPerm = @"
                INSERT INTO user_group_permissions (group_id, module, actions)
                VALUES (@GroupId, @Module, CAST(@ActionsJson AS jsonb));
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var tx = await conn.BeginTransactionAsync();

            await conn.ExecuteAsync(sqlUpdateGroup, new
            {
                Id = id,
                Name = dto.Name.Trim(),
                Description = (object?)dto.Description ?? DBNull.Value,
                IsActive = dto.IsActive
            }, tx);

            await conn.ExecuteAsync(sqlDeletePerms, new { GroupId = id }, tx);

            if (dto.Permissions is { Count: > 0 })
            {
                foreach (var perm in dto.Permissions)
                {
                    var json = JsonSerializer.Serialize(
                        perm.Actions ?? new Dictionary<string, bool>());

                    await conn.ExecuteAsync(sqlInsertPerm, new
                    {
                        GroupId = id,
                        Module = perm.Module,
                        ActionsJson = json
                    }, tx);
                }
            }

            await tx.CommitAsync();
        }

        // =====================================================
        // DELETE
        // =====================================================
        public async Task DeleteAsync(Guid id)
        {
            const string sql = @"DELETE FROM user_groups WHERE id = @Id;";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id });
        }

        // =====================================================
        // UNIQUE NAME
        // =====================================================
        public async Task<bool> IsNameUniqueAsync(string name, Guid? excludeId = null)
        {
            const string sql = @"
                SELECT COUNT(*)
                FROM user_groups
                WHERE lower(name) = lower(@Name)
                  AND (@ExcludeId IS NULL OR id <> @ExcludeId);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var count = await conn.ExecuteScalarAsync<int>(sql, new
            {
                Name = name.Trim(),
                ExcludeId = excludeId
            });

            return count == 0;
        }

        // =====================================================
        // UPDATE STATUS
        // =====================================================
        public async Task UpdateStatusAsync(Guid id, bool isActive)
        {
            const string sql = @"
                UPDATE user_groups
                SET is_active  = @IsActive,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id, IsActive = isActive });
        }
    }
}