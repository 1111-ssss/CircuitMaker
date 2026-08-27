using BLL.Interfaces;
using BLL.Services;
using DAL.Interfaces;
using DAL.Repositories;
using FluentValidation;

namespace Web.Extensions;

public static class ServiceConfigurationExtension
{
    public static IServiceCollection AddServiceConfiguration(this IServiceCollection services)
    {
        services.AddLogging();
        services.AddOpenApi();

        // Data Access Layer
        services.AddSingleton<ICircuitRepository, InMemoryRepository>();

        // Business Logic Layer
        services.AddScoped<ICircuitService, CircuitService>();
        services.AddScoped<IServiceValidator, ServiceValidator>();
        services.AddScoped<ILogicSimulationService, LogicSimulationService>();

        // CORS, SignalR
        services.AddCors(options =>
        {
            options.AddPolicy("ReactAppPolicy", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        });

        services.AddValidatorsFromAssembly(typeof(IServiceValidator).Assembly);

        return services;
    }
}