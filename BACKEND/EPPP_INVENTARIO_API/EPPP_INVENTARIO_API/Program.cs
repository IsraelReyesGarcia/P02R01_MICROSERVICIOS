using EPPP_INVENTARIO_API.Constants;
using EPPP_INVENTARIO_API.Data;
using EPPP_INVENTARIO_API.Repository;
using EPPP_INVENTARIO_API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agregamos el servicio de la conexión de la base de datos a nuestro contenedor de servicios (program)
var dbConnectionString = builder.Configuration.GetConnectionString("ConexionSql");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(dbConnectionString));
// Inyectamos por dependencia las interfaces y repositorios
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Políticas CORS para el frontend (React / Next / Vite)
// Desarrollo: se permite cualquier puerto de localhost / 127.0.0.1
// Producción: solo los orígenes configurados en appsettings (Cors:AllowedOrigins)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(PolicyNames.AllowSpecificOrigin, policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(origin =>
                Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                (uri.Host == "localhost" || uri.Host == "127.0.0.1" || allowedOrigins.Contains(origin)));
        }
        else
        {
            policy.WithOrigins(allowedOrigins);
        }

        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("Location");
    });
});

// Respuestas de error en formato ProblemDetails (conservan los encabezados CORS)
builder.Services.AddProblemDetails();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

// CORS va antes de cualquier redirección para que el preflight (OPTIONS) no reciba un 307
app.UseCors(PolicyNames.AllowSpecificOrigin);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
