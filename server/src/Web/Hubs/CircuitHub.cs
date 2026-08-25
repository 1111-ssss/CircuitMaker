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

    public async Task JoinCircuit(string circuitId, string rawName)
    {
        var user = _circuitService.Join(circuitId, Context.ConnectionId, rawName);
        var circuit = _circuitService.Get(circuitId);

        if (circuit == null) {
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, circuitId);

        await Clients.Caller.SendAsync(
            CircuitHubConstants.JoinedCircuitMethod,
            new {
                AssignedName = user.DisplayName, 
                Circuit = circuit 
            }
        );

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.UserJoinedMethod,
            user
        );
    }

    public async Task UpdateNodes(string circuitId, List<CircuitNode> nodes)
    {
        _circuitService.SyncNodes(circuitId, nodes);

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.NodesUpdatedMethod,
            nodes
        );
    }

    public async Task UpdateEdges(string circuitId, List<CircuitEdge> edges)
    {
        _circuitService.SyncEdges(circuitId, edges);
        await Clients.OthersInGroup(circuitId).SendAsync("EdgesUpdated", edges);
    }

    public async Task SendCursorPosition(string circuitId, double x, double y)
    {
        await Clients.OthersInGroup(circuitId).SendAsync("CursorMoved", new {
            ConnectionId = Context.ConnectionId,
            X = x,
            Y = y
        });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = _circuitService.Leave(Context.ConnectionId);
        if (user != null && user.CurrentCircuitId != null)
        {
            await Clients.Group(user.CurrentCircuitId).SendAsync("UserLeft", Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}