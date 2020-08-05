import { Editor, Node, Path, Transforms } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import {
  nodeIsType,
  isRangeAtRoot,
  isFirstChild,
} from 'components/editor/queries';
import { BasicElement } from 'components/elements/Element';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';
import isList from 'components/elements/List/isList';

function indentChoice(editor: Editor): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  const nearestItemNodeEntry = Editor.above(editor, {
    match: (n) => n.type === CriteriaElement.Item,
  });
  if (nearestItemNodeEntry == null) {
    return;
  }
  const [itemNode, itemPath] = nearestItemNodeEntry;

  // We only care about criteria elements (e.g., not nested list items)
  if (itemNode.type !== CriteriaElement.Item) {
    return;
  }

  // We do not indent the first item of a list
  if (isFirstChild(itemPath)) {
    return;
  }

  // Convert the current node into a regular list item if it's a choice item
  Transforms.setNodes(editor, {
    type: BasicElement.Paragraph,
  });
  Transforms.setNodes(
    editor,
    {
      type: BasicElement.ListItem,
    },
    {
      at: itemPath,
    }
  );

  // If previous sibling does not exist, prevent nesting
  const previousItem = Editor.node(editor, Path.previous(itemPath));
  const [previousItemNode, previousItemPath] = previousItem;

  // Check for sublist in previous sibling
  const previousItemChildren = previousItemNode.children as Node[];
  const previousItemSublist = previousItemChildren.find((n: Node) =>
    isList(n)
  ) as Element | undefined;

  // If the sublist doesn't exist, wrap the current item in a new list
  if (previousItemSublist == null) {
    Transforms.wrapNodes(
      editor,
      {
        type: BasicElement.UnorderedList,
        children: [],
      },
      {
        at: itemPath,
      }
    );
  }

  // NOTE: If the previous item's sublist exists, it's at index 1 of the previous item's children
  const newPath = previousItemPath.concat(
    previousItemSublist != null ? [1, previousItemSublist.children.length] : [1]
  );

  // If indenting line with previous sibling without a sublist, create new sublist
  //
  //   Before operation:
  //        (A) Line 1
  //        (B) |Line2
  //
  //   After operation:
  //        (A) Line 1
  //          - |Line2

  // If indenting line with previous sibling with a sublist, append to existing sublist
  //
  //   Before operation:
  //        (A) Line 1
  //          - Line 2
  //        (B) |Line3
  //
  //   After operation:
  //        (A) Line 1
  //          - Line2
  //          - |Line3

  // Move the list item (wrapped or not) into the previous sibling
  Transforms.moveNodes(editor, {
    at: itemPath,
    to: newPath,
  });
}

export function unindentCriteriaSublist(editor: Editor): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  // Ensure the structure of our tree is `choice-wrapper > choice-item > ul > li > p`
  const [paragraphNode, paragraphPath] = Editor.parent(editor, selection);
  if (paragraphNode.type !== BasicElement.Paragraph) {
    return;
  }

  const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath);
  if (listItemNode.type !== BasicElement.ListItem) {
    return;
  }

  const [listNode, listPath] = Editor.parent(editor, listItemPath);
  if (listNode.type !== BasicElement.UnorderedList) {
    return;
  }

  const [listParentNode, listParentPath] = Editor.parent(editor, listPath);
  if (listParentNode.type !== CriteriaElement.Item) {
    return;
  }

  const [wrapperNode] = Editor.parent(editor, listParentPath);
  if (wrapperNode.type !== CriteriaElement.Wrapper) {
    return;
  }

  // Convert the list item into a choice item
  // (`choice-item > ul > choice-item > choice-item-title`)
  Transforms.setNodes(
    editor,
    {
      type: CriteriaElement.ItemTitle,
    },
    {
      at: paragraphPath,
    }
  );

  Transforms.setNodes(
    editor,
    {
      type: CriteriaElement.Item,
    },
    {
      at: listItemPath,
    }
  );

  // Move the converted item after the current choice item
  const newChoiceItemPath = Path.next(listParentPath);
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: newChoiceItemPath,
  });

  // Move next siblings (if they exists) into children of the moved item
  const listItemIndex = listItemPath[listItemPath.length - 1];
  const siblingPath = [...listItemPath];
  const newListPath = newChoiceItemPath.concat(1);

  let siblingFound = false;
  let newSiblingIndex = 0;

  listNode.children.forEach((n, index) => {
    if (listItemIndex >= index) {
      return;
    }

    // If a sibling exists, create a new sublist as a child to the moved item
    if (!siblingFound) {
      siblingFound = true;
      Transforms.insertNodes(
        editor,
        {
          type: listNode.type,
          children: [],
        },
        {
          at: newListPath,
        }
      );
    }

    // Get the current location of the sibling we're focused on
    siblingPath[siblingPath.length - 1] = listItemIndex;

    // Get the new location for the sibling
    const newSiblingsPath = newListPath.concat(newSiblingIndex);

    Transforms.moveNodes(editor, {
      at: siblingPath,
      to: newSiblingsPath,
    });

    newSiblingIndex += 1;
  });

  // Delete the former sublist if unindented list item was the only item
  if (listItemIndex === 0) {
    Transforms.removeNodes(editor, {
      at: listPath,
    });
  }
}

/**
 * Handles indentation of Choice tool items. Returns false if no changes were made.
 */
export default function handleCriteriaTabKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === CriteriaElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  // Do nothing if we're not in the Criteria tool
  const [wrapperNode] = wrapperEntry;
  if (wrapperNode.type !== CriteriaElement.Wrapper) {
    return false;
  }

  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const isTab = isKeyHotkey(Keys.Tab, event);
  const isShiftTab = isKeyHotkey(Keys.ShiftTab, event);
  if (!isTab && !isShiftTab) {
    return false;
  }

  // Do nothing if not a choice tool item title or list item
  if (
    !nodeIsType(editor, CriteriaElement.ItemTitle) &&
    !nodeIsType(editor, BasicElement.ListItem)
  ) {
    return false;
  }

  // Ignore elements that are not nested (for choice tool, everything is in the choice tool wrapper)
  if (isRangeAtRoot(selection)) {
    return false;
  }

  // Stop browser from moving tab focus out of editor
  event.preventDefault();

  if (isShiftTab) {
    unindentCriteriaSublist(editor);
    return true;
  }

  if (isTab) {
    indentChoice(editor);
    return true;
  }

  return false;
}
