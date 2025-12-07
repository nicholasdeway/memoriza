using memoriza_backend.Models.DTO.Admin.Employees;
using memoriza_backend.Services.Admin.Employees;
using memoriza_backend.Repositories.Admin.Employees;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace memoriza_backend.Filters
{
    /// <summary>
    /// Action Filter que registra automaticamente ações de usuários Employee
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
    public class LogEmployeeActionAttribute : ActionFilterAttribute
    {
        public string Module { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public bool IncludeResourceName { get; set; } = false;

        public override async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            // Executa a ação primeiro
            var resultContext = await next();

            // Apenas loga se a ação foi bem-sucedida (200-299)
            if (resultContext.HttpContext.Response.StatusCode >= 200 &&
                resultContext.HttpContext.Response.StatusCode < 300)
            {
                try
                {
                    // Extrai informações do usuário autenticado
                    var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) 
                                   ?? context.HttpContext.User.FindFirst("sub");
                    
                    if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
                    {
                        Console.WriteLine("[LogEmployeeAction] Usuário não autenticado, não logando");
                        return; // Não há usuário autenticado, não loga
                    }

                    var userId = Guid.Parse(userIdClaim.Value);
                    Console.WriteLine($"[LogEmployeeAction] UserId: {userId}, Module: {Module}, Action: {Action}");
                    
                    // Verifica se o usuário é um Employee (existe na tabela employees)
                    var employeeRepository = context.HttpContext.RequestServices
                        .GetRequiredService<IEmployeeRepository>();
                    
                    var allEmployees = await employeeRepository.GetAllAsync();
                    var employee = allEmployees.FirstOrDefault(e => e.UserId == userId);
                    
                    if (employee == null)
                    {
                        Console.WriteLine($"[LogEmployeeAction] Usuário {userId} não é um Employee (provavelmente Admin), não logando");
                        return; // Usuário não é um Employee, não loga
                    }

                    Console.WriteLine($"[LogEmployeeAction] Employee encontrado: {employee.Id}");
                    
                    // Pega o serviço de log
                    var logService = context.HttpContext.RequestServices
                        .GetRequiredService<IEmployeeAccessLogService>();

                    // Gera descrição
                    var description = GenerateDescription(context, Action, Module, employee);
                    Console.WriteLine($"[LogEmployeeAction] Descrição: {description}");

                    // Cria o log usando o EmployeeId (não o UserId!)
                    await logService.CreateAsync(new EmployeeAccessLogCreateDto
                    {
                        EmployeeId = employee.Id, // Usa o ID do Employee, não do User!
                        Action = Action,
                        Module = Module,
                        Description = description,
                        Timestamp = DateTime.UtcNow
                    });
                    
                    Console.WriteLine($"[LogEmployeeAction] Log criado com sucesso!");
                }
                catch (Exception ex)
                {
                    // Log de erro mas não quebra a aplicação
                    Console.WriteLine($"[LogEmployeeAction] Erro ao registrar log: {ex.Message}");
                    Console.WriteLine($"[LogEmployeeAction] StackTrace: {ex.StackTrace}");
                }
            }
            else
            {
                Console.WriteLine($"[LogEmployeeAction] Ação não foi bem-sucedida (Status: {resultContext.HttpContext.Response.StatusCode}), não logando");
            }
        }

        private string GenerateDescription(ActionExecutingContext context, string action, string module, memoriza_backend.Models.Admin.AdminEmployee employee)
        {
            // Pega o nome do funcionário
            var userName = $"{employee.FirstName} {employee.LastName}";

            // Mapeia ação para texto em português
            var actionText = action switch
            {
                "create" => "criou",
                "edit" => "editou",
                "delete" => "excluiu",
                "view" => "visualizou",
                "export" => "exportou",
                "update_status" => "atualizou o status de",
                "reorder" => "reorganizou a ordem do",
                "login" => "fez login no",
                "logout" => "fez logout do",
                _ => "realizou ação em"
            };

            // Mapeia módulo para texto em português
            var moduleText = module switch
            {
                "products" => "Produtos",
                "categories" => "Categorias",
                "sizes" => "Tamanhos",
                "colors" => "Cores",
                "orders" => "Pedidos",
                "carousel" => "Carrossel",
                "employees" => "Funcionários",
                "groups" => "Grupos",
                "dashboard" => "Dashboard",
                "settings" => "Configurações",
                "logs" => "Logs",
                _ => module
            };

            // Tenta extrair nome do recurso se disponível
            string? resourceName = null;
            if (IncludeResourceName && context.ActionArguments.ContainsKey("dto"))
            {
                var dto = context.ActionArguments["dto"];
                var nameProperty = dto?.GetType().GetProperty("Name");
                if (nameProperty != null)
                {
                    resourceName = nameProperty.GetValue(dto)?.ToString();
                }
            }

            // Monta descrição
            if (!string.IsNullOrEmpty(resourceName))
            {
                return $"{userName} {actionText} {moduleText}: {resourceName}";
            }

            return $"{userName} {actionText} {moduleText}";
        }
    }
}
