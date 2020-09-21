import { Editor, Element, Text, Transforms } from 'slate';

import { Author } from 'components/editor/author';
import { isRangeAtRoot, getTitle } from 'components/editor/queries';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { getAllChoiceTitles } from 'components/elements/Choices/queries';
import { getAllGoalTitles } from 'components/elements/Goals/queries';
import { generateChoice } from 'components/intelligence/generator';

export default function handleChoicesCompleteKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
  }

  // Do nothing if we're not in the Choices tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === ChoicesType.Wrapper,
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

  if (!parentNode || parentNode.type !== ChoicesType.ItemTitle) {
    return false;
  }

  const generatedChoice = generateChoice({
    choices: getAllChoiceTitles(editor),
    goals: getAllGoalTitles(editor),
    title: getTitle(editor),
  });

  generatedChoice.then(
    (choice) => {
      const trimmedChoice = choice.trim();
      Transforms.setNodes(
        editor,
        { text: '', author: Author.Deca, original: trimmedChoice },
        { at: path }
      );
      Transforms.insertText(editor, trimmedChoice, { at: path });
    },
    (err) => {
      // Ignore completion key when not ready.
    }
  );

  return true;
}
