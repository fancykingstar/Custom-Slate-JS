import { Editor, Range, Location, Transforms, Path } from 'slate';

/**
 * Unindents a list item.
 *
 * - Assumes a rendering structure based on `ul` and `li` HTML elements.
 * - Automatically determines how to modify element types to match parent list.
 * - Ignores root nodes.
 *
 * @param editor Slate editor
 * @param at Location of cursor (defaults to editor selection)
 * @returns True if the unindentation operation succeeds
 */
export default function unindentListItem(
  editor: Editor,
  at?: Location
): boolean {
  const { selection } = editor;
  if (selection == null || !Range.isCollapsed(selection)) {
    return false;
  }

  const location = at ?? selection;
  const [, leafPath] = Editor.node(editor, location);
  const [contentNode, contentPath] = Editor.parent(editor, leafPath);
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath);
  if (listItemPath.length < 2) {
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

  // Unexpected if the nested list is the first child of the parent item
  if (Path.equals(listParentFirstChildPath, listPath)) {
    // eslint-disable-next-line no-console
    console.warn(
      'Attempted to un-indent a sublist which is the first child of a parent list item'
    );
    return false;
  }

  const [listParentFirstChildNode] = Editor.node(
    editor,
    listParentFirstChildPath
  );

  const expectedItemType = listParentNode.type;
  const expectedContentType = listParentFirstChildNode.type;

  // Convert the list item content type if it's not already the right type
  //
  // - Before Ex:  ul > li > p > text
  // - After Ex:   ul > li > contentType > text
  if (contentNode.type !== expectedContentType) {
    Transforms.setNodes(
      editor,
      {
        type: expectedContentType,
      },
      {
        at: contentPath,
      }
    );
  }

  // Convert the list item type if it's not already the right type to the right type
  //
  // - Before Ex:  ul > li > contentType > text
  // - After Ex:   ul > itemType > contentType > text
  if (listItemNode.type !== expectedItemType) {
    Transforms.setNodes(
      editor,
      {
        type: expectedItemType,
      },
      {
        at: listItemPath,
      }
    );
  }

  const newListItemPath = Path.next(listParentPath);

  // Move the list item into the parent node after the current list
  //
  //    Before:
  //      - Line 1    # listParentPath
  //        - Line 2  # listItemPath
  //
  //    After:
  //      - Line 1    # listParentPath
  //      - Line 2    # newListItemPath
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: newListItemPath,
  });

  // Determine if we need to move next siblings into the moved node
  const listItemIndex = listItemPath[listItemPath.length - 1];
  const siblingPath = [...listItemPath];
  const newListPath = newListItemPath.concat(1);

  if (listNode.children.length > listItemIndex + 1) {
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

    const siblingNodes = listNode.children.slice(listItemIndex + 1);

    let newSiblingIndex = 0;
    siblingNodes.forEach(() => {
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
  }

  // Delete the former sublist if unindented list item was the only item
  if (listItemIndex === 0) {
    Transforms.removeNodes(editor, {
      at: listPath,
    });
  }

  return true;
}
