import fuzzy from 'fuzzy';
import stemmer from 'stemmer';

enum Category {
  Planning = 'Planning',
  Context = 'Context',
  Thinking = 'Thinking',
  Comparing = 'Comparing',
}

export interface MenuItem {
  category: Category;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
  comingSoon?: boolean;
}

export enum ToolName {
  Categorizer = 'Categorizer',
  Choices = 'Choices',
  Conclusion = 'Conclusion',
  Comparison = 'Comparison of Choices',
  Data = 'Data',
  Emotion = 'Emotion',
  Goals = 'Goals',
  Inversion = 'Inversion',
  IssueTree = 'Issue Tree',
  People = 'People',
  ProsCons = 'Pros / Cons',
  Simulation = 'Simulation Thinking',
}

export interface SlashMenuContent {
  suggestion: {
    text: string | null;
    item: MenuItem | null;
  } | null;
  items: MenuItem[];
  isFiltered: boolean;
}

interface Suggestion {
  text: string;
  keywords: string[];
  tool?: ToolName;
}

interface StemMatch {
  stem: string;
  keywords: string[];
}

interface SuggestionMatch {
  suggestion: Suggestion;
  matches: StemMatch[];
}

const slashMenuItems: MenuItem[] = [
  {
    category: Category.Planning,
    title: ToolName.Choices,
    description: 'What are my options?',
    icon: '🌈',
    keywords: [],
  },
  {
    category: Category.Planning,
    title: ToolName.Goals,
    description: "What's the point?",
    icon: '⭐️',
    keywords: ['criteria'],
  },
  {
    category: Category.Planning,
    title: ToolName.Categorizer,
    description: 'Know how to treat this decision',
    icon: '🍎',
    keywords: ['type'],
  },
  {
    category: Category.Planning,
    title: ToolName.Conclusion,
    description: "When you've made your decision",
    icon: '✒️',
    keywords: ['complete', 'conclusion', 'end', 'finish'],
  },
  {
    category: Category.Thinking,
    title: ToolName.Inversion,
    description: 'Flip your point of view',
    icon: '⏳',
    keywords: [],
  },
  {
    category: Category.Thinking,
    title: ToolName.Simulation,
    description: 'Predict the future you want',
    icon: '🧠',
    keywords: ['2nd Order Thinking'],
  },
  {
    category: Category.Thinking,
    title: ToolName.IssueTree,
    description: 'Organize problems & solutions',
    icon: '🌳',
    keywords: ['how issue mckinsey why'],
  },
  {
    category: Category.Context,
    title: ToolName.People,
    description: 'Who should be involved?',
    icon: '🧑🏾‍🚀',
    keywords: ['person', 'team'],
  },
  {
    category: Category.Context,
    title: ToolName.Data,
    description: 'What do I know? Need to know?',
    icon: '💎',
    keywords: ['fact'],
  },
  {
    category: Category.Context,
    title: ToolName.Emotion,
    description: 'How do you feel?',
    icon: '🎭',
    keywords: [],
  },
  {
    category: Category.Comparing,
    title: ToolName.ProsCons,
    description: 'Simply compare each choice',
    keywords: [],
    icon: '🧾',
  },
  {
    category: Category.Comparing,
    title: ToolName.Comparison,
    description: 'Compare choices by criteria',
    icon: '🛒',
    keywords: ['Comparison Table'],
    comingSoon: true,
  },
];

