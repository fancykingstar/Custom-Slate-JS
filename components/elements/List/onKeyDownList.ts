import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleListBackspaceKey from 'components/elements/List/handleListBackspaceKey';
import handleListEnterKey from 'components/elements/List/handleListEnterKey';
import handleListTabKey from 'components/elements/List/handleListTabKey';

// TODO: Better structure onKeyDown "plugins" so it's not as hacky
export default function onKeyDownList(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleListTabKey(editor, event);
  }

  if (isKeyHotkey(Keys.Enter, event)) {
    return handleListEnterKey(editor, event);
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleListBackspaceKey(editor, event);
  }

  return false;
}
