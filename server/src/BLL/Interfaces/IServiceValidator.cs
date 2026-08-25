using BLL.ResultPattern.Model;

namespace BLL.Interfaces;

public interface IServiceValidator
{
    Task<Result> Validate<T>(T request, CancellationToken cancellationToken = default);
}