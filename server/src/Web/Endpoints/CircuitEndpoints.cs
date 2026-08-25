using BLL.Contracts;
using BLL.Interfaces;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Web.Extensions;

namespace Web.Endpoints;

public static class CircuitEndpoints
{
    public static WebApplication MapCircuitEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/circuits");

        group.MapGet("", GetCircuits);

        group.MapPost("", CreateCircuit);
        
        group.MapGet("/{circuitId}", GetCircuit);

        return app;
    }

    private static async Task<IResult> GetCircuits(
        [FromServices] ICircuitService circuitService
    )
    {
        var result = circuitService.GetActive();

        if (!result.IsSuccess)
        {
            return result.ToMinimalApiResult();
        }

        var circuits = result.Value
            .Select(c => new
            {
                Id = c.Id,
                Name = c.Name,
                CreatedBy = c.CreatedBy,
                ActiveUsersCount = c.ConnectedUsers.Count,
                NodesCount = c.Nodes.Count,
            });

        return Results.Ok(circuits);
    }

    private static async Task<IResult> CreateCircuit(
        [FromServices] ICircuitService circuitService,
        [FromBody] CreateCircuitRequest request,
        CancellationToken cancellationToken
    )
    {
        var result = await circuitService.Create(request, cancellationToken);

        return result.ToMinimalApiResult();
    }

    private static async Task<IResult> GetCircuit(
        [FromServices] ICircuitService circuitService,
        [FromRoute] string circuitId,
        CancellationToken cancellationToken
    )
    {
        var result = await circuitService.Get(
            new GetCircuitRequest(circuitId),
            cancellationToken
        );

        return result.ToMinimalApiResult();
    }
}