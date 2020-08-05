import { Editor, Transforms } from 'slate';
import { ChoicesElement } from './ChoicesElement';

/**
 * Converts the node at the current selection into a Choice tool.
 */
export default function insertChoicesTool(editor: Editor): void {
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
    type: ChoicesElement.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: ChoicesElement.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      type: ChoicesElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );
}
