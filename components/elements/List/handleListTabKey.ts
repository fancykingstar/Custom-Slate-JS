import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { BasicElement } from 'components/elements/Element';
import {
  isRangeAtRoot,
  nodeIsType,
  isFirstChild,
} from 'components/editor/queries';
import Keys from 'components/editor/keys';
import indentListItem from 'components/editor/transforms/indentListItem';
import unindentListItem from 'components/editor/transforms/unindentListItem';

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

  const [listNode] = Editor.parent(editor, listItemPath);

  if (isShiftTab) {
    return unindentListItem(editor);
  }

  if (isTab && !isFirstChild(listItemPath)) {
    return indentListItem(
      editor,
      listNode.type as string,
      BasicElement.ListItem,
      BasicElement.Paragraph
    );
  }

  return false;
}
