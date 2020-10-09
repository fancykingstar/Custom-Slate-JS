import { createContext } from 'react';

export enum DecisionCategory {
  ReversibleSimple = 'Reversible, Simple',
  ReversibleComplex = 'Reversible, Complex',

  // Non-reversible, complex
  NonreversibleSimple = 'Nonreversible, Simple',
  NonreversibleComplex = 'Nonreversible, Complex',
}

export type ContextType = {
  categorizer: {
    decisionCategory: DecisionCategory | null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDecisionCategory: (category: DecisionCategory | null) => void;
  };
  env: {
    openaiKey: string;
    openaiSecretKey: string;
  };
};

export const Context = createContext<ContextType>({
  categorizer: {
    decisionCategory: <DecisionCategory | null>null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDecisionCategory: (category: DecisionCategory | null) => {
      // Do nothing.
    },
  },
  env: {
    openaiKey: '',
    openaiSecretKey: '',
  },
});
