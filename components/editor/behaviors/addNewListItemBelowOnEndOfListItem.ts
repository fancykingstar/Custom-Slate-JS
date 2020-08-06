import { Editor, Range, Transforms, Path } from 'slate';
import {
  isBlockAboveEmpty,
  isBlockTextEmptyAfterSelection,
} from 'components/editor/queries';

/**
 * If caret is at end of list item, add new item below and move caret. (Only works if node has content.)
 *
 * ### Before:
 * - Line 1|
 * - Line 2
 *
 * ### After:
 * - Line 1
 * - |
 * - Line 2
 *
 * ---
 *
 * ### Before:
 * - Line 1|
 * - Line 2
 * - Line 3
 *
 * ### After:
 * - Line 1
 * - |
 * - Line 2
 * - Line 3
 */
export default function addNewListItemBelowOnEndOfListItem(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [contentNode, contentPath] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath); // li

  const nodeHasContent = !isBlockAboveEmpty(editor);
  const isEndOfListItem = isBlockTextEmptyAfterSelection(editor);

  if (Range.isCollapsed(selection) && nodeHasContent && isEndOfListItem) {
    const nextItemPath = Path.next(listItemPath);
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
        at: nextItemPath,
      }
    );
    Transforms.select(editor, nextItemPath);

    // If at end of list item with nested list, move nested list to new list item
    if (listItemNode.children.length > 1) {
      const nextContentPath = Path.next(contentPath);
      Transforms.moveNodes(editor, {
        at: nextContentPath,
        to: nextItemPath.concat(1),
      });
    }
    return true;
  }

  return false;
}
