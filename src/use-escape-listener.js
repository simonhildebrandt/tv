import { useCallback, useEffect } from 'react';

export default function useEscapeListener(callback) {
  const action = useCallback(event => {
    event.key == 'Escape' && callback();
  }, [callback]);

  useEffect(() => {
    window.addEventListener('keydown', action);
    return () => window.removeEventListener('keydown', action);
  }, [action])
}
