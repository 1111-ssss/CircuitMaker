using Web.Hubs;

namespace Web.Extensions;

public static class RouteConfigurationExtension
{
    public static WebApplication AddRouteConfiguration(this WebApplication app)
    {

        app.MapHub<CircuitHub>("/hubs/circuit");

        return app;
    }
}