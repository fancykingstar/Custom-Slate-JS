import { Editor, Transforms } from 'slate';
import {
  isSelectionAtBlockStart,
  isFirstChild,
} from 'components/editor/queries';

/**
 * If selection is at start of the first nested sublist block, merge with previous list item.
 *
 * ### Before
 * - Line 1
 *  - |Line 2
 *  - Line 3
 *
 * ## After
 * - Line 1|Line 2
 *  - Line 3
 */
export default function mergeFromStartOfSublistToPrevItem(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, contentPath] = Editor.parent(editor, selection); // p
  const [, listItemPath] = Editor.parent(editor, contentPath); // li

  const selectionAtStart = isSelectionAtBlockStart(editor);
  const listItemIsFirstChild = isFirstChild(listItemPath);
  const listItemInList = listItemPath.length >= 2;

  if (!selectionAtStart || !listItemIsFirstChild || !listItemInList) {
    return false;
  }

  const [listNode, listPath] = Editor.parent(editor, listItemPath);
  if (listPath.length < 2) {
    return false;
  }

  const [listParentNode, listParentPath] = Editor.parent(editor, listPath);
  if (listParentPath.length < 2) {
    return false;
  }

  // You cannot unindent into the root level
  if (Editor.isEditor(listParentNode)) {
    return false;
  }

  // Determine the expected element types
  const listParentFirstChildPath = listParentPath.concat(0);

  const [listParentFirstChildNode] = Editor.node(
    editor,
    listParentFirstChildPath
  );
  const expectedContentType = listParentFirstChildNode.type;

  Transforms.setNodes(
    editor,
    {
      type: expectedContentType,
    },
    {
      at: contentPath,
    }
  );

  Transforms.unwrapNodes(editor, { at: listItemPath });
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: listPath,
  });
  Transforms.mergeNodes(editor, {
    at: listPath,
  });

  if (listNode.children.length === 1) {
    Transforms.removeNodes(editor, {
      at: listPath,
    });
  }

  return true;
}
