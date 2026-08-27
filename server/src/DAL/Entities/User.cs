namespace DAL.Entities;

public class User
{
    public string ConnectionId { get; set; } = string.Empty;
    public string RawName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? CurrentCircuitId { get; set; }
}