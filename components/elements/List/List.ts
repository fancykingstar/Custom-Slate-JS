import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from '../../editor/keys';
import handleListBackspaceKey from './handleListBackspaceKey';
import handleListEnterKey from './handleListEnterKey';
import handleListTabKey from './handleListTabKey';

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
