import { useEffect } from 'react';
import { Editor, Node, NodeEntry, Path, Range, Text } from 'slate';
import { useEditor } from 'slate-react';
import { getAllTextNodes } from 'components/editor/queries';
import { add, isAfter } from 'date-fns';
import nlp from 'compromise';
import lemmatize from 'wink-lemmatizer';
import { frequency } from 'components/intelligence/frequency';
import { stopwords } from 'components/intelligence/stopwords';

interface IndexState {
  whenIndexedMillis: number | null;

  index: Index;

  rank: Rank;
  scores: Scores;
  paths: Paths;

  sentenceScores: SentenceScores;
}

interface SentenceScores {
  [path: string]: ScoredSentence[];
}

interface ScoredSentence {
  range: Range;
  score: number;
  text: string;
}

interface Index {
  [key: string]: Posting[];
}

type Rank = KeyScore[];

interface KeyScore {
  key: string;
  score: number;
}

interface Scores {
  [key: string]: number;
}

interface Paths {
  [path: string]: LocatedKey[];
}

export interface LocatedKey {
  key: string;
  start: number;
  end: number;
}

interface Posting {
  range: Range;
}

export const indexState: IndexState = {
  whenIndexedMillis: null,
  index: {},

  rank: [],
  scores: {},
  paths: {},

  sentenceScores: {},
};

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

interface Sentence {
  offset: {
    length: number;
    start: number;
  };
  terms: Term[];
  text: string;
}

interface Phrase {
  terms: Term[];
}

interface Term {
  clean: string;
  offset: {
    length: number;
    start: number;
  };
  text: string;
  tags: string[];
}

export function isInterestingTerm(key: string): boolean {
  if (key in indexState.scores) {
    return indexState.scores[key] > 5e-8;
  }

  return false;
}

export function isTopTerm(key: string): boolean {
  for (let i = 0; i < 3; i += 1) {
    if (i >= indexState.rank.length) {
      return false;
    }

    if (key === indexState.rank[i].key) {
      return true;
    }
  }

  return false;
}

export function isInterestingSentence(sentence: ScoredSentence): boolean {
  return sentence.score > 5e-6;
}

function addPosting(index: Index, key: string, posting: Posting): void {
  if (!(key in frequency) || stopwords.has(key)) {
    return;
  }

  let postingsList: Posting[] = [];
  if (key in index) {
    postingsList = index[key];
  }

  postingsList.push(posting);
  // eslint-disable-next-line no-param-reassign
  index[key] = postingsList;
}

function newPosting(path: Path, start: number, length: number): Posting {
  return {
    range: {
      anchor: {
        path,
        offset: start,
      },
      focus: {
        path,
        offset: start + length,
      },
    },
  };
}

function addToIndex(index: Index, path: Path, doc: nlp.Document): void {
  const phrases = doc.terms().json(jsonOptions);
  phrases.forEach((phrase: Phrase) => {
    phrase.terms.forEach((term: Term) => {
      const { clean } = term;
      if (term.tags.includes('Noun')) {
        const lemma = lemmatize.noun(clean);
        const posting: Posting = newPosting(
          path,
          term.offset.start,
          term.offset.length
        );
        addPosting(index, lemma, posting);
      } else if (term.tags.includes('Verb')) {
        const lemma = lemmatize.verb(clean);
        const posting: Posting = newPosting(
          path,
          term.offset.start,
          term.offset.length
        );
        addPosting(index, lemma, posting);
      } else if (term.tags.includes('Adjective')) {
        const lemma = lemmatize.adjective(clean);
        const posting: Posting = newPosting(
          path,
          term.offset.start,
          term.offset.length
        );
        addPosting(index, lemma, posting);
      } else {
        const posting: Posting = newPosting(
          path,
          term.offset.start,
          term.offset.length
        );
        addPosting(index, term.text, posting);
      }
    });
  });
}

function buildIndex(editor: Editor): Index {
  const index: Index = {};

  const textNodes = getAllTextNodes(editor);
  textNodes.forEach((ne: NodeEntry) => {
    if (ne == null || ne.length !== 2 || !Text.isText(ne[0])) {
      return;
    }

    const [node, path] = ne;
    const doc = nlp(node.text);

    addToIndex(index, path, doc);
  });

  return index;
}

