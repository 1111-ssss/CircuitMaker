using BLL.Contracts;
using BLL.ResultPattern.Model;
using DAL.Entities;

namespace BLL.Interfaces;

public interface ICircuitService
{
    Task<Result<Circuit>> Create(CreateCircuitRequest request, CancellationToken cancellationToken);
    Task<Result<Circuit?>> Get(GetCircuitRequest request, CancellationToken cancellationToken);
    Result<IEnumerable<Circuit>> GetActive();
    Task<Result<User>> Join(JoinCircuitRequest request, CancellationToken cancellationToken);
    Task<Result<User?>> Leave(LeaveCircuitRequest request, CancellationToken cancellationToken);
    Task<Result> SyncNodes(SyncNodesRequest request, CancellationToken cancellationToken);
    Task<Result> SyncEdges(SyncEdgesRequest request, CancellationToken cancellationToken);
}