using BLL.Contracts;
using FluentValidation;

namespace BLL.Validators;

public class JoinCircuitValidator : AbstractValidator<JoinCircuitRequest>
{
    public JoinCircuitValidator()
    {
        RuleFor(request => request.CircuitId)
            .NotEmpty()
            .WithMessage("CircuitId is required");

        RuleFor(request => request.ConnectionId)
            .NotEmpty()
            .WithMessage("ConnectionId is required");

        RuleFor(request => request.RawName)
            .NotEmpty()
            .WithMessage("RawName is required");
    }
}