namespace DataAccess.Entities;

public class User
{
    public Guid ConnectionId { get; set; }
    public string RawName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public Guid? CurrentCircuitId { get; set; }
}