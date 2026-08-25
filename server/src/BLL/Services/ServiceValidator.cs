using BLL.Interfaces;
using BLL.ResultPattern.Model;
using FluentValidation;

namespace BLL.Services;

public class ServiceValidator : IServiceValidator
{
    private const string VALIDATION_FAILED_CODE = "ValidationFailed";
    private const string VALIDATION_FAILED_MESSAGE = "Validation failed: {0}";

    private readonly IServiceProvider _serviceProvider;

    public ServiceValidator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<Result> Validate<T>(T request)
    {
        var validator = (IValidator<T>?)_serviceProvider.GetService(typeof(IValidator<T>));

        if (validator == null)
        {
            return Result.Success();
        }

        var result = await validator.ValidateAsync(request);

        if (result.IsValid)
        {
            return Result.Success();
        }

        return Result.Failure(new Error(
            VALIDATION_FAILED_CODE,
            string.Format(
                VALIDATION_FAILED_MESSAGE, 
                result.Errors.First().ErrorMessage
            )
        ));
    }
}