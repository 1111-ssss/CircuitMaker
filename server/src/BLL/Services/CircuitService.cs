using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Entities;
using BLL.Contracts;
using BLL.ResultPattern.Model;

namespace BLL.Services;

public class CircuitService : ICircuitService
{
    private readonly ICircuitRepository _repository;
    private readonly IServiceValidator _validator;

    public CircuitService(
        ICircuitRepository repository,
        IServiceValidator validator
    )
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<Result<Circuit>> Create(CreateCircuitRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.Validate(request, cancellationToken);
        if (!validationResult.IsSuccess)
        {
            return Result.Failure(validationResult.Error!);
        }

        var circuit = _repository.Create(
            request.Name,
            request.CreatedBy,
            request.Settings ?? new()
        );

        return Result<Circuit>.Success(circuit);
    }

    public async Task<Result<Circuit?>> Get(GetCircuitRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.Validate(request, cancellationToken);
        if (!validationResult.IsSuccess)
        {
            return Result.Failure(validationResult.Error!);
        }

        var circuit = _repository.GetById(request.Id);

        return Result<Circuit?>.Success(circuit);
    }

    public Result<IEnumerable<Circuit>> GetActive()
    {
        return Result<IEnumerable<Circuit>>.Success(_repository.GetAll());
    }

    public async Task<Result<User>> Join(JoinCircuitRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.Validate(request, cancellationToken);
        if (!validationResult.IsSuccess)
        {
            return Result.Failure(validationResult.Error!);
        }

        var user = new User { ConnectionId = request.ConnectionId, RawName = request.RawName };
        _repository.AddUser(request.CircuitId, user);

        return Result<User>.Success(user);
    }

    public async Task<Result<User?>> Leave(LeaveCircuitRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.Validate(request, cancellationToken);
        if (!validationResult.IsSuccess)
        {
            return Result.Failure(validationResult.Error!);
        }

        foreach (var circuit in _repository.GetAll())
        {
            if (circuit.ConnectedUsers.ContainsKey(request.ConnectionId))
            {
                _repository.RemoveUser(circuit.Id, request.ConnectionId, out var user);

                return Result<User?>.Success(user);
            }
        }

        return Result<User?>.Success(null);
    }
    
    public async Task<Result> SyncNodes(SyncNodesRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.Validate(request, cancellationToken);
        if (!validationResult.IsSuccess)
        {
            return Result.Failure(validationResult.Error!);
        }
        
        _repository.UpdateNodes(request.CircuitId, request.Nodes);
        return Result.Success();
    }

    public async Task<Result> SyncEdges(SyncEdgesRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.Validate(request, cancellationToken);
        if (!validationResult.IsSuccess)
        {
            return Result.Failure(validationResult.Error!);
        }

        _repository.UpdateEdges(request.CircuitId, request.Edges);
        return Result.Success();
    }
}