using DAL.Entities;

namespace DAL.Interfaces;

public interface ICircuitRepository
{
    Circuit Create(string name, string createdBy, CircuitSettings settings);
    Circuit? GetById(string id);
    IEnumerable<Circuit> GetAll();
    User? AddUser(string circuitId, User user);
    bool RemoveUser(string circuitId, string connectionId, out User? removedUser);
    void UpdateNodes(string circuitId, List<CircuitNode> nodes);
    void UpdateEdges(string circuitId, List<CircuitEdge> edges);
}