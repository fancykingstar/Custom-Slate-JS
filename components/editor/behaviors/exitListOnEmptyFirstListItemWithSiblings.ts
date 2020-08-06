import { Editor, Range } from 'slate';
import {
  getNextSiblingNodes,
  isAncestorEmpty,
  isFirstChild,
} from 'components/editor/queries';
import unwrapRootListItem from 'components/editor/transforms/unwrapRootListItem';

/**
 * If caret is in empty line in first list item (of multiple), exit the list
 *
 * Before:
 * - |
 * - Choice 1
 *
 * After:
 *
 * |
 * - Choice 1
 */
export default function exitListOnEmptyFirstListItemWithSiblings(
  editor: Editor,
  rootElementType: string[]
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, path] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, path); // li
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
  const hasNextSiblingNodes = getNextSiblingNodes(listEntry, listItemPath)
    .length;

  if (
    Range.isCollapsed(selection) &&
    isFirstLevelListItem &&
    isFirstSibling &&
    listItemEmpty &&
    hasNextSiblingNodes
  ) {
    return unwrapRootListItem(editor);
  }

  return false;
}
