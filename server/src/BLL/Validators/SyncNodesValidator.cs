using BLL.Contracts;
using FluentValidation;

namespace BLL.Validators;

public class SyncNodesValidator : AbstractValidator<SyncNodesRequest>
{
    public SyncNodesValidator()
    {
        RuleFor(request => request.CircuitId)
            .NotEmpty()
            .WithMessage("CircuitId is required");

        RuleFor(request => request.Nodes)
            .NotEmpty()
            .WithMessage("Nodes is required");
    }
}