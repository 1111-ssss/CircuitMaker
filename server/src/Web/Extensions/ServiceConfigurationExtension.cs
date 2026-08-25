using BLL.Interfaces;
using BLL.Services;
using FluentValidation;

namespace Web.Extensions;

public static class ServiceConfigurationExtension
{
    public static IServiceCollection AddServiceConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddLogging();
        services.AddOpenApi();

        // Data Access Layer
        services.AddScoped<ICircuitService, CircuitService>();

        // Business Logic Layer
        services.AddScoped<ICircuitService, CircuitService>();
        services.AddScoped<IServiceValidator, ServiceValidator>();

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

        services.AddValidatorsFromAssembly(typeof(IServiceValidator).Assembly);

        return services;
    }
}