function buildRank(index: Index): Rank {
  const rank: KeyScore[] = [];

  Object.keys(index).forEach((key: string) => {
    if (index[key].length > 1 && key in frequency) {
      rank.push({
        key,
        score: index[key].length / frequency[key],
      });
    }
  });

  rank.sort((a: KeyScore, b: KeyScore) => {
    return b.score - a.score;
  });

  return rank;
}

function buildScores(index: Index): Scores {
  const scores: Scores = {};

  Object.keys(index).forEach((key: string) => {
    if (key in frequency) {
      scores[key] = index[key].length / frequency[key];
    }
  });

  return scores;
}

function buildPaths(index: Index): Paths {
  const paths: Paths = {};

  Object.keys(index).forEach((key: string) => {
    if (key.length < 2) {
      return;
    }

    const postingsList = index[key];
    postingsList.forEach((posting: Posting) => {
      const { path } = posting.range.anchor;
      const pathString = path.toString();

      let keys: LocatedKey[] = [];
      if (pathString in paths) {
        keys = paths[pathString];
      }

      keys.push({
        key,
        start: posting.range.anchor.offset,
        end: posting.range.focus.offset,
      });
      // eslint-disable-next-line no-param-reassign
      paths[pathString] = keys;
    });
  });

  return paths;
}

function addToSentenceScores(
  sentenceScores: SentenceScores,
  path: Path,
  sentence: Sentence,
  scores: Scores
): void {
  // Skip scoring the sentence:
  //   1/ if it's empty or
  //   2/ if it doesn't end with a completion punctuation.
  if (sentence.text === '' || sentence.text.match(/^.*[^.!;:]$/)) {
    return;
  }

  let score = 0;
  let count = 0;
  sentence.terms.forEach((term: Term) => {
    const { clean } = term;
    if (clean in scores) {
      score += scores[clean];
      count += 1;
    }
  });
  if (count > 0) {
    score /= count;
  }

  const scoredSentence = {
    range: {
      anchor: {
        path,
        offset: sentence.offset.start,
      },
      focus: {
        path,
        offset: sentence.offset.start + sentence.offset.length,
      },
    },
    score,
    text: sentence.text,
  };

  const pathString = path.toString();
  let forPath: ScoredSentence[] = [];
  if (pathString in sentenceScores) {
    forPath = sentenceScores[pathString];
  }

  forPath.push(scoredSentence);
  // eslint-disable-next-line no-param-reassign
  sentenceScores[pathString] = forPath;
}

function buildSentenceScores(editor: Editor, scores: Scores): SentenceScores {
  const sentenceScores: SentenceScores = {};

  const textNodes = getAllTextNodes(editor);
  textNodes.forEach((ne: NodeEntry) => {
    if (ne == null || ne.length !== 2 || !Text.isText(ne[0])) {
      return;
    }

    const [node, path] = ne;
    const doc = nlp(node.text);

    const sentences = doc.sentences().json(jsonOptions);
    sentences.forEach((sentence: Sentence) => {
      addToSentenceScores(sentenceScores, path, sentence, scores);
    });

    const pathString = path.toString();
    if (pathString in sentenceScores) {
      sentenceScores[pathString].sort(
        (a: ScoredSentence, b: ScoredSentence) => {
          return b.score - a.score;
        }
      );
    }
  });

  return sentenceScores;
}

function refreshIndex(editor: Editor): void {
  const now: Date = new Date();
  if (
    indexState.whenIndexedMillis == null ||
    isAfter(
      now,
      add(new Date(indexState.whenIndexedMillis), {
        seconds: 1,
      })
    )
  ) {
    indexState.index = buildIndex(editor);

    indexState.rank = buildRank(indexState.index);
    indexState.scores = buildScores(indexState.index);
    indexState.paths = buildPaths(indexState.index);

    indexState.sentenceScores = buildSentenceScores(editor, indexState.scores);

    indexState.whenIndexedMillis = Date.now();
  }
}

export default function Indexer(): JSX.Element | null {
  const editor = useEditor();

  useEffect(() => {
    refreshIndex(editor);
  });

  return null;
}
