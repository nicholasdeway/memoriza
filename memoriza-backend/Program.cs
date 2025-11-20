using System.Text;
using System.Security.Claims;

// Auth
using memoriza_backend.Repositories.Auth;
using memoriza_backend.Services.Auth;

// Admin - Repositories
using memoriza_backend.Repositories.Admin.Categories;
using memoriza_backend.Repositories.Admin.Dashboard;
using memoriza_backend.Repositories.Admin.Inventory;
using memoriza_backend.Repositories.Admin.Orders;
using memoriza_backend.Repositories.Admin.Products;

// Admin - Services
using memoriza_backend.Services.Admin.Categories;
using memoriza_backend.Services.Admin.Dashboard;
using memoriza_backend.Services.Admin.Orders;
using memoriza_backend.Services.Admin.Products;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// MVC / Razor / Controllers
// ======================================================
builder.Services.AddRazorPages();
builder.Services.AddControllers();

// ======================================================
// REPOSITORIES
// ======================================================

// Auth
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Admin - Categories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

// Admin - Products
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();

// Admin - Inventory
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();

// Admin - Orders
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Admin - Dashboard
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();

// ======================================================
// SERVICES
// ======================================================

// Auth
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();

// Admin - Categories
builder.Services.AddScoped<ICategoryService, CategoryService>();

// Admin - Products
builder.Services.AddScoped<IProductService, ProductService>();

// Admin - Orders
builder.Services.AddScoped<IOrderService, OrderService>();

// Admin - Dashboard
builder.Services.AddScoped<IDashboardService, DashboardService>();

// ======================================================
// SWAGGER
// ======================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ======================================================
// AUTENTICAÇÃO: JWT + GOOGLE OAUTH
// ======================================================

var jwt = builder.Configuration.GetSection("Jwt");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var secretKey = jwt["Key"];

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = !string.IsNullOrWhiteSpace(jwt["Issuer"]),
            ValidIssuer = jwt["Issuer"],

            ValidateAudience = !string.IsNullOrWhiteSpace(jwt["Audience"]),
            ValidAudience = jwt["Audience"],

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey!)
            ),
            ClockSkew = TimeSpan.Zero
        };
    })
    // Cookie temporário para logins externos (Google)
    .AddCookie("External", options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    })
    // Google OAuth
    .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
    {
        options.ClientId = builder.Configuration["Google:ClientId"]!;
        options.ClientSecret = builder.Configuration["Google:ClientSecret"]!;
        options.SignInScheme = "External";

        options.Scope.Clear();
        options.Scope.Add("openid");
        options.Scope.Add("email");
        options.Scope.Add("profile");

        options.SaveTokens = true;

        options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "sub");
        options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
        options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
        options.ClaimActions.MapJsonKey("picture", "picture");
        options.ClaimActions.MapJsonKey("email_verified", "email_verified");

        options.Events = new OAuthEvents
        {
            OnRemoteFailure = context =>
            {
                var frontendBase = builder.Configuration["Google:FrontendBaseUrl"]
                                   ?? "http://localhost:3000";

                context.Response.Redirect($"{frontendBase}/login?googleError=access_denied");
                context.HandleResponse();
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

// ======================================================
// MIDDLEWARE PIPELINE
// ======================================================

// Swagger sempre habilitado (se quiser só em dev, pode colocar dentro de if)
app.UseSwagger();
app.UseSwaggerUI();

// Redirecionar a raiz "/" para o Swagger
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

app.Run();