import { useRef, useEffect } from 'react';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// eslint-disable-next-line @typescript-eslint/ban-types
export default function useInterval(callback: Function, delay: number): void {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const savedCallback = useRef<Function>();

  if (savedCallback == null) {
    return;
  }

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current != null) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => {};
  }, [delay]);
}
