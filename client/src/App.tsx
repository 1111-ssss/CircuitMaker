import { useCircuitStore } from './store/useCircuitStore';
import { LobbyPage } from './pages/LobbyPage';
import { CircuitPage } from './pages/CircuitPage';

export default function App() {
  const { circuitId } = useCircuitStore();

  if (!circuitId) {
    return <LobbyPage />;
  }

  return <CircuitPage />;
}