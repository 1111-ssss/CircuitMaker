using BLL.Contracts;
using FluentValidation;

namespace BLL.Validators;

public class CreateCircuitValidator : AbstractValidator<CreateCircuitRequest>
{
    public CreateCircuitValidator()
    {
        RuleFor(request => request.Name)
            .NotEmpty()
            .WithMessage("Name is required");

        RuleFor(request => request.CreatedBy)
            .NotEmpty()
            .WithMessage("CreatedBy is required");
    }
}