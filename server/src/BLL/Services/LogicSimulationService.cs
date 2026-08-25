using BLL.Interfaces;
using DAL.Entities;

namespace BLL.Services;

public class LogicSimulationService : ILogicSimulationService
{
    public Dictionary<string, bool> RecalculateCircuit(Circuit circuit)
    {
        var nodeStates = new Dictionary<string, bool>();

        foreach (var node in circuit.Nodes.Where(n => n.Type == "inputNode"))
        {
            var isValueOn = node.State != null && 
                            node.State.TryGetValue("value", out var val) && 
                            Convert.ToBoolean(val);
            nodeStates[node.Id] = isValueOn;
        }

        bool changed;
        int maxIterations = 100;
        int iteration = 0;

        do
        {
            changed = false;
            iteration++;

            foreach (var node in circuit.Nodes.Where(n => n.Type != "inputNode"))
            {
                var incomingEdges = circuit.Edges.Where(e => e.TargetNodeId == node.Id).ToList();
                
                var inputValues = incomingEdges
                    .Select(e => nodeStates.TryGetValue(e.SourceNodeId, out var state) && state)
                    .ToList();

                bool newValue = EvaluateGate(node.Type, inputValues);

                if (!nodeStates.TryGetValue(node.Id, out var currentVal) || currentVal != newValue)
                {
                    nodeStates[node.Id] = newValue;
                    changed = true;
                }
            }
        } while (changed && iteration < maxIterations);

        return nodeStates;
    }

    private bool EvaluateGate(string gateType, List<bool> inputs)
    {
        if (inputs.Count == 0)
        {
            return false;
        }

        return gateType switch
        {
            "andGate"  => inputs.All(x => x),
            "orGate"   => inputs.Any(x => x),
            "notGate"  => !inputs.FirstOrDefault(),
            "nandGate" => !inputs.All(x => x),
            "norGate"  => !inputs.Any(x => x),
            "xorGate"  => inputs.Aggregate(false, (acc, next) => acc ^ next),
            "outputNode" => inputs.Any(x => x),
            _ => false
        };
    }
}