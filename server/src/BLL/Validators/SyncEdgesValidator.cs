using BLL.Contracts;
using FluentValidation;

namespace BLL.Validators;

public class SyncEdgesValidator : AbstractValidator<SyncEdgesRequest>
{
    public SyncEdgesValidator()
    {
        RuleFor(request => request.CircuitId)
            .NotEmpty()
            .WithMessage("CircuitId is required");

        RuleFor(request => request.Edges)
            .NotEmpty()
            .WithMessage("Edges is required");
    }
}