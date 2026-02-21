using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ComputerSeekho.Net.Data;
using Microsoft.OpenApi.Models;
using ComputerSeekho.Net.IServices;
using ComputerSeekho.Net.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services to container

// Database (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Authentication (JWT)
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// CORS - Allow Frontend (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite & React Defaults
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .WithExposedHeaders("Authorization"); // Critical: Allow frontend to read this header
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ComputerSeekho API", Version = "v1" });
    // Enable JWT Auth in Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        In = ParameterLocation.Header, 
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey 
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
       { 
         new OpenApiSecurityScheme 
         { 
           Reference = new OpenApiReference 
           { 
             Type = ReferenceType.SecurityScheme,
             Id = "Bearer" 
           } 
          },
          new string[] { } 
        } 
    });
});

// Register Services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IBatchService, BatchService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IEnquiryService, EnquiryService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IRecruiterService, RecruiterService>();
builder.Services.AddScoped<IPlacementService, PlacementService>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<IAlbumService, AlbumService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IGetInTouchService, GetInTouchService>();
builder.Services.AddScoped<IClosureReasonService, ClosureReasonService>();
// ExcelService is used only in ExcelController for now, can be scoped too
builder.Services.AddScoped<ExcelService>();
builder.Services.AddScoped<IPaymentTypeService, PaymentTypeService>();

var app = builder.Build();

// 2. Configure Request Pipeline

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ComputerSeekho.Net.Middleware.ExceptionMiddleware>();

app.UseStaticFiles(); // Enable serving static files (images)

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
