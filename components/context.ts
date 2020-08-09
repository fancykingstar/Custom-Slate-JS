import { createContext } from 'react';

export enum CategorizerEasyToReverse {
  Easy = 'easy',
  Hard = 'hard',
}

export enum CategorizerEasyToCompare {
  Easy = 'easy',
  Hard = 'hard',
}

export enum CategorizerDataCompleteness {
  Most = 'most',
  Some = 'some',
}

export const CategorizerContext = createContext({
  easyToReverse: <CategorizerEasyToReverse | null>null,
  easyToCompare: <CategorizerEasyToCompare | null>null,
  dataCompleteness: <CategorizerDataCompleteness | null>null,
  setEasyToReverse: (easyToReverse: CategorizerEasyToReverse) => {
    // Do nothing.
  },
  setEasyToCompare: (easyToCompare: CategorizerEasyToCompare) => {
    // Do nothing.
  },
  setDataCompleteness: (dataCompleteness: CategorizerDataCompleteness) => {
    // Do nothing.
  },
});
