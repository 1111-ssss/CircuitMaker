using Web.Middleware;

namespace Web.Extensions;

public static class MiddlewareConfigurationExtension
{
    public static WebApplication AddMiddlewareConfiguration(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
        app.UseCors("ReactAppPolicy");
        app.UseRouting();

        return app;
    }
}