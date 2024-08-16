using SearchService.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();
builder.Services.AddControllers();
var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

try
{
    await DBInitializer.Init(app);
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.Run();