const slashMenuSuggestions: Suggestion[] = [
  {
    text: "Hey there, hope you're enjoying Deca 👋",
    keywords: ['hey', 'hi', 'hello', 'heyo'],
  },
  {
    text: 'Deca is a new kind of doc that helps you make decisions!',
    keywords: ['deca'],
  },
  {
    text: 'Check out the Choices tool! It can help you find new options.',
    keywords: [
      'what',
      'choices',
      'figuring',
      'out',
      'options',
      'know',
      'alternative',
      'find',
      'new',
      'opportunity',
      'creative',
      'pick',
      'vote',
      'cull',
      'eliminate',
      'verdict',
      'list',
      'problem',
      'solve',
    ],
    tool: ToolName.Choices,
  },
  {
    text: 'A great place to start is the Categorizer tool.',
    keywords: [
      'can',
      'could',
      'start',
      'begin',
      'kick',
      'where',
      'set',
      'setup',
      'intro',
      'introduction',
    ],
    tool: ToolName.Categorizer,
  },
  {
    text: "Is it possible you've already made up your mind?",
    keywords: ['decide', 'decision', 'leap', 'choose', 'hard'],
  },
  {
    text:
      'Your decision is like an onion. Each thought and tool reveals something new.',
    keywords: [
      'help',
      'stuck',
      'trouble',
      'unhelpful',
      'unsure',
      'hard',
      'difficult',
    ],
  },
  {
    text: "The goals tool can help you figure out what you're trying to do.",
    keywords: [
      'know',
      'question',
      'query',
      'unsure',
      'what',
      'goals',
      'define',
      'explore',
      'purpose',
      'point',
    ],
    tool: ToolName.Goals,
  },
  {
    text: 'It might be helpful to work on this decision with someone!',
    keywords: [
      'collaborate',
      'share',
      'partner',
      'team',
      'alone',
      'solo',
      'isolated',
      'unsure',
      'who',
    ],
  },
  {
    text:
      'The categorizer tool can help you know what kind of decision this is.',
    keywords: [
      'category',
      'type',
      'kind',
      'what',
      'character',
      'nature',
      'sort',
      'variety',
      'description',
      'classify',
      'class',
      'genre',
      'taxonomy',
    ],
    tool: ToolName.Categorizer,
  },
  {
    text:
      'It might be worthwhile to explore how you feel. Are you avoiding any thoughts? If so, why?',
    keywords: [
      'bias',
      'emotion',
      'anger',
      'sad',
      'happy',
      'joy',
      'happiness',
      'concern',
      'empathy',
      'excited',
      'feeling',
      'sad',
      'grief',
      'love',
      'passion',
      'pride',
      'rage',
      'remorse',
      'unsure',
      'sentiment',
      'shame',
      'sorrow',
      'support',
      'social',
      'people',
      'fallacy',
      'right',
      'risk',
      'worried',
      'worry',
      'willing',
      'take',
      'personal',
      'illogical',
      'logical',
    ],
  },
  {
    text:
      'Is there any data or assumptions that would be helpful to write down?',
    keywords: [
      'right',
      'info',
      'advice',
      'clue',
      'instruction',
      'material',
      'report',
      'wisdom',
      'domain',
      'knowledge',
      'need',
      'assumptions',
      'list',
      'data',
      'helpful',
      'talk',
      'who',
      'impacted',
      'sources',
      'information',
      'help',
    ],
  },
  {
    text:
      'The simulation tool can help you explore the potential consequences of choices.',
    keywords: [
      'might',
      'could',
      'will',
      'shall',
      'should',
      'going',
      'happen',
      'consequences',
      'aftereffect',
      'aftermath',
      'effect',
      'affect',
      'issues',
      'reaction',
      'result',
      'unsure',
      'cause',
      'origin',
      'source',
      'probability',
      'chance',
      'likelihood',
      'opportunity',
      'feasibility',
      'odds',
      'possibility',
      'possible',
      'prospect',
      'predict',
      'imagine',
      'simulation',
      'explore',
      'future',
      'present',
      'past',
      'what',
      'if',
    ],
    tool: ToolName.Simulation,
  },
  {
    text:
      'It could be helpful to write down the people who can help fill in the missing parts of this decision.',
    keywords: [
      'who',
      'should',
      'talk',
      'to',
      'person',
      'could',
      'conversation',
      'reach',
      'out',
      'helpful',
      'meet',
      'chat',
      'say',
      'speak',
      'tell',
      'session',
      'call',
      'video',
      'phone',
    ],
  },
  {
    text:
      "It sounds like you think there are things you know you don't know. Are there people or sources of info that can help?",
    keywords: [
      'unknown',
      'unfamiliar',
      'unnamed',
      'unidentified',
      'new',
      'unclear',
      'lost',
      'uncertain',
    ],
  },
  {
    text: 'The Pros / Cons tool is helpful for a basic comparison of choices.',
    keywords: [
      'pros',
      'cons',
      'positive',
      'negative',
      'distinguish',
      'relate',
      'equate',
      'match',
      'correlate',
      'similarity',
      'difference',
      'compare',
      'criteria',
      'choices',
      'how',
      'table',
      'comparison',
      'judge',
      'contrast',
      'analyze',
      'exhaust',
      'correlate',
      'grid',
      'chart',
      'list',
      'connect',
      'link',
    ],
    tool: ToolName.ProsCons,
  },
  {
    text:
      'The Inversion tool helps you look at your decision from a completely different perspective.',
    keywords: [
      'worst',
      'choice',
      'invert',
      'think',
      'broad',
      'expand',
      'new',
      'novel',
      'insight',
      'reverse',
      'more',
      'better',
      'worse',
      'alternative',
      'way',
      'different',
      'perspective',
      'completely',
      'radical',
      'push',
      'point',
      'view',
      'flip',
      'understand',
    ],
    tool: ToolName.Inversion,
  },
  {
    text: "Is it possible you've already made up your mind?",
    keywords: [
      'leap',
      'make',
      'jump',
      'unsure',
      'uncertain',
      'made',
      'mind',
      'timid',
      'afraid',
      'scared',
      'commit',
      'gut',
      'generally',
    ],
  },
  {
    text:
      "Eliminate choices as early as you can. If you can't, a quick breather or a new tool can help!",
    keywords: ['which', 'help', 'me', 'decide', 'pick', 'choose'],
  },
  {
    text:
      "If you can't make a leap just yet, a quick look through the tools you've used can help.",
    keywords: [
      'when',
      'should',
      'can',
      'complete',
      'mark',
      'decision',
      'finish',
      'stop',
    ],
  },
  {
    text:
      'There is a balance to strike between pure rationality and your instincts.',
    keywords: [
      'rational',
      'analytical',
      'deliberate',
      'impartial',
      'wise',
      'logical',
      'intelligent',
      'judicious',
      'levelheaded',
      'intellect',
      'objective',
    ],
  },
  {
    text:
      'Listening to your gut could be helpful. Your mental model might be trying to say something!',
    keywords: ['subjective', 'personal', 'feeling'],
  },
];

