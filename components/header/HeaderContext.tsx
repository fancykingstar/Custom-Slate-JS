import { useContext, createContext, Dispatch, SetStateAction } from 'react';

interface HeaderContext {
  setViewMode: Dispatch<SetStateAction<string>>;
  setViewableElements: Dispatch<SetStateAction<Array<string>>>;
  viewMode: string;
  viewableElements: Array<string>;
}

export const HeaderContext = createContext<HeaderContext>({
  setViewMode: () => {},
  setViewableElements: () => {},
  viewMode: 'private',
  viewableElements: [],
});

export const useHeaderContext = () => useContext(HeaderContext);
