import { Editor, Element, Text, Transforms } from 'slate';

import { Author } from 'components/editor/author';
import { isRangeAtRoot, getTitle } from 'components/editor/queries';
import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';
import { getAllGoalTitles } from 'components/elements/Goals/queries';
import { generateGoal } from 'components/intelligence/generator';

export default function handleGoalsCompleteKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
  }

  // Do nothing if we're not in the Goals tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === GoalsElementType.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  const path = selection.focus?.path;
  if (!path || !path.length) {
    return false;
  }

  const [currentNode] = Editor.node(editor, path);

  if (!currentNode || !Text.isText(currentNode) || currentNode.text !== '') {
    return false;
  }

  const parentPath = path.slice(0, path.length - 1);
  const [parentNode] = Editor.node(editor, parentPath);

  if (!parentNode || parentNode.type !== GoalsElementType.ItemTitle) {
    return false;
  }

  const generatedGoal = generateGoal({
    goals: getAllGoalTitles(editor),
    title: getTitle(editor),
  });

  generatedGoal.then(
    (goal: string) => {
      const trimmedGoal = goal.trim();
      Transforms.setNodes(
        editor,
        { text: '', author: Author.Deca, original: trimmedGoal },
        { at: path }
      );
      Transforms.insertText(editor, trimmedGoal, { at: path });
    },
    (err) => {
      // Ignore completion key when not ready.
    }
  );

  return true;
}
