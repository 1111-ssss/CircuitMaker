namespace BLL.Contracts;

public record JoinCircuitRequest(
    string CircuitId,
    string ConnectionId,
    string RawName
);