using BLL.Contracts;
using BLL.Interfaces;
using DAL.Constants;
using DAL.Entities;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class CircuitHub : Hub
{
    private readonly ICircuitService _circuitService;

    public CircuitHub(ICircuitService circuitService)
    {
        _circuitService = circuitService;
    }

    public async Task JoinCircuit(string circuitId, string rawName, CancellationToken cancellationToken = default)
    {
        var user = await _circuitService.Join(
            new JoinCircuitRequest(circuitId, Context.ConnectionId, rawName),
            cancellationToken
        );

        var circuit = await _circuitService.Get(
            new GetCircuitRequest(circuitId),
            cancellationToken
        );

        if (circuit.Value is null || user.Value is null) {
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, circuitId);

        await Clients.Caller.SendAsync(
            CircuitHubConstants.JoinedCircuitMethod,
            new {
                AssignedName = user.Value.DisplayName,
                Circuit = circuit 
            }
        );

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.UserJoinedMethod,
            user
        );
    }

    public async Task UpdateNodes(string circuitId, List<CircuitNode> nodes, CancellationToken cancellationToken = default)
    {
        await _circuitService.SyncNodes(new SyncNodesRequest(circuitId, nodes), cancellationToken);

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.NodesUpdatedMethod,
            nodes
        );
    }

    public async Task UpdateEdges(string circuitId, List<CircuitEdge> edges, CancellationToken cancellationToken = default)
    {
        await _circuitService.SyncEdges(new SyncEdgesRequest(circuitId, edges), cancellationToken);
        await Clients.OthersInGroup(circuitId).SendAsync(CircuitHubConstants.EdgesUpdatedMethod, edges);
    }

    public async Task SendCursorPosition(string circuitId, double x, double y)
    {
        await Clients.OthersInGroup(circuitId).SendAsync(CircuitHubConstants.CursorMovedMethod, new {
            ConnectionId = Context.ConnectionId,
            X = x,
            Y = y
        });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = await _circuitService.Leave(new LeaveCircuitRequest(Context.ConnectionId));
        if (user.Value is not null && user.Value.CurrentCircuitId != null)
        {
            await Clients.Group(user.Value.CurrentCircuitId).SendAsync(CircuitHubConstants.UserLeftMethod, Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}