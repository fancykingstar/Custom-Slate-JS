import { Editor } from 'slate';
import { BasicElement } from 'components/elements/Element';
import { isRangeAtRoot, isBlockAboveEmpty } from 'components/editor/queries';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import unindentEmptyNestedListItem from 'components/editor/behaviors/unindentEmptyNestedListItem';
import exitListOnFirstOnlyEmptyRootListItem from 'components/editor/behaviors/exitListOnFirstOnlyEmptyRootListItem';
import exitListOnFinalEmptyRootListItem from 'components/editor/behaviors/exitListOnFinalEmptyRootListItem';
import exitListOnEmptyMiddleListItem from 'components/editor/behaviors/exitListOnEmptyMiddleListItem';
import addNewListItemAboveOnStartOfListItem from 'components/editor/behaviors/addNewListItemAboveOnStartOfListItem';
import addNewListItemBelowOnEndOfListItem from 'components/editor/behaviors/addNewListItemBelowOnEndOfListItem';
import splitListItemOnMiddleOfListItem from 'components/editor/behaviors/splitListItemOnMiddleOfListItem';

/**
 * Handles logic for the Enter-key in lists.
 */
export default function handleListEnterKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
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

  if (
    runEditorBehaviors(
      editor,
      [BasicElement.UnorderedList, BasicElement.OrderedList],
      [unindentEmptyNestedListItem]
    )
  ) {
    event.preventDefault();
    return true;
  }

  const [, listPath] = Editor.parent(editor, listItemPath);
  const [listParentNode] = Editor.parent(editor, listPath);

  // If caret is in a nested empty list block and the parent node is not root
  // or another list item (i.e., the list is nested in another element type),
  // do nothing.
  //
  // This sets up a basic boundary for nested widgets. For now, we handle this manually
  // in element-specific code. In the future, it would be nice to make this more generic,
  // so the list item is automatically converted to the right structure.
  if (isBlockAboveEmpty(editor) && !Editor.isEditor(listParentNode)) {
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [BasicElement.UnorderedList, BasicElement.OrderedList],
      [
        exitListOnFirstOnlyEmptyRootListItem,
        exitListOnFinalEmptyRootListItem,
        exitListOnEmptyMiddleListItem,
        addNewListItemAboveOnStartOfListItem,
        addNewListItemBelowOnEndOfListItem,
        splitListItemOnMiddleOfListItem,
      ]
    )
  ) {
    event.preventDefault();
    return true;
  }

  return false;
}
