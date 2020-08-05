import { Editor, Range, Transforms, Path } from 'slate';
import {
  isRangeAtRoot,
  nodeIsType,
  isAncestorEmpty,
  getNextSiblingNodes,
  isBlockTextEmptyAfterSelection,
  isBlockAboveEmpty,
  doesSlateTreeMatchSequence,
} from 'components/editor/queries';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import unwrapGoals from 'components/elements/Goals/unwrapGoals';
import { BasicElement } from 'components/elements/Element';
import { unindentGoalSublist } from 'components/elements/Goals/handleGoalsTabKey';

export default function handleGoalsEnterKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
  }

  const [matchesNestedListSequence] = doesSlateTreeMatchSequence(editor, [
    BasicElement.Paragraph,
    BasicElement.ListItem,
    BasicElement.UnorderedList,
    GoalsElement.Item,
  ]);

  // If caret is in a nested empty sublist block, unindent
  //
  //   Before operation:
  //        (A) Choice 1
  //          - |
  //
  //   After operation:
  //        (A) Choice 1
  //        (B) |
  if (isBlockAboveEmpty(editor) && matchesNestedListSequence) {
    unindentGoalSublist(editor);
    event.preventDefault();
    return true;
  }

  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === GoalsElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  // Do nothing if we're not in the Goals tool
  const [wrapperNode] = wrapperEntry;
  if (wrapperNode.type !== GoalsElement.Wrapper) {
    return false;
  }

  const nearestItemNodeEntry = Editor.above(editor, {
    match: (n) => n.type === GoalsElement.Item,
  });
  if (nearestItemNodeEntry == null) {
    return false;
  }
  const [itemNode, itemPath] = nearestItemNodeEntry;

  const siblingNodes = getNextSiblingNodes(wrapperEntry, itemPath);

  // If caret is in empty choice title block, exit the choice tool
  //
  //   Before operation:
  //        (A) |
  //
  //   After operation:
  //        |

  // If caret is in empty line in final choice, exit the choice tool
  //
  //     Before operation:
  //        (A) Choice 1
  //        (B) |
  //
  //     After operation:
  //        (A) Choice 1
  //        |
  if (
    Range.isCollapsed(selection) &&
    nodeIsType(editor, GoalsElement.ItemTitle) &&
    isAncestorEmpty(editor, itemNode) &&
    !siblingNodes.length
  ) {
    unwrapGoals(editor);
    event.preventDefault();
    return true;
  }

  // Delete selection if selection exists
  if (!Range.isCollapsed(selection)) {
    Transforms.delete(editor);
  }

  // If caret is at start of the current item, add new item above.
  //
  //   Before operation:
  //      (A) |Choice 1
  //
  //   After operation:
  //      (A)
  //      (B) |Choice 1
  //
  // Also:
  //
  //   Before operation:
  //      (A) |
  //      (B) Choice 1
  //
  //   After operation:
  //      (A)
  //      (B) |
  //      (C) Choice 1
  if (Editor.isStart(editor, selection.focus, itemPath)) {
    Transforms.insertNodes(
      editor,
      {
        type: GoalsElement.Item,
        children: [
          {
            type: GoalsElement.ItemTitle,
            children: [{ text: '' }],
          },
        ],
      },
      {
        at: itemPath,
      }
    );
    event.preventDefault();
    return true;
  }

  const [, titlePath] = Editor.parent(editor, selection);
  const nextTitlePath = Path.next(titlePath);
  const nextItemPath = Path.next(itemPath);

  // If caret is at end of title, add new item below and move caret
  //
  //   Before operation:
  //      (A) Line 1|
  //      (B) Line 2
  //
  //   After operation:
  //      (A) Line 1
  //      (B) |
  //      (C) Line 2
  if (isBlockTextEmptyAfterSelection(editor)) {
    Transforms.insertNodes(
      editor,
      {
        type: GoalsElement.Item,
        children: [
          {
            type: GoalsElement.ItemTitle,
            children: [{ text: '' }],
          },
        ],
      },
      {
        at: nextItemPath,
      }
    );
    Transforms.select(editor, nextItemPath);
  } else {
    // If in middle of title, split nodes
    //
    //   Before operation:
    //      (A) Cho|ice 1
    //
    //   After operation:
    //      (A) Cho
    //      (B) |ice 1
    Transforms.splitNodes(editor, { at: selection });
    Transforms.wrapNodes(
      editor,
      {
        type: GoalsElement.Item,
        children: [],
      },
      {
        at: nextTitlePath,
      }
    );
    Transforms.moveNodes(editor, {
      at: nextTitlePath,
      to: nextItemPath,
    });
  }

  // If at end of choice item with nested list, move nested list to new choice item
  //
  //   Before operation:
  //      (A) Line 1|
  //        - Line 2
  //      (B) Line 3
  //
  //   After operation:
  //      (A) Line 1
  //      (B) |
  //        - Line 2
  //      (C) Line 3
  // const [listItemNode];
  if (itemNode.children.length > 1) {
    Transforms.moveNodes(editor, {
      at: nextTitlePath,
      to: nextItemPath.concat(1),
    });
  }

  event.preventDefault();
  return true;
}
