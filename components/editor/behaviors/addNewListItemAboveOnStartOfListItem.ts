import { Editor, Range, Transforms } from 'slate';
import {
  getNextSiblingNodes,
  isBlockAboveEmpty,
} from 'components/editor/queries';

/**
 * If caret is at start of the current list item, add new list item above.
 *
 * ### Before:
 * - |Line 1
 *
 * ### After:
 * -
 * - |Line 1
 *
 * ---
 *
 * ### Before:
 * - |
 * - Line 1
 *
 * ### After:
 * -
 * - |
 * - Line 1
 */
export default function addNewListItemAboveOnStartOfListItem(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [contentNode, contentPath] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath); // li
  const listEntry = Editor.parent(editor, listItemPath); // ul

  const isStartOfListItem = Editor.isStart(
    editor,
    selection.focus,
    listItemPath
  );
  const nextSiblingNodes = getNextSiblingNodes(listEntry, listItemPath);
  const nodeHasContent = !isBlockAboveEmpty(editor);

  if (
    Range.isCollapsed(selection) &&
    isStartOfListItem &&
    (nodeHasContent || nextSiblingNodes.length)
  ) {
    Transforms.insertNodes(
      editor,
      {
        type: listItemNode.type,
        children: [
          {
            type: contentNode.type,
            children: [{ text: '' }],
          },
        ],
      },
      {
        at: listItemPath,
      }
    );
    return true;
  }

  return false;
}
