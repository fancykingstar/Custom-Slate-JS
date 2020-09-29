import { Editor, Element, NodeEntry, Text, Transforms } from 'slate';

import { Author } from 'components/editor/author';
import {
  getFirstTextString,
  getTitleEntry,
  isRangeAtRoot,
  isTypeAndEmpty,
  stringifyTitleEntry,
} from 'components/editor/queries';
import {
  Sensitivity,
  generateString,
  reduceDisabled,
  reduceSensitivity,
} from 'components/editor/Sensitivity';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { getAllChoiceEntries } from 'components/elements/Choices/queries';
import { getAllGoalEntries } from 'components/elements/Goals/queries';
import {
  generateChoice,
  readyToGenerateChoice,
} from 'components/intelligence/generator';

export default function handleChoicesCompleteKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const [proper, path] = isTypeAndEmpty(
    editor,
    ChoicesType.Wrapper,
    ChoicesType.ItemTitle
  );
  if (!proper || path == null) {
    return false;
  }

  const parentPath = path.slice(0, path.length - 1);
  const [parentNode] = Editor.node(editor, parentPath);
  if (parentNode.magicStarted) {
    return false;
  }

  const choiceEntries: NodeEntry<Element>[] = getAllChoiceEntries(editor);
  const choices = choiceEntries.map(getFirstTextString);
  const goalEntries: NodeEntry<Element>[] = getAllGoalEntries(editor);
  const goals = goalEntries.map(getFirstTextString);

  const titleEntry: NodeEntry<Element> | null = getTitleEntry(editor);
  if (titleEntry == null) {
    return false;
  }
  const title: string = stringifyTitleEntry(titleEntry);

  const [ready] = readyToGenerateChoice({
    choices,
    goals,
    title,
  });
  if (!ready) {
    return false;
  }

  const entries = [titleEntry, ...choiceEntries, ...goalEntries];
  const disabled: boolean = entries.reduce(reduceDisabled, false);
  if (disabled) {
    return false;
  }

  generateString(
    editor,
    path,
    entries,
    generateChoice.bind(null, {
      choices,
      goals,
      title,
    })
  );

  return true;
}
