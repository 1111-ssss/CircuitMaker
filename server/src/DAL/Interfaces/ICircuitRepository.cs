using DataAccess.Entities;

namespace DAL.Interfaces;

public interface ICircuitRepository
{
    Circuit CreateCircuit(string name, string createdBy, CircuitSettings settings);
    Circuit? GetById(Guid id);
    IEnumerable<Circuit> GetAll();
    bool AddUserToCircuit(Guid circuitId, User user);
    bool RemoveUserFromCircuit(Guid circuitId, Guid connectionId, out User? removedUser);
    void UpdateNodes(Guid circuitId, List<CircuitNode> nodes);
    void UpdateEdges(Guid circuitId, List<CircuitEdge> edges);
}