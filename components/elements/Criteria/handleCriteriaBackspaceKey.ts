import { Editor, Node, Range, Path, Transforms } from 'slate';
import {
  nodeIsType,
  isSelectionAtBlockStart,
  getNextSiblingNodes,
  isFirstChild,
  doesSlateTreeMatchSequence,
  isRangeAtRoot,
} from 'components/editor/queries';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';
import unwrapCriteria from 'components/elements/Criteria/unwrapCriteria';
import { unindentCriteriaSublist } from 'components/elements/Criteria/handleCriteriaTabKey';
import { BasicElement } from 'components/elements/Element';

export default function handleCriteriaBackspaceKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  if (!Range.isCollapsed(selection)) {
    return false;
  }

  // If caret is in a nested sublist block, unindent
  const [matchesNestedListSequence] = doesSlateTreeMatchSequence(editor, [
    BasicElement.Paragraph,
    BasicElement.ListItem,
    BasicElement.UnorderedList,
    CriteriaElement.Item,
  ]);

  const caretAtStartOfBlock = isSelectionAtBlockStart(editor);

  // If caret is at start a nested sublist block, unindent
  //
  //   Before operation:
  //        (A) Choice 1
  //          - |Line 1
  //
  //   After operation:
  //        (A) Choice 1
  //        (B) |Line 1
  if (matchesNestedListSequence && caretAtStartOfBlock) {
    unindentCriteriaSublist(editor);
    event.preventDefault();
    return true;
  }

  const [, path] = Editor.node(editor, selection);
  const [, parentPath] = Editor.parent(editor, path);

  // If we're pressing backspace on a root element, merge it with the last node in the choice tool
  //
  //   Before operation:
  //        (A) Choice 1
  //        |Line 1
  //
  //   After operation:
  //        (A) Choice 1|Line 1

  // If we're pressing backspace on a root element, merge it with the last sublist item in the choice tool
  //
  //   Before operation:
  //        (A) Choice 1
  //          - Line 1
  //        |Line 2
  //
  //   After operation:
  //        (A) Choice 1
  //          - Line 1|Line 2

  if (
    caretAtStartOfBlock &&
    isRangeAtRoot(selection) &&
    parentPath[parentPath.length - 1] > 0
  ) {
    const previousParentPath = Path.previous(parentPath);
    const [previousParentNode] = Editor.node(editor, previousParentPath);

    if (previousParentNode.type === CriteriaElement.Wrapper) {
      const [, lastNodePath] = Editor.last(editor, previousParentPath);
      const [lastNodeParentNode, lastNodeParentPath] = Editor.parent(
        editor,
        lastNodePath
      );

      Transforms.setNodes(
        editor,
        {
          type: lastNodeParentNode.type,
        },
        {
          at: parentPath,
        }
      );

      const newPath = Path.next(lastNodeParentPath);
      Transforms.moveNodes(editor, {
        at: parentPath,
        to: newPath,
      });

      Transforms.mergeNodes(editor, {
        at: newPath,
      });

      event.preventDefault();
      return true;
    }
  }

  // No-op if we're not focused on a choice item title
  if (!nodeIsType(editor, CriteriaElement.ItemTitle)) {
    return false;
  }

  const nearestItemNodeEntry = Editor.above(editor, {
    match: (n) => n.type === CriteriaElement.Item,
  });
  if (nearestItemNodeEntry == null) {
    return false;
  }
  const [itemNode, itemPath] = nearestItemNodeEntry;

  if (
    isSelectionAtBlockStart(editor) &&
    itemNode.children.length > 1 &&
    itemNode.children.some((n) => n.type === BasicElement.UnorderedList)
  ) {
    // Do nothing if this is the first choice item (and it has a sublist)
    //
    // A future change could be converting this into a paragraph + regular list
    if (itemPath[itemPath.length - 1] === 0) {
      event.preventDefault();
      return true;
    }

    const previousItemPath = Path.previous(itemPath);
    const [previousItemNode] = Editor.node(editor, previousItemPath);
    const previousItemChildren = previousItemNode.children as Node[];

    const previousItemLastChildPath = previousItemPath.concat(
      previousItemChildren.length - 1
    );
    const [previousItemLastChildNode] = Editor.node(
      editor,
      previousItemLastChildPath
    );

    if (previousItemLastChildNode.type === BasicElement.UnorderedList) {
      // If at start of current choice and it has a sublist, merge with previous choice's sublist
      //
      //     Before operation:
      //        (A) Choice 1
      //          - Line 1
      //        (B) |Choice 2
      //          - Line 2
      //
      //     After operation:
      //        (A) Choice 1
      //          - Line 1|Choice 2
      //          - Line 2
      const [, previousItemLastListItemParagraphPath] = Editor.last(
        editor,
        previousItemLastChildPath
      );

      const [, previousItemLastListItemPath] = Editor.parent(
        editor,
        previousItemLastListItemParagraphPath
      );

      // Convert the title into a paragraph, then move it adjacent to the previous item's last
      // list item node's paragraph
      Transforms.setNodes(
        editor,
        {
          type: BasicElement.Paragraph,
        },
        {
          at: parentPath,
        }
      );

      const newTitlePath = Path.next(previousItemLastListItemPath);
      Transforms.moveNodes(editor, {
        at: parentPath,
        to: newTitlePath,
      });

      // Merge the choice title with the last list item node's paragraph
      Transforms.mergeNodes(editor, {
        at: newTitlePath,
      });

      // Merge the two criteria
      Transforms.mergeNodes(editor, {
        at: itemPath,
      });

      // Merge ul from 2nd choice into 1st choice
      const lastSublistPath = previousItemPath.concat(
        previousItemChildren.length
      );
      Transforms.mergeNodes(editor, {
        at: lastSublistPath,
      });
    } else {
      // If at start of current choice and it has a sublist, merge with previous choice
      //
      //     Before operation:
      //        (A) Choice 1
      //        (B) |Choice 2
      //          - Line 1
      //
      //     After operation:
      //        (A) Choice 1|Choice 2
      //          - Line 1
      Transforms.mergeNodes(editor, {
        at: itemPath,
      });

      const secondChoiceTitlePath = previousItemPath.concat([1]);
      Transforms.mergeNodes(editor, {
        at: secondChoiceTitlePath,
      });
    }

    event.preventDefault();
    return true;
  }

  const wrapperEntry = Editor.parent(editor, itemPath);
  const siblingNodes = getNextSiblingNodes(wrapperEntry, itemPath);

  // If caret is in empty line in first choice, exit the choice tool
  //
  //     Before operation:
  //        (A) |
  //
  //     After operation:
  //        |

  // If caret is in empty line in first choice (of multiple), exit the choice tool
  //
  //     Before operation:
  //        (A) |
  //        (B) Choice 1
  //
  //     After operation:
  //        |
  //        (A) Choice 1

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
    isSelectionAtBlockStart(editor) &&
    // Is first child or last child?
    (isFirstChild(itemPath) || !siblingNodes.length)
  ) {
    unwrapCriteria(editor);
    event.preventDefault();
    return true;
  }

  return false;
}
