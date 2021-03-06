export type CompletionResult = {
  id: string;
  object: 'text_completion';
  created: number;
  model: 'string';
  choices: {
    text: string;
    index: string;
    logprobs: unknown;
    // eslint-disable-next-line camelcase
    finish_reason: string;
  }[];
};
