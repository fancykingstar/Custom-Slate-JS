import { createContext } from 'react';

export enum DecisionCategory {
  // Reversible, simple
  Snap = 'Snap', // Deep understanding
  Dash = 'Dash', // Weak understanding

  // Reversible, complex
  Capstone = 'Capstone', // Deep understanding
  Puzzle = 'Puzzle', // Weak understanding

  // Non-reversible, simple
  Leap = 'Leap', // Deep understanding
  Parachute = 'Parachute', // Weak understanding

  // Non-reversible, complex
  Summit = 'Summit', // Deep understanding
  Mountain = 'Mountain', // Weak understanding
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
