using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Entities;

namespace BLL.Services;

public class CircuitService : ICircuitService
{
    private readonly ICircuitRepository _repository;

    public CircuitService(ICircuitRepository repository)
    {
        _repository = repository;
    }

    public Circuit Create(string name, string createdBy, CircuitSettings settings)
    {
        return _repository.Create(name, createdBy, settings);
    }

    public Circuit? Get(string id)
    {
        return _repository.GetById(id);
    }

    public IEnumerable<Circuit> GetActive()
    {
        return _repository.GetAll();
    }

    public User Join(string circuitId, string connectionId, string rawName)
    {
        var user = new User { ConnectionId = connectionId, RawName = rawName };
        _repository.AddUser(circuitId, user);

        return user;
    }

    public User? Leave(string connectionId)
    {
        foreach (var circuit in _repository.GetAll())
        {
            if (circuit.ConnectedUsers.ContainsKey(connectionId))
            {
                _repository.RemoveUser(circuit.Id, connectionId, out var user);

                return user;
            }
        }

        return null;
    }

    public void SyncNodes(string circuitId, List<CircuitNode> nodes)
    {
        _repository.UpdateNodes(circuitId, nodes);
    }

    public void SyncEdges(string circuitId, List<CircuitEdge> edges)
    {
        _repository.UpdateEdges(circuitId, edges);
    }
}