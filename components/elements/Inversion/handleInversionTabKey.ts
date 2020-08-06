import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import { isRangeAtRoot } from 'components/editor/queries';
import { InversionElement } from 'components/elements/Inversion/InversionElement';
import indentListItem from 'components/editor/transforms/indentListItem';
import unindentListItem from 'components/editor/transforms/unindentListItem';

/**
 * Handles indentation of Inversion tool items. Returns false if no changes were made.
 */
export default function handleInversionTabKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === InversionElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  // Do nothing if we're not in the Inversion tool
  const [wrapperNode] = wrapperEntry;
  if (wrapperNode.type !== InversionElement.Wrapper) {
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

  // Ignore elements that are not nested (for Inversion tool, everything is in the Inversion tool wrapper)
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
      InversionElement.ItemSublist,
      InversionElement.ItemSublistItem,
      InversionElement.ItemSublistItemParagraph
    );
  }

  return false;
}
