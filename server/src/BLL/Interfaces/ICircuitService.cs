using DAL.Entities;

namespace BLL.Interfaces;

public interface ICircuitService
{
    Circuit Create(string name, string createdBy, CircuitSettings settings);
    Circuit? Get(Guid id);
    IEnumerable<Circuit> GetActive();
    User Join(Guid circuitId, Guid connectionId, string rawName);
    User? Leave(Guid connectionId);
    void SyncNodes(Guid circuitId, List<CircuitNode> nodes);
    void SyncEdges(Guid circuitId, List<CircuitEdge> edges);
}