using DAL.Entities;

namespace BLL.Interfaces;

public interface ICircuitService
{
    Circuit Create(string name, string createdBy, CircuitSettings settings);
    Circuit? Get(string id);
    IEnumerable<Circuit> GetActive();
    User Join(string circuitId, string connectionId, string rawName);
    User? Leave(string connectionId);
    void SyncNodes(string circuitId, List<CircuitNode> nodes);
    void SyncEdges(string circuitId, List<CircuitEdge> edges);
}