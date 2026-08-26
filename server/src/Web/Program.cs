using Web.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceConfiguration();

var app = builder.Build();

app.AddMiddlewareConfiguration();
app.AddRouteConfiguration();

app.Run();
