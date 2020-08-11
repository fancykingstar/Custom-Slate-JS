import { createContext } from 'react';

export enum DecisionCategory {
  Fast = 'fast',
  Early = 'early',
  Close = 'close',
  Deliberate = 'deliberate',
}

export const CategorizerContext = createContext({
  decisionCategory: <DecisionCategory | null>null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDecisionCategory: (category: DecisionCategory | null) => {
    // Do nothing.
  },
});
