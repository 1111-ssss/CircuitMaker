namespace DAL.Entities;

public class CircuitNode
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public Dictionary<string, object>? State { get; set; }
}