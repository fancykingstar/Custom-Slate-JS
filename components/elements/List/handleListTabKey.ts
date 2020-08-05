import { Editor, Node, Path, Transforms, Ancestor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { BasicElement } from '../Element';
import { isRangeAtRoot, nodeIsType, isFirstChild } from '../../editor/queries';
import Keys from '../../editor/keys';
import isList from './isList';

export function indentList(
  editor: Editor,
  listNode: Ancestor,
  listItemPath: Path
): boolean {
  // If previous sibling does not exist, prevent nesting
  const previousSiblingItem = Editor.node(editor, Path.previous(listItemPath));
  const [previousSiblingNode, previousSiblingPath] = previousSiblingItem;

  // Does the previous sibling have a sublist inside of it?
  const previousSiblingChildren = previousSiblingNode.children as Node[];
  const previousSiblingSublist = previousSiblingChildren.find((n: Node) =>
    isList(n)
  ) as Element | undefined;

  // If the previous sublist doesn't exist, wrap current list item in a new list
  if (previousSiblingSublist == null) {
    Transforms.wrapNodes(
      editor,
      { type: listNode.type, children: [] },
      { at: listItemPath }
    );
  }

  const newPath = previousSiblingPath.concat(
    previousSiblingSublist != null
      ? [1, previousSiblingChildren.length - 1]
      : [1]
  );

  // If indenting line with previous sibling without a sublist, create new sublist
  //
  //   Before operation:
  //        - Line 1
  //        - |Line2
  //
  //   After operation:
  //        - Line 1
  //          - |Line2

  // If indenting line with previous sibling with a sublist, append to existing sublist
  //
  //   Before operation:
  //        - Line 1
  //          - Line 2
  //        - |Line3
  //
  //   After operation:
  //        - Line 1
  //          - Line2
  //          - |Line3

  // Move the list item (wrapped or not) into the previous sibling
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: newPath,
  });

  return true;
}

export function unindentList(
  editor: Editor,
  listNode: Ancestor,
  listPath: Path,
  listItemPath: Path
): boolean {
  const [listParentNode, listParentPath] = Editor.parent(editor, listPath);
  // Unindenting is only possible if the list is nested
  if (listParentNode.type !== BasicElement.ListItem) {
    return false;
  }

  // Move the node into the parent
  const newListItemPath = Path.next(listParentPath);
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: newListItemPath,
  });

  // Move next siblings (if they exist) into the moved main node
  const listItemIndex = listItemPath[listItemPath.length - 1];
  const siblingPath = [...listItemPath];
  const newListPath = newListItemPath.concat(1);

  let siblingFound = false;
  let newSiblingIndex = 0;

  listNode.children.forEach((n, index) => {
    if (listItemIndex >= index) {
      return;
    }

    // If a sibling exists, create a new list node as a child to the main node
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

  return true;
}

/**
 * Handles indentation of list items.
 */
export default function handleListTabKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const isTab = isKeyHotkey(Keys.Tab, event);
  const isShiftTab = isKeyHotkey(Keys.ShiftTab, event);
  if (!isTab && !isShiftTab) {
    return false;
  }

  // Do nothing if not a list item or indentation is at root level
  // NOTE: List items should never be at root level
  if (!nodeIsType(editor, BasicElement.ListItem) || isRangeAtRoot(selection)) {
    return false;
  }

  // Stop browser from moving tab focus out of editor
  event.preventDefault();

  const [paragraphNode, paragraphPath] = Editor.parent(editor, selection);
  if (paragraphNode.type !== BasicElement.Paragraph) {
    return false;
  }

  const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath);
  if (listItemNode.type !== BasicElement.ListItem) {
    return false;
  }

  const [listNode, listPath] = Editor.parent(editor, listItemPath);

  if (isShiftTab) {
    return unindentList(editor, listNode, listPath, listItemPath);
  }

  if (isTab && !isFirstChild(listItemPath)) {
    return indentList(editor, listNode, listItemPath);
  }

  return false;
}
