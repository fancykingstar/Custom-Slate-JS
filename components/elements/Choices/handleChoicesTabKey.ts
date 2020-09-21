import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import { nodeIsType, isRangeAtRoot } from 'components/editor/queries';
import { BasicElement } from 'components/elements/Element';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import indentListItem from 'components/editor/transforms/indentListItem';
import unindentListItem from 'components/editor/transforms/unindentListItem';

/**
 * Handles indentation of Choice tool items. Returns false if no changes were made.
 */
export default function handleChoicesTabKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === ChoicesType.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  // Do nothing if we're not in the Choices tool
  const [wrapperNode] = wrapperEntry;
  if (wrapperNode.type !== ChoicesType.Wrapper) {
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
    !nodeIsType(editor, ChoicesType.ItemTitle) &&
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
    return unindentListItem(editor);
  }

  if (isTab) {
    return indentListItem(
      editor,
      BasicElement.UnorderedList,
      BasicElement.ListItem,
      BasicElement.Paragraph
    );
  }

  return false;
}
