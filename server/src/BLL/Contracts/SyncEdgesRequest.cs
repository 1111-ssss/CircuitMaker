using DAL.Entities;

namespace BLL.Contracts;

public record SyncEdgesRequest(
    string CircuitId,
    List<CircuitEdge> Edges
);