namespace DAL.Entities;

public class Circuit
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public CircuitSettings Settings { get; set; } = new();
    public List<CircuitNode> Nodes { get; set; } = new();
    public List<CircuitEdge> Edges { get; set; } = new();
    public Dictionary<string, User> ConnectedUsers { get; set; } = new();
}