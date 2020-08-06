import { Editor, Transforms } from 'slate';
import { BasicElement } from 'components/elements/Element';

/**
 * Converts a list-like node structure into a root-level paragraph.
 *
 * If caret is in empty list item with no siblings, exit the tool
 *
 * ### Before:
 * - |
 *
 * ### After:
 * |
 *
 * ---
 *
 * If caret is in empty line at final list item, exit the tool
 *
 * ###  Before:
 * - Line 1
 * - |
 *
 * ###  After:
 * - Line 1
 *
 * |
 */
export default function unwrapRootListItem(editor: Editor): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, path] = Editor.parent(editor, selection);
  const [, listItemPath] = Editor.parent(editor, path);

  Transforms.setNodes(editor, { type: BasicElement.Paragraph });
  Transforms.unwrapNodes(editor, {
    at: listItemPath,
  });
  Transforms.liftNodes(editor, {
    at: listItemPath,
  });

  return true;
}
