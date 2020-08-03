import { Editor, Range } from 'slate';
import { BaseElement } from '../../Element';
import { nodeIsType, isSelectionAtBlockStart } from '../../editor/queries';
import unwrapList from './unwrapList';
import { unindentList } from './handleListIndentation';

export default function handleListBackspaceKey(
  editor: Editor,
  event: KeyboardEvent
): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  if (
    !Range.isCollapsed(selection) ||
    !nodeIsType(editor, BaseElement.ListItem)
  ) {
    return;
  }

  const [paragraphNode, paragraphPath] = Editor.parent(editor, selection);
  if (paragraphNode.type !== BaseElement.Paragraph) {
    return;
  }

  const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath);
  if (listItemNode.type !== BaseElement.ListItem) {
    return;
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
    listParentNode.type === BaseElement.ListItem
  ) {
    unindentList(editor, listNode, listPath, listItemPath);
    event.preventDefault();
    return;
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
  }
}
