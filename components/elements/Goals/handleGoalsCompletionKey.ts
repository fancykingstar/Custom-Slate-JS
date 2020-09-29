import { Editor, Element, NodeEntry, Text, Transforms } from 'slate';

import { ContextType } from 'components/context';
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
import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';
import { getAllGoalEntries } from 'components/elements/Goals/queries';
import {
  generateGoal,
  readyToGenerateGoal,
} from 'components/intelligence/generator';

export default function handleGoalsCompleteKey(
  editor: Editor,
  context: ContextType,
  event: KeyboardEvent
): boolean {
  const [proper, path] = isTypeAndEmpty(
    editor,
    GoalsElementType.Wrapper,
    GoalsElementType.ItemTitle
  );
  if (!proper || path == null) {
    return false;
  }

  const parentPath = path.slice(0, path.length - 1);
  const [parentNode] = Editor.node(editor, parentPath);
  if (parentNode.magicStarted) {
    return false;
  }

  const goalEntries: NodeEntry<Element>[] = getAllGoalEntries(editor);
  const goals = goalEntries.map(getFirstTextString);

  const titleEntry: NodeEntry<Element> | null = getTitleEntry(editor);
  if (titleEntry == null) {
    return false;
  }
  const title: string = stringifyTitleEntry(titleEntry);

  const [ready] = readyToGenerateGoal({
    goals,
    title,
  });
  if (!ready) {
    return false;
  }

  const entries = [titleEntry, ...goalEntries];
  const disabled: boolean = entries.reduce(reduceDisabled, false);
  if (disabled) {
    return false;
  }

  generateString(
    editor,
    context,
    path,
    entries,
    generateGoal.bind(null, context, {
      goals,
      title,
    })
  );

  return true;
}
