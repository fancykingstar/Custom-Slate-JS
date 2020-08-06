import { Editor, Range, Transforms, Path } from 'slate';
import {
  isBlockAboveEmpty,
  isBlockTextEmptyAfterSelection,
} from 'components/editor/queries';

/**
 * If caret is at end of root list item with content, add new sublist below and move caret.
 *
 * ### Before:
 * - Line 1|
 * - Line 2
 *
 * ### After:
 * - Line 1
 *   - |
 * - Line 2
 */
export default function addNewSublistBelowOnEndOfFilledRootListItem(
  editor: Editor,
  _: string[],
  listType: string,
  itemType: string,
  contentType: string
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const [, contentPath] = Editor.parent(editor, selection); // p
  const [listItemNode, listItemPath] = Editor.parent(editor, contentPath); // li

  const isFirstLevelListItem = listItemPath.length === 2;
  const nodeHasContent = !isBlockAboveEmpty(editor);
  const isEndOfListItem = isBlockTextEmptyAfterSelection(editor);
  const listItemHasSublist = listItemNode.children.length > 1;

  if (
    Range.isCollapsed(selection) &&
    isFirstLevelListItem &&
    nodeHasContent &&
    isEndOfListItem &&
    !listItemHasSublist
  ) {
    const sublistPath = Path.next(contentPath);
    Transforms.insertNodes(
      editor,
      {
        type: listType,
        children: [
          {
            type: itemType,
            children: [
              {
                type: contentType,
                children: [{ text: '' }],
              },
            ],
          },
        ],
      },
      {
        at: sublistPath,
      }
    );
    Transforms.select(editor, sublistPath);
    return true;
  }

  return false;
}
