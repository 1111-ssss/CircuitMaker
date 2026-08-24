namespace DataAccess.Entities;

public class CircuitEdge
{
    public string Id { get; set; } = string.Empty;
    public string SourceNodeId { get; set; } = string.Empty;
    public string SourceHandle { get; set; } = string.Empty;
    public string TargetNodeId { get; set; } = string.Empty;
    public string TargetHandle { get; set; } = string.Empty;
}