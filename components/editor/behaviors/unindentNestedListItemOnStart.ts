import { Editor } from 'slate';
import { isSelectionAtBlockStart } from 'components/editor/queries';
import unindentListItem from 'components/editor/transforms/unindentListItem';

/**
 * If selection is at start of a nested empty sublist block, unindent.
 *
 * ### Before:
 * - Line 1
 *  - |
 *
 * ### After:
 * - Line 1
 * - |
 */
export default function unindentNestedListItemOnStart(
  editor: Editor,
  rootElementType: string[]
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, path] = Editor.parent(editor, selection); // p
  const [, listItemPath] = Editor.parent(editor, path); // li
  if (listItemPath.length < 2) {
    return false;
  }

  const listEntry = Editor.parent(editor, listItemPath); // ul
  const [listNode] = listEntry;
  if (!rootElementType.includes(listNode.type as string)) {
    return false;
  }

  if (isSelectionAtBlockStart(editor)) {
    return unindentListItem(editor);
  }

  return false;
}
