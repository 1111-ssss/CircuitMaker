using DataAccess.Entities;

namespace DAL.Interfaces;

public interface ICircuitRepository
{
    Circuit Create(string name, string createdBy, CircuitSettings settings);
    Circuit? GetById(Guid id);
    IEnumerable<Circuit> GetAll();
    bool AddUser(Guid circuitId, User user);
    bool RemoveUser(Guid circuitId, Guid connectionId, out User? removedUser);
    void UpdateNodes(Guid circuitId, List<CircuitNode> nodes);
    void UpdateEdges(Guid circuitId, List<CircuitEdge> edges);
}