// ========== ADMIN – REPOSITORIES ==========
using FluentValidation;
using FluentValidation.AspNetCore;
using memoriza_backend.Repositories.Admin.CarouselItems;
using memoriza_backend.Repositories.Admin.Categories;
using memoriza_backend.Repositories.Admin.Colors;
using memoriza_backend.Repositories.Admin.Dashboard;
using memoriza_backend.Repositories.Admin.Employees;
using memoriza_backend.Repositories.Admin.Groups;
using memoriza_backend.Repositories.Admin.Inventory;
using memoriza_backend.Repositories.Admin.Orders;
using memoriza_backend.Repositories.Admin.Products;
using memoriza_backend.Repositories.Admin.Sizes;
// ========== AUTH ==========
using memoriza_backend.Repositories.Auth;
using memoriza_backend.Repositories.Interfaces;
// ========== PROFILE (usuário) – REPOSITORIES ==========
using memoriza_backend.Repositories.Profile;
using memoriza_backend.Repositories.Profile.AddressRepository;
using memoriza_backend.Services.Admin.CarouselItems;
// ========== ADMIN – SERVICES ==========
using memoriza_backend.Services.Admin.Categories;
using memoriza_backend.Services.Admin.Colors;
using memoriza_backend.Services.Admin.Dashboard;
using memoriza_backend.Services.Admin.Employees;
using memoriza_backend.Services.Admin.Groups;
using memoriza_backend.Services.Admin.Orders;
using memoriza_backend.Services.Admin.Products;
using memoriza_backend.Services.Admin.Sizes;
using memoriza_backend.Services.Auth;
using memoriza_backend.Services.Payments;
using memoriza_backend.Services.Profile.AddressService;
// ========== PROFILE (usuário) – SERVICES ==========
using memoriza_backend.Services.Profile.CartService;
using memoriza_backend.Services.Profile.OrderService;
using memoriza_backend.Services.Profile.ShippingService;
using memoriza_backend.Services.Profile.UserService;
// ========== PAYMENT ==========
using memoriza_backend.Settings;
using memoriza_backend.Validations.User.Orders;
// ========== ASP.NET / AUTH ==========
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.IdentityModel.Tokens;
// ========== SWAGGER / OPENAPI ==========
using Microsoft.OpenApi.Models;
// ========== SERILOG ==========
using Serilog;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// SERILOG + MONGODB (LOGS)
// ======================================================
var mongoConnection = builder.Configuration.GetSection("MongoSettings")
    .GetValue<string>("ConnectionString");

if (string.IsNullOrWhiteSpace(mongoConnection))
{
    throw new ApplicationException("MongoSettings:ConnectionString não configurado no appsettings.json.");
}

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.MongoDB(
        mongoConnection,
        collectionName: "app_logs"
    )
    .CreateLogger();

builder.Host.UseSerilog();

// ======================================================
// MVC / Controllers / Razor
// ======================================================
builder.Services.AddRazorPages();
builder.Services.AddControllers();

// ======================================================
// CORS
// ======================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ======================================================
// REPOSITORIES
// ======================================================

// --- Auth ---
builder.Services.AddScoped<IUserRepository, UserRepository>();

// --- Profile / User (cliente da loja) ---
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<ICustomerOrderRepository, CustomerOrderRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();

// --- Admin ---
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IAdminOrderRepository, AdminOrderRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<ISizeRepository, SizeRepository>();
builder.Services.AddScoped<IColorRepository, ColorRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<ICarouselItemRepository, CarouselItemRepository>();
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeAccessLogRepository, EmployeeAccessLogRepository>();

// ======================================================
// SERVICES
// ======================================================

// --- Auth ---
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<memoriza_backend.Services.Auth.IUserService,
                           memoriza_backend.Services.Auth.UserService>();

// --- Profile / User ---
builder.Services.AddScoped<IProfileUserService, ProfileUserService>();
builder.Services.AddScoped<ICustomerOrderService, CustomerOrderService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IShippingService, ShippingService>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddScoped<IShippingCalculatorService, ShippingCalculatorService>();
builder.Services.Configure<List<ShippingRegionSettings>>(builder.Configuration.GetSection("ShippingRegions"));

// --- Admin ---
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAdminOrderService, AdminOrderService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ISizeService, SizeService>();
builder.Services.AddScoped<IColorService, ColorService>();
builder.Services.AddScoped<ICarouselItemService, CarouselItemService>();
builder.Services.AddScoped<IGroupService, GroupService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IEmployeeAccessLogService, EmployeeAccessLogService>();

// --- Payments ---
builder.Services.AddScoped<IMercadoPagoService, MercadoPagoService>();
builder.Services.Configure<MercadoPagoSettings>(builder.Configuration.GetSection("MercadoPago"));

// --- Validations ---
builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderFromCartRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();

// ======================================================
// AUTORIZAÇÃO
// ======================================================
builder.Services.AddAuthorization();

// ======================================================
// SWAGGER + JWT (Authorize)
// ======================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Memoriza API",
        Version = "v1"
    });

    var jwtScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Insira o token no formato: **Bearer {seu_token}**",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", jwtScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtScheme,
            Array.Empty<string>()
        }
    });
});

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
        var secretKey = jwt["SecretKey"];

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
            ClockSkew = TimeSpan.Zero,

            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier
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

                context.Response.Redirect($"{frontendBase}/auth/login?googleError=access_denied");
                context.HandleResponse();
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

// ======================================================
// PIPELINE HTTP
// ======================================================

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", ctx =>
{
    ctx.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

app.Run();