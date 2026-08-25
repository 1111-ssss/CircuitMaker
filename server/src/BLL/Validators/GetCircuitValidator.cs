using BLL.Contracts;
using FluentValidation;

namespace BLL.Validators;

public class GetCircuitValidator : AbstractValidator<GetCircuitRequest>
{
    public GetCircuitValidator()
    {
        RuleFor(request => request.Id)
            .NotEmpty()
            .WithMessage("Id is required");
    }
}