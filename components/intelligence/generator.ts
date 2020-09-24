import nlp from 'compromise';
import stemmer from 'stemmer';

import { getCompletion } from 'components/intelligence/gpt3/utility/completion/getCompletion';
import { sensitiveStems } from 'components/intelligence/sensitiveWords';

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

function containsSensitiveWords(s: string): boolean {
  const doc = nlp(s);
  const phrases = doc.terms().json(jsonOptions);

  for (let i = 0; i < phrases.length; i += 1) {
    const phrase = phrases[i];
    for (let j = 0; j < phrase.terms.length; j += 1) {
      const term = phrase.terms[j];
      const stem = stemmer(term.clean);
      if (sensitiveStems.has(stem)) {
        return true;
      }
    }
  }

  return false;
}

export function classifySensitive(userString: string): Promise<boolean> {
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
Text: Drive my card into someone
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
Text: ${userString.trim()}
Topic:`;

  return new Promise((resolve, reject) => {
    getCompletion(
      text,
      {
        numChoices: 3,
        maxTokens: MaxGeneratedTokenLength,
        stop: '\n',
        temperature: 0,
        topProbability: 1,
      },
      {
        openAIKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        openAISecretKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
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

function isSensitiveChoiceInput(choiceInput: ChoiceInput): boolean {
  for (let i = 0; i < choiceInput.choices.length; i += 1) {
    const choice = choiceInput.choices[i];
    if (containsSensitiveWords(choice)) {
      return true;
    }
  }

  for (let i = 0; i < choiceInput.goals.length; i += 1) {
    const goal = choiceInput.goals[i];
    if (containsSensitiveWords(goal)) {
      return true;
    }
  }

  if (containsSensitiveWords(choiceInput.title)) {
    return true;
  }

  return false;
}

export function readyToGenerateChoice(
  input: ChoiceInput
): [boolean, ChoiceInput] {
  const cleanedInput = cleanChoiceInput(input);

  if (isSensitiveChoiceInput(cleanedInput)) {
    return [false, cleanedInput];
  }

  if (
    !cleanedInput.title.length ||
    cleanedInput.choices.length < ChoiceConfig.minUserChoices ||
    cleanedInput.goals.length < ChoiceConfig.minUserGoals
  ) {
    return [false, cleanedInput];
  }

  return [true, cleanedInput];
}

export async function generateChoice(input: ChoiceInput): Promise<string> {
  const [ready, cleanedInput] = readyToGenerateChoice(input);
  if (!ready) {
    return Promise.reject(new Error('Not ready'));
  }

  for (let i = 0; i < input.choices.length; i += 1) {
    const choice = input.choices[i];
    // eslint-disable-next-line no-await-in-loop
    if (await classifySensitive(choice)) {
      return Promise.reject(new Error('Sensitive'));
    }
  }

  for (let i = 0; i < input.goals.length; i += 1) {
    const goal = input.goals[i];
    // eslint-disable-next-line no-await-in-loop
    if (await classifySensitive(goal)) {
      return Promise.reject(new Error('Sensitive'));
    }
  }

  if (await classifySensitive(input.title)) {
    return Promise.reject(new Error('Sensitive'));
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

function isSensitiveGoalInput(goalInput: GoalInput): boolean {
  for (let i = 0; i < goalInput.goals.length; i += 1) {
    const goal = goalInput.goals[i];
    if (containsSensitiveWords(goal)) {
      return true;
    }
  }

  if (containsSensitiveWords(goalInput.title)) {
    return true;
  }

  return false;
}

export function readyToGenerateGoal(input: GoalInput): [boolean, GoalInput] {
  const cleanedInput = cleanGoalInput(input);

  if (isSensitiveGoalInput(cleanedInput)) {
    return [false, cleanedInput];
  }

  if (
    !cleanedInput.title.length ||
    cleanedInput.goals.length < GoalConfig.minUserGoals
  ) {
    return [false, cleanedInput];
  }

  return [true, cleanedInput];
}

export async function generateGoal(input: GoalInput): Promise<string> {
  const [ready, cleanedInput] = readyToGenerateGoal(input);
  if (!ready) {
    return Promise.reject(new Error('Not ready'));
  }

  for (let i = 0; i < input.goals.length; i += 1) {
    const goal = input.goals[i];
    // eslint-disable-next-line no-await-in-loop
    if (await classifySensitive(goal)) {
      return Promise.reject(new Error('Sensitive'));
    }
  }

  if (await classifySensitive(input.title)) {
    return Promise.reject(new Error('Sensitive'));
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
      openAIKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
      openAISecretKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
    }
  );
}

function cleanUserInput(goalInput: GoalInput): GoalInput {
  return {
    goals: goalInput.goals.map((g) => trimUserString(g)).filter((g) => g),
    title: trimUserString(goalInput.title),
  };
}
