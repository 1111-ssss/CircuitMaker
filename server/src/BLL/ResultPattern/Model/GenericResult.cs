namespace BLL.ResultPattern.Model;

public class Result<T> : BaseResult
{
    private readonly T? _value;
    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Can not access Value of a failed result.");

    public Result(T? value, Error? error = null) : base(error)
    {
        _value = value;
    }

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(Error error) => new(default, error);
    public static implicit operator Result(Result<T> result) => new(result.Error);
    public static implicit operator Result<T>(Result result) => new(default, result.Error);
}