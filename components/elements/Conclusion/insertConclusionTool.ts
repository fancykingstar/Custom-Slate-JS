import { Editor, Transforms } from 'slate';
import { ConclusionElement } from 'components/elements/Conclusion/ConclusionElement';

/**
 * Converts the node at the current selection into a Choice tool.
 */
export default function insertConclusionTool(editor: Editor): void {
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
    type: ConclusionElement.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: ConclusionElement.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      timestamp: Date.now(),
      type: ConclusionElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );
}
