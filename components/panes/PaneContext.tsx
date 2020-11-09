import { useContext, createContext, Dispatch, SetStateAction } from 'react';

export enum PaneState {
  Collapsed,
  Expanded,
  Wide,
}

interface PaneContext {
  navPaneState: PaneState;
  setNavPaneState: Dispatch<SetStateAction<PaneState>>;

  expandedPanes: Array<string>;
  setExpandedPanes: Dispatch<SetStateAction<Array<string>>>;
}

export const PaneContext = createContext<PaneContext>({
  navPaneState: PaneState.Collapsed,
  setNavPaneState: () => {},

  expandedPanes: [],
  setExpandedPanes: () => {},
});

export function usePaneContext(): PaneContext {
  return useContext<PaneContext>(PaneContext);
}
