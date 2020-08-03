import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from '../../editor/keys';
import handleListBackspaceKey from './handleListBackspaceKey';
import handleListEnterKey from './handleListEnterKey';
import handleListIndentation from './handleListIndentation';

// TODO: Better structure onKeyDown "plugins" so it's not as hacky
export default function onKeyDownList(
  editor: Editor,
  event: KeyboardEvent
): void {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    const indentChanged = handleListIndentation(editor, event);
    if (indentChanged) {
      return;
    }
  }

  if (isKeyHotkey(Keys.Enter, event)) {
    handleListEnterKey(editor, event);
    return;
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    handleListBackspaceKey(editor, event);
  }
}
