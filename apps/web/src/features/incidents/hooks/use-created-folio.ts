import { useLocation } from 'react-router-dom';

function readCreatedFolio(state: unknown): string | null {
  if (typeof state !== 'object' || state === null || !('createdFolio' in state)) {
    return null;
  }

  return typeof state.createdFolio === 'string' ? state.createdFolio : null;
}

export function useCreatedFolio(): string | null {
  const location = useLocation();
  return readCreatedFolio(location.state);
}
