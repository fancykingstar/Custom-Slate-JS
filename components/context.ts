import { createContext } from 'react';

export enum DecisionCategory {
  Snap = 'snap',
  Timebox = 'timebox',
  Leap = 'leap',
  Deliberate = 'deliberate',
}

export const CategorizerContext = createContext({
  decisionCategory: <DecisionCategory | null>null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDecisionCategory: (category: DecisionCategory | null) => {
    // Do nothing.
  },
});
