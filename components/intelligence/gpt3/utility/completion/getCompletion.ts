import axios from 'axios';
import mapKeys from 'lodash/mapKeys';

import { openAIConfiguration } from '../../config/openAIConfiguration';
import { CompletionResult } from '../../types/CompletionResult';
import { removeLastSentence } from '../string/removeLastSentence';
import { completionKeyTranslations } from './literals/completionKeyTranslations';
import { CompletionOptions } from './types/CompletionOptions';

export type AuthOptions = {
  openAIKey: string;
  openAISecretKey: string;
};

export async function getCompletion(
  prompt: string,
  options: Partial<CompletionOptions> = {},
  authOptions: Partial<AuthOptions> = {}
): Promise<string> {
  const translatedOptions = mapKeys(
    options,
    (_x, key) => completionKeyTranslations[key as keyof CompletionOptions]
  );

  const authKey = authOptions?.openAISecretKey ?? openAIConfiguration.secretKey;

  if (!authKey) {
    throw new TypeError(
      'MISSING SECRET KEY: Either specify secret key in environment, or pass in as auth parameter'
    );
  }

  const completionResult = (
    await axios.post(
      openAIConfiguration.engineCompletionEndpoint,
      {
        prompt,
        ...translatedOptions,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authKey}`,
        },
      }
    )
  ).data as CompletionResult;

  if (!completionResult.choices.length) {
    return '';
  }

  return completionResult.choices[0].text;
}
