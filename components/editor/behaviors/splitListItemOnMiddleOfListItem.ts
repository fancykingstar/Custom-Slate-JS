import { Editor, Range, Transforms, Path } from 'slate';
import {
  isBlockAboveEmpty,
  isBlockTextEmptyAfterSelection,
} from 'components/editor/queries';

/**
 * If in middle of list item, split nodes
 *
 * ### Before:
 * - Cho|ice 1
 *
 * ### After:
 * - Cho
 * - |ice 1
 *
 * ---
 *
 * ### Before:
 * - Lin|e 1
 *   - Line 2
 * - Line 3
 *
 * ### After:
 * - Lin
 * - |e 1
 *   - Line 2
 * - Line 3
 */
export default function splitListItemOnMiddleOfListItem(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, contentPath] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath); // li

  const nodeHasContent = !isBlockAboveEmpty(editor);
  const isStartOfListItem = Editor.isStart(
    editor,
    selection.focus,
    listItemPath
  );
  const isEndOfListItem = isBlockTextEmptyAfterSelection(editor);

  if (
    Range.isCollapsed(selection) &&
    nodeHasContent &&
    !isStartOfListItem &&
    !isEndOfListItem
  ) {
    Transforms.splitNodes(editor, { at: selection });

    const nextContentPath = Path.next(contentPath);
    Transforms.wrapNodes(
      editor,
      {
        type: listItemNode.type,
        children: [],
      },
      {
        at: nextContentPath,
      }
    );

    const nextItemPath = Path.next(listItemPath);
    Transforms.moveNodes(editor, {
      at: nextContentPath,
      to: nextItemPath,
    });

    // If at end of list item with nested list, move nested list to new list item
    if (listItemNode.children.length > 1) {
      Transforms.moveNodes(editor, {
        at: nextContentPath,
        to: nextItemPath.concat(1),
      });
    }
    return true;
  }

  return false;
}
