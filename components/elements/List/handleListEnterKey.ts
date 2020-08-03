import { Editor, Path, Range, Transforms } from 'slate';
import { BaseElement } from '../../Element';
import {
  isRangeAtRoot,
  isBlockTextEmptyAfterSelection,
  isBlockAboveEmpty,
  nodeIsType,
} from '../../editor/queries';
import unwrapList from './unwrapList';
import { unindentList } from './handleListIndentation';

/**
 * Handles logic for the Enter-key in lists.
 */
export default function handleListEnterKey(
  editor: Editor,
  event: KeyboardEvent
): void {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
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
    isBlockAboveEmpty(editor) &&
    listParentNode.type === BaseElement.ListItem
  ) {
    unindentList(editor, listNode, listPath, listItemPath);
    event.preventDefault();
    return;
  }

  // If caret is in empty list block, exit the list
  //
  //   Before operation:
  //       - |
  //
  //   After operation:
  //       |

  // If caret is in empty line in middle of multi-line list, split the list
  //
  //   Before operation:
  //       - Line 1
  //       - |
  //       - Line 2
  //
  //   After operation:
  //       - Line 1
  //       |
  //       - Line 2

  // If caret is in empty line in final item in multi-line list, exit the list
  //
  //     Before operation:
  //       - Line 1
  //       - |
  //
  //     After operation:
  //       - Line 1
  //       |
  if (
    Range.isCollapsed(selection) &&
    nodeIsType(editor, BaseElement.ListItem) &&
    isBlockAboveEmpty(editor)
  ) {
    unwrapList(editor);
    event.preventDefault();
    return;
  }

  // No-op if the paragraph is not wrapped in a list item
  if (listItemNode.type !== BaseElement.ListItem) {
    return;
  }

  // Delete selection if selection exists
  if (!Range.isCollapsed(selection)) {
    Transforms.delete(editor);
  }

  // If caret is at start of the current line, add new list item above.
  //
  //   Before operation:
  //     - |Line 1
  //
  //   After operation:
  //     -
  //     - |Line 1
  if (Editor.isStart(editor, selection.focus, paragraphPath)) {
    Transforms.insertNodes(
      editor,
      {
        type: BaseElement.ListItem,
        children: [
          {
            type: BaseElement.Paragraph,
            children: [{ text: '' }],
          },
        ],
      },
      { at: listItemPath }
    );
    event.preventDefault();
    return;
  }

  const nextParagraphPath = Path.next(paragraphPath);
  const nextListItemPath = Path.next(listItemPath);

  // If at end, insert list item after and move caret
  //
  //   Before operation:
  //     - Line 1|
  //     - Line 2
  //
  //   After operation:
  //     - Testing
  //     - |
  //     - Line 2
  if (isBlockTextEmptyAfterSelection(editor)) {
    Transforms.insertNodes(
      editor,
      {
        type: BaseElement.ListItem,
        children: [
          {
            type: BaseElement.Paragraph,
            children: [{ text: '' }],
          },
        ],
      },
      { at: nextListItemPath }
    );
    Transforms.select(editor, nextListItemPath);
  } else {
    // If in middle of text, split nodes
    //
    //   Before operation:
    //     - Lin|e 1
    //
    //   After operation:
    //     - Lin
    //     - |e 1
    Transforms.splitNodes(editor, { at: selection });
    Transforms.wrapNodes(
      editor,
      {
        type: BaseElement.ListItem,
        children: [],
      },
      {
        at: nextParagraphPath,
      }
    );
    Transforms.moveNodes(editor, {
      at: nextParagraphPath,
      to: nextListItemPath,
    });
  }

  // If at end of node with nested list, move nested list to new node
  //
  //   Before operation:
  //      - Line 1|
  //        - Line 2
  //      - Line 3
  //
  //   After operation:
  //      - Line 1
  //      - |
  //        - Line 2
  //      - Line 3
  if (listItemNode.children.length > 1) {
    Transforms.moveNodes(editor, {
      at: nextParagraphPath,
      to: nextListItemPath.concat(1),
    });
  }

  event.preventDefault();
}
