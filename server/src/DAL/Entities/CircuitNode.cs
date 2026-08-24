namespace DataAccess.Entities;

public class CircuitNode
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public Dictionary<string, object>? State { get; set; }
}