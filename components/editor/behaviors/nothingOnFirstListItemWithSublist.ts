import { Editor } from 'slate';
import {
  isSelectionAtBlockStart,
  isFirstChild,
} from 'components/editor/queries';

/**
 * Do nothing if this is the first choice item and it has a sublist.
 */
export default function nothingOnFirstListItemWithSublist(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, contentPath] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath); // li

  const selectionAtStart = isSelectionAtBlockStart(editor);
  const listItemHasSublist = listItemNode.children.length > 1;
  const listItemIsFirstChild = isFirstChild(listItemPath);
  const listItemInList = listItemPath.length >= 2;

  if (
    !selectionAtStart ||
    !listItemHasSublist ||
    !listItemIsFirstChild ||
    !listItemInList
  ) {
    return false;
  }

  // A future change could be converting this into a paragraph + regular list
  if (listItemPath[listItemPath.length - 1] === 0) {
    return true;
  }

  return false;
}
