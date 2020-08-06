import { Editor, Location, Node, Transforms, Range } from 'slate';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { BasicElement } from 'components/elements/Element';

const ListElements = [
  BasicElement.OrderedList,
  BasicElement.UnorderedList,
  InversionElement.ItemSublist,
] as string[];

/**
 * Indents a list item.
 *
 * - Assumes a rendering structure based on `ul` and `li` HTML elements.
 *    - `ul (listType) > li (itemType) > p (contentType)`
 *
 * @param editor Slate editor
 * @param listType Desired list type
 * @param itemType Desired item type
 * @param contentType Desired item content type
 * @param at Location of cursor (defaults to editor selection)
 * @returns True if the indentation operation succeeds
 */
export default function indentListItem(
  editor: Editor,
  listType: string,
  itemType: string,
  contentType: string,
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

  // Do nothing if there is no previous sibling
  const previousSiblingEntry = Editor.previous(editor, { at: listItemPath });
  if (previousSiblingEntry == null) {
    return false;
  }

  // Convert the list item content type if it's not already the right type
  if (contentNode.type !== contentType) {
    Transforms.setNodes(
      editor,
      {
        type: contentType,
      },
      {
        at: contentPath,
      }
    );
  }

  // Convert the list item type if it's not already the right type to the right type
  if (listItemNode.type !== itemType) {
    Transforms.setNodes(
      editor,
      {
        type: itemType,
      },
      {
        at: listItemPath,
      }
    );
  }

  const [previousSiblingNode, previousSiblingPath] = previousSiblingEntry;
  const previousSiblingChildren = previousSiblingNode.children as Node[];
  const previousSiblingSublist = previousSiblingChildren.find((n: Node) =>
    ListElements.includes(n.type as string)
  ) as Element | undefined;

  let newPath = null;

  // If the sublist doesn't exist, wrap the current item in a new list
  if (previousSiblingSublist == null) {
    Transforms.wrapNodes(
      editor,
      {
        type: listType,
        children: [],
      },
      {
        at: listItemPath,
      }
    );

    newPath = previousSiblingPath.concat(1);
  } else {
    // If the previous item's sublist exists, it's at index 1 of the previous item's children
    newPath = previousSiblingPath.concat([
      1,
      previousSiblingSublist.children.length,
    ]);
  }

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
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: newPath,
  });
  return true;
}
