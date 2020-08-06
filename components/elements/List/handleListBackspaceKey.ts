import { Editor, Range } from 'slate';
import { BasicElement } from 'components/elements/Element';
import { nodeIsType, isSelectionAtBlockStart } from 'components/editor/queries';
import runEditorBehaviors from 'components/editor/runEditorBehaviors';
import exitListAtStartOfListItem from 'components/editor/behaviors/exitListAtStartOfListItem';
import unindentNestedListItemOnStart from 'components/editor/behaviors/unindentNestedListItemOnStart';

export default function handleListBackspaceKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  if (
    !Range.isCollapsed(selection) ||
    !nodeIsType(editor, BasicElement.ListItem)
  ) {
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
      [unindentNestedListItemOnStart]
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
  if (isSelectionAtBlockStart(editor) && !Editor.isEditor(listParentNode)) {
    return false;
  }

  if (
    runEditorBehaviors(
      editor,
      [BasicElement.UnorderedList, BasicElement.OrderedList],
      [exitListAtStartOfListItem]
    )
  ) {
    event.preventDefault();
    return true;
  }

  return false;
}
