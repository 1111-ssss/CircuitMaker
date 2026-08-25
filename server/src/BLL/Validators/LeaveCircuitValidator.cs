using BLL.Contracts;
using FluentValidation;

namespace BLL.Validators;

public class LeaveCircuitValidator : AbstractValidator<LeaveCircuitRequest>
{
    public LeaveCircuitValidator()
    {
        RuleFor(request => request.ConnectionId)
            .NotEmpty()
            .WithMessage("ConnectionId is required");
    }
}