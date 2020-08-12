import { useEffect } from 'react';

/**
 * Prevent the user from accidentally closing or refreshing the prototype.
 */
export default function useConfirmExit(): void {
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, []);
}
