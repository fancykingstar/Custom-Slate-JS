import { Editor, Transforms } from 'slate';
import { CategorizerElement } from 'components/elements/Categorizer/CategorizerElement';

/**
 * Converts the node at the current selection into an Categorizer tool.
 */
export default function insertCategorizerTool(editor: Editor): void {
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

  Transforms.insertNodes(
    editor,
    {
      type: CategorizerElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );
}
