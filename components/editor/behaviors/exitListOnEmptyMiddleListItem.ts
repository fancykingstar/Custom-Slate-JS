import { Editor, Range } from 'slate';
import {
  getNextSiblingNodes,
  isAncestorEmpty,
  isFirstChild,
} from 'components/editor/queries';
import unwrapRootListItem from 'components/editor/transforms/unwrapRootListItem';

/**
 * If caret is in empty line in middle of multi-line list, split the list
 *
 * ### Before:
 * ```text
 * - Line 1
 * - |
 * - Line 2
 * ```
 * ### After:
 * ```text
 * - Line 1
 * |
 * - Line 2
 * ```
 */
export default function exitListOnEmptyMiddleListItem(
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

  const isFirstSibling = isFirstChild(listItemPath);
  const listItemEmpty = isAncestorEmpty(editor, listItemNode);
  const nextSiblingNodesEmpty = !getNextSiblingNodes(listEntry, listItemPath)
    .length;

  if (
    Range.isCollapsed(selection) &&
    !isFirstSibling &&
    listItemEmpty &&
    !nextSiblingNodesEmpty
  ) {
    return unwrapRootListItem(editor);
  }

  return false;
}
