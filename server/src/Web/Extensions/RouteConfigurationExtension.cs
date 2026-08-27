using Web.Endpoints;
using Web.Hubs;

namespace Web.Extensions;

public static class RouteConfigurationExtension
{
    public static WebApplication AddRouteConfiguration(this WebApplication app)
    {
        app.MapCircuitEndpoints();

        app.MapHub<CircuitHub>("/api/circuitHub");

        return app;
    }
}