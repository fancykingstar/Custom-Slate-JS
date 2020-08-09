import { createContext } from 'react';

export enum CategorizerReversibility {
  Reversible = 'reversible',
  NonReversible = 'non-reversibile',
}

export enum CategorizerUnderstanding {
  Deep = 'deep',
  Weak = 'weak',
}

export const CategorizerContext = createContext({
  reversibility: <CategorizerReversibility | null>null,
  understanding: <CategorizerUnderstanding | null>null,
  setReversibility: (reversibility: CategorizerReversibility) => {
    // Do nothing.
  },
  setUnderstanding: (understanding: CategorizerUnderstanding) => {
    // Do nothing.
  },
});
