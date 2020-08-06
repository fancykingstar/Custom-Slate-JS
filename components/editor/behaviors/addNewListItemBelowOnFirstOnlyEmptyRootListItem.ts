import { Editor, Range, Transforms, Path } from 'slate';
import {
  isAncestorEmpty,
  getNextSiblingNodes,
  isFirstChild,
} from 'components/editor/queries';

/**
 * If caret is at start of the first, empty, and root list item, add a new line below.
 *
 * ### Before:
 * - |
 *
 * ### After:
 * -
 * - |
 */
export default function addNewListItemBelowOnFirstOnlyEmptyRootListItem(
  editor: Editor,
  rootElementType: string[]
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [contentNode, contentPath] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath); // li
  if (listItemPath.length < 2) {
    return false;
  }

  const listEntry = Editor.parent(editor, listItemPath); // ul
  const [listNode] = listEntry;
  if (!rootElementType.includes(listNode.type as string)) {
    return false;
  }

  const isFirstLevelListItem = listItemPath.length === 2;
  const isFirstSibling = isFirstChild(listItemPath);
  const listItemEmpty = isAncestorEmpty(editor, listItemNode);
  const nextSiblingNodesEmpty = !getNextSiblingNodes(listEntry, listItemPath)
    .length;

  if (
    Range.isCollapsed(selection) &&
    isFirstLevelListItem &&
    isFirstSibling &&
    listItemEmpty &&
    nextSiblingNodesEmpty
  ) {
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
