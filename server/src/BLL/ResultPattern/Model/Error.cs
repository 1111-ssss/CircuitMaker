using System.Net;

namespace BLL.ResultPattern.Model;

public record Error(
    string Code,
    string Message,
    HttpStatusCode StatusCode
);