using DAL.Entities;

namespace BLL.Interfaces;

public interface ILogicSimulationService
{
    Dictionary<string, bool> RecalculateCircuit(Circuit circuit);
}