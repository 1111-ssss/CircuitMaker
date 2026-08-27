using DAL.Entities;

namespace BLL.Contracts;

public record SyncNodesRequest(
    string CircuitId,
    List<CircuitNode> Nodes
);