import { Editor, Transforms } from 'slate';
import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';

/**
 * Converts the node at the current selection into a Choice tool.
 */
export default function insertGoalsTool(editor: Editor): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  const entry = Editor.parent(editor, selection);
  if (entry == null) {
    return;
  }
  const [, paragraphPath] = entry;

  Transforms.delete(editor);

  Transforms.setNodes(editor, {
    type: GoalsElementType.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: GoalsElementType.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      timestamp: Date.now(),
      type: GoalsElementType.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );
}
