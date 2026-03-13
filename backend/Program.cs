using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Data;
using ParkingManagementAPI.Middleware;
using ParkingManagementAPI.Services;
using ParkingManagementAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Services (DI) ──
builder.Services.AddScoped<IParkingSlotService, ParkingSlotService>();
builder.Services.AddScoped<IParkingSessionService, ParkingSessionService>();
builder.Services.AddScoped<IParkingRecordsService, ParkingRecordsService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// ── CORS ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// ── Controllers ──
builder.Services.AddControllers();

var app = builder.Build();

// ── Middleware pipeline ──
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowAngular");
app.MapControllers();

// ── Auto-migrate & seed on startup ──
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    DataSeeder.Seed(db);
}

app.Run();
