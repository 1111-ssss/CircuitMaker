using DAL.Entities;

namespace BLL.Contracts;

public record CreateCircuitRequest(
    string Name,
    string CreatedBy,
    CircuitSettings? Settings
);