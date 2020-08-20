import { Editor, Transforms } from 'slate';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';

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
    type: GoalsElement.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: GoalsElement.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      timestamp: Date.now(),
      type: GoalsElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );
}
