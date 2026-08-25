using System.Collections.Concurrent;
using DAL.Interfaces;
using DAL.Entities;
using DAL.Constants;

namespace DAL.Repositories;

public class InMemoryRepository : ICircuitRepository
{
    private readonly ConcurrentDictionary<string, Circuit> _circuits = new();
    private readonly ConcurrentDictionary<string, ConcurrentBag<string>> _roomNames = new();

    public Circuit Create(string name, string createdBy, CircuitSettings settings)
    {
        var circuit = new Circuit
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = name,
            CreatedBy = createdBy,
            Settings = settings
        };

        _circuits.TryAdd(circuit.Id, circuit);
        return circuit;
    }

    public Circuit? GetById(string id)
    {
        _circuits.TryGetValue(id, out var circuit);

        return circuit;
    }

    public IEnumerable<Circuit> GetAll()
    {
        return _circuits.Values;
    }

    public bool AddUser(string circuitId, User user)
    {
        if (!_circuits.TryGetValue(circuitId, out var circuit)) 
        {
            return false;
        }

        lock (circuit)
        {
            user.DisplayName = GenerateUniqueName(circuit, user.RawName);
            user.CurrentCircuitId = circuitId;
            circuit.ConnectedUsers[user.ConnectionId] = user;
        }

        return true;
    }

    public bool RemoveUser(string circuitId, string connectionId, out User? removedUser)
    {
        removedUser = null;
        if (_circuits.TryGetValue(circuitId, out var circuit))
        {
            lock (circuit)
            {
                if (circuit.ConnectedUsers.Remove(connectionId, out removedUser))
                {
                    return true;
                }
            }
        }

        return false;
    }

    public void UpdateNodes(string circuitId, List<CircuitNode> nodes)
    {
        if (_circuits.TryGetValue(circuitId, out var circuit))
        {
            circuit.Nodes = nodes;
        }
    }

    public void UpdateEdges(string circuitId, List<CircuitEdge> edges)
    {
        if (_circuits.TryGetValue(circuitId, out var circuit))
        {
            circuit.Edges = edges;
        }
    }

    private string GenerateUniqueName(Circuit circuit, string rawName)
    {
        var existingNames = circuit.ConnectedUsers.Values
            .Select(u => u.DisplayName)
            .ToHashSet();

        if (!existingNames.Contains(rawName))
        {
            return rawName;
        }

        int counter = CircuitRepositoryConstants.UNIQUE_NAME_START_COUNTER;
        while (existingNames.Contains($"{rawName} {counter}"))
        {
            counter++;
        }

        return $"{rawName} {counter}";
    }
}