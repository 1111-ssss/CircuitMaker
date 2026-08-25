using BLL.ResultPattern.Model;

namespace BLL.ResultPattern.Constraints;

public static class Errors
{
    public static Error ValidationFailed => new("ValidationFailed", "Validation failed");
}