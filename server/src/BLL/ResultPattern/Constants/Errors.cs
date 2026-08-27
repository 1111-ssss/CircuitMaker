using BLL.ResultPattern.Model;
using System.Net;

namespace BLL.ResultPattern.Constants;

public static class Errors
{
    public static Error ValidationFailed => new("ValidationFailed", "Validation failed", HttpStatusCode.BadRequest);
}