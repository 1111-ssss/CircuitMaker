namespace DataAccess.Entities;

public class Circuit
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public CircuitSettings Settings { get; set; } = new();
    public List<CircuitNode> Nodes { get; set; } = new();
    public List<CircuitEdge> Edges { get; set; } = new();
    public Dictionary<Guid, User> ConnectedUsers { get; set; } = new();
}