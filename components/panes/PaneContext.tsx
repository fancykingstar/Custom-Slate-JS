import { useContext, createContext, Dispatch, SetStateAction } from 'react';

interface PaneContext {
  expandedPanes: Array<string>;
  setExpandedPanes: Dispatch<SetStateAction<Array<string>>>;
}

export const PaneContext = createContext<PaneContext>({
  expandedPanes: [],
  setExpandedPanes: () => {},
});

export function usePaneContext(): PaneContext {
  return useContext<PaneContext>(PaneContext);
}
