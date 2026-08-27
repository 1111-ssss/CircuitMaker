namespace BLL.ResultPattern.Model;

public class Result : BaseResult
{
    public Result(Error? error = null) : base(error) { }

    public static Result Success() => new();
    public static Result Failure(Error error) => new(error);
}