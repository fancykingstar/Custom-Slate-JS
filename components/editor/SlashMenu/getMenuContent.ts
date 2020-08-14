import fuzzy from 'fuzzy';
import stemmer from 'stemmer';

enum Category {
  Planning = 'Planning',
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

export enum MenuItemTitle {
  Categorizer = 'Categorizer',
  Choices = 'Choices',
  Comparison = 'Comparison of Choices',
  Goals = 'Goals',
  Inversion = 'Inversion',
  ProsCons = 'Pros / Cons',
  Simulation = 'Simulation Thinking',
}

export interface SlashMenuContent {
  suggestion: {
    text: string;
    item: MenuItem | null;
  } | null;
  items: MenuItem[];
  isFiltered: boolean;
}

interface Suggestion {
  text: string;
  keywords: string[];
  tool?: MenuItemTitle;
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
    title: MenuItemTitle.Choices,
    description: 'What are my options?',
    icon: '🌈',
    keywords: [],
  },
  {
    category: Category.Planning,
    title: MenuItemTitle.Goals,
    description: "What's the point?",
    icon: '⭐️',
    keywords: ['criteria'],
  },
  {
    category: Category.Planning,
    title: MenuItemTitle.Categorizer,
    description: 'Know how to treat this decision',
    icon: '🍎',
    keywords: ['type'],
  },
  {
    category: Category.Thinking,
    title: MenuItemTitle.Inversion,
    description: 'Flip your point of view',
    icon: '⏳',
    keywords: [],
  },
  {
    category: Category.Thinking,
    title: MenuItemTitle.Simulation,
    description: 'Predict the future you want',
    icon: '🧠',
    keywords: ['2nd Order Thinking'],
  },
  {
    category: Category.Comparing,
    title: MenuItemTitle.ProsCons,
    description: 'Simply compare each choice',
    keywords: [],
    icon: '🧾',
  },
  {
    category: Category.Comparing,
    title: MenuItemTitle.Comparison,
    description: 'Compare choices by criteria',
    icon: '🛒',
    keywords: ['Comparison Table'],
    comingSoon: true,
  },
];

const slashMenuSuggestions: Suggestion[] = [
  {
    text: "Hey there, hope you're enjoying Deca 👋",
    keywords: ['hey', 'hi', 'hello', 'heyo', "what's up?"],
  },
  {
    text: 'Check out the Choices tool! It can help you find new options.',
    keywords: ['choice', 'option'],
    tool: MenuItemTitle.Choices,
  },
  {
    text: 'A great place to start is the Categorizer tool.',
    keywords: [
      'start',
      'begin',
      'kick',
      'where',
      'set',
      'setup',
      'intro',
      'introduction',
    ],
    tool: MenuItemTitle.Categorizer,
  },
  {
    text: "Is it possible you've already made up your mind?",
    keywords: ['decide', 'decision', 'leap', 'choose', 'hard', ''],
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
    .filter((stem) => stem.length);

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

  // Use fuzzy search filtering of items
  // Loop through shorter and shorter queries until we find at least one match
  let filteredItems: MenuItem[] = [];
  for (let i = query.length; i > 0; i -= 1) {
    const trimmedQuery = query.slice(0, i);

    filteredItems = fuzzy
      .filter(trimmedQuery, slashMenuItems, {
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

    if (filteredItems.length) {
      break;
    }
  }

  // If there are no matches, then just show all tools
  if (!filteredItems.length) {
    filteredItems = slashMenuItems;
  }

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

  return {
    suggestion:
      suggestion != null
        ? {
            text: suggestion.text,
            item: suggestionMenuItem,
          }
        : null,
    items: filteredItems,
    isFiltered,
  };
}
