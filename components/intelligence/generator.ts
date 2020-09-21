import { getCompletion } from 'components/intelligence/gpt3/utility/completion/getCompletion';

export const MaxUserStringLength = 50;
export const MaxGeneratedTokenLength = 15;

function trimUserString(userString: string): string {
  if (userString.length <= MaxUserStringLength) {
    return userString.trim();
  }

  // TODO: detect better word boundary for other languages.
  return userString
    .substr(0, userString.lastIndexOf(' ', MaxUserStringLength))
    .trim();
}

const MinUserChoices = 1;
const MinUserGoals = 1;

export interface ChoiceInput {
  choices: string[];
  goals: string[];
  title: string;
}

function cleanChoiceInput(choiceInput: ChoiceInput): ChoiceInput {
  return {
    choices: choiceInput.choices.map((c) => trimUserString(c)).filter((c) => c),
    goals: choiceInput.goals.map((g) => trimUserString(g)).filter((g) => g),
    title: trimUserString(choiceInput.title),
  };
}

export function readyToGenerateChoice(
  input: ChoiceInput
): [boolean, ChoiceInput] {
  const cleanedInput = cleanChoiceInput(input);

  if (
    !cleanedInput.title.length ||
    cleanedInput.choices.length < MinUserChoices ||
    cleanedInput.goals.length < MinUserGoals
  ) {
    return [false, cleanedInput];
  }

  return [true, cleanedInput];
}

export function generateChoice(input: ChoiceInput): Promise<string> {
  const [ready, cleanedInput] = readyToGenerateChoice(input);
  if (!ready) {
    return Promise.reject(new Error('Not ready'));
  }

  let text = `I'm trying to figure out this serious decision: "${cleanedInput.title}". Here are my goals:\n\n`;
  cleanedInput.goals.forEach((g) => {
    text = text.concat(`Reasonable goal: ${g}\n`);
  });
  text = text.concat('\nHere are some of my choices:\n\n');

  cleanedInput.choices.forEach((c) => {
    text = text.concat(`Reasonable choice: ${c}\n`);
  });
  text = text.concat('Reasonable choice:');

  return getCompletion(
    text,
    {
      numChoices: 1,
      maxTokens: MaxGeneratedTokenLength,
      stop: '\n',
      temperature: 0.75,
      topProbability: 1,
    },
    {
      openAIKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
      openAISecretKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
    }
  );
}