// Program.cs
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddTransient<IIconService, IconService>();
builder.Services.AddTransient<IUserService, UserService>();

// Enable CORS if needed
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowAll");

// API Endpoints
app.MapGet("/api/Users", async (IUserService userService) =>
{
   var users = await userService.GetUsersAsync();
    return Results.Ok(users);
})
.WithName("GetUsers")
.WithDisplayName("Get all users");

app.MapGet("/api/Icons/{name}", async (string name, IIconService iconService) =>
{
    var iconBytes = await iconService.GetIconBytesAsync(name);

    if (iconBytes == null)
    {
        return Results.NotFound();
    }

    return Results.File(iconBytes, "image/png");
})
.WithName("GetIcon")
.WithDisplayName("Get icon by name");

app.Run();