function getSuggestionMatches(
  suggestions: Suggestion[],
  stems: string[]
): SuggestionMatch[] {
  return suggestions.reduce((matchList: SuggestionMatch[], suggestion) => {
    let { keywords } = suggestion;

    // Get stems of keywords as well
    keywords = keywords.map((keyword) => stemmer(keyword));

    // Go through each stem to look for matching keywords
    const stemMatches: StemMatch[] = stems.reduce((stemMatchList, stem) => {
      const matchingKeywords = fuzzy
        .filter(stem, keywords)
        // Arbitrary match score
        .filter((match) => match.score > 10)
        .map((match) => match.original);

      if (matchingKeywords.length) {
        stemMatchList.push({
          stem,
          keywords: matchingKeywords,
        });
      }

      return stemMatchList;
    }, [] as StemMatch[]);

    if (stemMatches.length) {
      matchList.push({
        suggestion,
        matches: stemMatches,
      });
    }

    return matchList;
  }, []);
}

export default function getMenuContent(query: string | null): SlashMenuContent {
  if (query == null) {
    return {
      suggestion: null,
      items: slashMenuItems,
      isFiltered: false,
    };
  }

  // Extract all words from the query
  const stems = query
    .split(' ')
    .map((word) => stemmer(word))
    // Filter empty stems
    .filter((stem) => stem.length)
    // Remove punctuation
    .map((stem) => stem.replace(/\W/g, ''));

  // Go through all available suggestions to look for matches
  const suggestionMatches = getSuggestionMatches(slashMenuSuggestions, stems);

  // Find the suggestion with the most matching keywords
  const suggestionMatchWithMostMatches = suggestionMatches.reduce(
    (suggestionMatch: SuggestionMatch | null, suggestion) => {
      if (suggestionMatch == null) {
        return suggestion;
      }

      const prevKeywordCount = suggestionMatch.matches.reduce(
        (count, match) => count + match.keywords.length,
        0
      );

      const newKeywordCount = suggestion.matches.reduce(
        (count, match) => count + match.keywords.length,
        0
      );

      return newKeywordCount > prevKeywordCount ? suggestion : suggestionMatch;
    },
    null
  );

  const suggestion = suggestionMatchWithMostMatches?.suggestion ?? null;

  let filteredItems = fuzzy
    .filter(query, slashMenuItems, {
      extract: (item) =>
        [
          item.title,
          item.description,
          item.category,
          item.keywords.join(' '),
        ].join(' '),
    })
    .map((item) => item.original)
    .flat();

  // If suggestion tool exists in filtered items, move to top
  if (suggestion != null && suggestion.tool != null) {
    const matchIndex = filteredItems.findIndex(
      (item) => item.title === suggestion.tool
    );

    // Move tool to top if it exists
    if (matchIndex > -1) {
      const removedItem = filteredItems.splice(matchIndex, 1);
      filteredItems.unshift(...removedItem);
    } else {
      // Add tool to top if it doesn't exist
      const newItem = slashMenuItems.find(
        (item) => item.title === suggestion.tool
      );
      if (newItem != null) {
        filteredItems.unshift(newItem);
      }
    }
  }

  const suggestionMenuItem =
    slashMenuItems.find((item) => item.title === suggestion?.tool) ?? null;

  const isFiltered = query.length > 0;

  // If list is filtered, remove any coming soon items
  if (isFiltered) {
    filteredItems = filteredItems.filter((item) => item.comingSoon == null);
  }

  let outputSuggestion: {
    text: string | null;
    item: MenuItem | null;
  } | null =
    suggestion != null
      ? {
          text: suggestion.text,
          item: suggestionMenuItem,
        }
      : null;

  // If we have no suggestion, say so
  if (query.length && outputSuggestion == null) {
    outputSuggestion = {
      text: null,
      item: null,
    };
  }

  return {
    suggestion: outputSuggestion,
    items: filteredItems,
    isFiltered,
  };
}
