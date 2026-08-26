using BLL.Contracts;
using BLL.Interfaces;
using DAL.Entities;
using Microsoft.AspNetCore.SignalR;
using DAL.Constants;

namespace Web.Hubs;

public class CircuitHub : Hub
{
    private readonly ICircuitService _circuitService;
    private readonly ILogicSimulationService _logicSimulationService;

    public CircuitHub(
        ICircuitService circuitService, 
        ILogicSimulationService logicSimulationService
    )
    {
        _circuitService = circuitService;
        _logicSimulationService = logicSimulationService;
    }

    public async Task JoinCircuit(string circuitId, string rawName)
    {
        var ct = Context.ConnectionAborted;

        var user = await _circuitService.Join(
            new JoinCircuitRequest(circuitId, Context.ConnectionId, rawName),
            ct
        );

        var circuit = await _circuitService.Get(
            new GetCircuitRequest(circuitId),
            ct
        );

        if (circuit.Value is null || user.Value is null)
        {
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, circuitId, ct);

        await Clients.Caller.SendAsync(
            CircuitHubConstants.JoinedCircuitMethod,
            new
            {
                AssignedName = user.Value.DisplayName,
                Circuit = circuit
            },
            cancellationToken: ct
        );

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.UserJoinedMethod,
            user,
            cancellationToken: ct
        );
    }

    public async Task UpdateNodes(string circuitId, List<CircuitNode> nodes)
    {
        var ct = Context.ConnectionAborted;
        await _circuitService.SyncNodes(new SyncNodesRequest(circuitId, nodes), ct);

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.NodesUpdatedMethod,
            nodes,
            cancellationToken: ct
        );
    }

    public async Task UpdateEdges(string circuitId, List<CircuitEdge> edges)
    {
        var ct = Context.ConnectionAborted;
        await _circuitService.SyncEdges(new SyncEdgesRequest(circuitId, edges), ct);
        
        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.EdgesUpdatedMethod,
            edges,
            cancellationToken: ct
        );
    }

    public async Task ToggleInput(string circuitId, string nodeId, bool value)
    {
        var ct = Context.ConnectionAborted;
        var circuit = await _circuitService.Get(
            new GetCircuitRequest(circuitId),
            ct
        );
        if (circuit.Value is null) {
            return;
        }

        var node = circuit.Value.Nodes.FirstOrDefault(n => n.Id == nodeId);
        if (node != null)
        {
            node.State ??= new Dictionary<string, object>();
            node.State["value"] = value;

            var updatedSignalStates = _logicSimulationService.RecalculateCircuit(circuit.Value);

            await Clients.Group(circuitId).SendAsync(
                CircuitHubConstants.SignalStateUpdated,
                updatedSignalStates,
                cancellationToken: ct
            );
        }
    }

    public async Task UpdateSettings(string circuitId, CircuitSettings newSettings)
    {
        var ct = Context.ConnectionAborted;
        var circuit = await _circuitService.Get(
            new GetCircuitRequest(circuitId),
            ct
        );
        if (circuit.Value is null)
        {
            return;
        }

        circuit.Value.Settings = newSettings;

        await Clients.OthersInGroup(circuitId).SendAsync(
            CircuitHubConstants.SettingsUpdated,
            newSettings,
            cancellationToken: ct
        );
    }

    public async Task SendCursorPosition(string circuitId, double x, double y)
    {
        await Clients.OthersInGroup(circuitId).SendAsync(CircuitHubConstants.CursorMovedMethod, new
        {
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
            await Clients.Group(user.Value.CurrentCircuitId).SendAsync(
                CircuitHubConstants.UserLeftMethod,
                Context.ConnectionId
            );
        }

        await base.OnDisconnectedAsync(exception);
    }
}