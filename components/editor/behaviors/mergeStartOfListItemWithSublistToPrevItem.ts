import { Editor, Transforms, Path } from 'slate';
import {
  isSelectionAtBlockStart,
  isFirstChild,
} from 'components/editor/queries';

/**
 * If selection is at start of a nested empty sublist block, unindent.
 *
 * ### Before:
 * - Choice 1
 *   - Line 1
 * - |Choice 2
 *   - Line 2
 *
 * ### After:
 * - Choice 1
 *   - Line 1|Choice 2
 *   - Line 2
 *
 * ---
 *
 * If at start of current choice and it has a sublist, merge with previous choice
 *
 * ### Before:
 * - Choice 1
 * - |Choice 2
 *   - Line 1
 *
 * ### After:
 * - Choice 1|Choice 2
 *   - Line 1
 */
export default function mergeStartOfListItemWithSublistToPrevItem(
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
    listItemIsFirstChild ||
    !listItemInList
  ) {
    return false;
  }

  const previousItemPath = Path.previous(listItemPath);
  const [previousItemNode] = Editor.node(editor, previousItemPath);
  const previousItemChildren = previousItemNode.children as Node[];

  // Do direct merge if there is no sublist in the previous list item
  const previousItemHasSublist = previousItemChildren.length > 1;
  if (!previousItemHasSublist) {
    Transforms.mergeNodes(editor, {
      at: listItemPath,
    });

    const secondListContentPath = previousItemPath.concat(1);
    Transforms.mergeNodes(editor, {
      at: secondListContentPath,
    });
    return true;
  }

  const previousItemLastChildPath = previousItemPath.concat(
    previousItemChildren.length - 1
  );

  const [, previousItemLastListItemLeafPath] = Editor.last(
    editor,
    previousItemLastChildPath
  );

  const [
    previousItemLastListItemContentNode,
    previousItemLastListItemPath,
  ] = Editor.parent(editor, previousItemLastListItemLeafPath);

  // Convert the content node into the expected content type, then move it adjacent
  // to the previous item's last list item node's content type
  Transforms.setNodes(
    editor,
    {
      type: previousItemLastListItemContentNode.type,
    },
    {
      at: contentPath,
    }
  );

  const newContentPath = Path.next(previousItemLastListItemPath);
  Transforms.moveNodes(editor, {
    at: contentPath,
    to: newContentPath,
  });

  // Merge the choice title with the last list item node's paragraph
  Transforms.mergeNodes(editor, {
    at: newContentPath,
  });

  // Merge the two criteria
  Transforms.mergeNodes(editor, {
    at: listItemPath,
  });

  // Merge ul from 2nd choice into 1st choice
  const lastSublistPath = previousItemPath.concat(previousItemChildren.length);
  Transforms.mergeNodes(editor, {
    at: lastSublistPath,
  });

  return true;
}
