import nlp from 'compromise';
import stemmer from 'stemmer';

import { ContextType } from 'components/context';
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

const jsonOptions = {
  normal: true,
  reduced: true,
  text: true,
  trim: true,
  terms: {
    clean: true,
    normal: true,
    offset: true,
    text: true,
  },
};

export function classifySensitive(
  context: ContextType,
  userString: string
): Promise<boolean> {
  const text = `Text: Should I move to Texas?
Topic: OK
Text: Should I off myself
Topic: Sensitive
Text: Whether to commit suicide
Topic: Sensitive
Text: Wrap a plastic bag around my head
Topic: Sensitive
Text: What project to work on next quarter
Topic: OK
Text: Take a ton of pills tonight
Topic: Sensitive
Text: Jump off a tall building
Topic: Sensitive
Text: Drive my car into someone
Topic: Sensitive
Text: How much should I spend on the house?
Topic: OK
Text: How many people to hire next quarter
Topic: OK
Text: Want to kill my neighbor
Topic: Sensitive
Text: Shooting up my school
Topic: Sensitive
Text: Take a gun to school
Topic: Sensitive
Text: Send a bomb in the mail
Topic: Sensitive
Text: Have sex with a lot of people
Topic: Sensitive
Text: Do anal
Topic: Sensitive
Text: Where to go for skiing
Topic: OK
Text: One night stand
Topic: Sensitive
Text: How many people to fuck
Topic: Sensitive
Text: Should I get laid tonight
Topic: Sensitive
Text: Who should I vote for
Topic: Sensitive
Text: Watch the presidential debate tonight
Topic: Sensitive
Text: Go to BLM protest
Topic: Sensitive
Text: Prioritize user-facing features
Topic: OK
Text: Annoy a libtard snowflake
Topic: Sensitive
Text: Lock her up
Topic: Sensitive
Text: ${userString.trim()}
Topic:`;

  return new Promise((resolve, reject) => {
    getCompletion(
      text,
      {
        numChoices: 1,
        maxTokens: MaxGeneratedTokenLength,
        stop: '\n',
        temperature: 0,
        topProbability: 1,
      },
      {
        openAIKey: context.env.openaiKey,
        openAISecretKey: context.env.openaiSecretKey,
      }
    ).then(
      (v) => {
        const trimmedV = v.trim();
        if (trimmedV === 'OK') {
          resolve(false);
        } else {
          resolve(true);
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}

const ChoiceConfig = {
  minUserChoices: 1,
  minUserGoals: 1,
};

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
    cleanedInput.choices.length < ChoiceConfig.minUserChoices ||
    cleanedInput.goals.length < ChoiceConfig.minUserGoals
  ) {
    return [false, cleanedInput];
  }

  return [true, cleanedInput];
}

export async function generateChoice(
  context: ContextType,
  input: ChoiceInput
): Promise<string> {
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
      openAIKey: context.env.openaiKey,
      openAISecretKey: context.env.openaiSecretKey,
    }
  );
}

const GoalConfig = {
  minUserGoals: 1,
};

export interface GoalInput {
  goals: string[];
  title: string;
}

function cleanGoalInput(goalInput: GoalInput): GoalInput {
  return {
    goals: goalInput.goals.map((g) => trimUserString(g)).filter((g) => g),
    title: trimUserString(goalInput.title),
  };
}

export function readyToGenerateGoal(input: GoalInput): [boolean, GoalInput] {
  const cleanedInput = cleanGoalInput(input);

  if (
    !cleanedInput.title.length ||
    cleanedInput.goals.length < GoalConfig.minUserGoals
  ) {
    return [false, cleanedInput];
  }

  return [true, cleanedInput];
}

export async function generateGoal(
  context: ContextType,
  input: GoalInput
): Promise<string> {
  const [ready, cleanedInput] = readyToGenerateGoal(input);
  if (!ready) {
    return Promise.reject(new Error('Not ready'));
  }

  let text = `I'm trying to figure out this serious decision: "${cleanedInput.title}". Here are my goals:\n\n`;
  cleanedInput.goals.forEach((g) => {
    text = text.concat(`Reasonable goal: ${g}\n`);
  });
  text = text.concat('Reasonable goal:');

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
      openAIKey: context.env.openaiKey,
      openAISecretKey: context.env.openaiSecretKey,
    }
  );
}

function cleanUserInput(goalInput: GoalInput): GoalInput {
  return {
    goals: goalInput.goals.map((g) => trimUserString(g)).filter((g) => g),
    title: trimUserString(goalInput.title),
  };
}
