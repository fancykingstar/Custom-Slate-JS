import { Editor, Range } from 'slate';
import { BasicElement } from 'components/elements/Element';
import { nodeIsType, isSelectionAtBlockStart } from 'components/editor/queries';
import unwrapList from 'components/elements/List/unwrapList';
import { unindentList } from 'components/elements/List/handleListTabKey';

export default function handleListBackspaceKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  if (
    !Range.isCollapsed(selection) ||
    !nodeIsType(editor, BasicElement.ListItem)
  ) {
    return false;
  }

  const [paragraphNode, paragraphPath] = Editor.parent(editor, selection);
  if (paragraphNode.type !== BasicElement.Paragraph) {
    return false;
  }

  const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath);
  if (listItemNode.type !== BasicElement.ListItem) {
    return false;
  }

  const [listNode, listPath] = Editor.parent(editor, listItemPath);
  const [listParentNode] = Editor.parent(editor, listPath);

  // If caret is in a nested empty list block, unindent
  //
  //   Before operation:
  //        - Line 1
  //          - |
  //
  //   After operation:
  //        - Line 1
  //        - |
  if (
    isSelectionAtBlockStart(editor) &&
    listParentNode.type === BasicElement.ListItem
  ) {
    unindentList(editor, listNode, listPath, listItemPath);
    event.preventDefault();
    return true;
  }

  // If caret is in a nested empty list block and the parent node is not root
  // or another list item (i.e., the list is nested in another element type),
  // do nothing.
  //
  // This sets up a basic boundary for nested widgets. For now, we handle this manually
  // in element-specific code. In the future, it would be nice to make this more generic,
  // so the list item is automatically converted to the right structure.
  if (isSelectionAtBlockStart(editor) && !Editor.isEditor(listParentNode)) {
    return false;
  }

  // If caret is at start of list block (regardless of line content), exit the list
  //
  //   Before operation:
  //       - |Line 1        # Text is optional
  //
  //   After operation:
  //       |Line 1          # Text is optional

  // If caret is in empty line in middle of multi-line list, split the list
  //
  //   Before operation:
  //       - Line 1
  //       - |Line 2        # Text is optional
  //       - Line 3
  //
  //   After operation:
  //       - Line 1
  //       |Line 2          # Text is optional
  //       - Line 3

  // If caret is in empty line in final item in multi-line list, exit the list
  //
  //     Before operation:
  //       - Line 1
  //       - |
  //
  //     After operation:
  //       - Line 1
  //       |
  if (isSelectionAtBlockStart(editor)) {
    unwrapList(editor);
    event.preventDefault();
    return true;
  }

  return false;
}
