import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from '../../editor/keys';
import handleChoicesEnterKey from './handleChoicesEnterKey';
import handleChoicesBackspaceKey from './handleChoicesBackspaceKey';
import handleChoicesTabKey from './handleChoicesTabKey';

export default function onKeyDownChoices(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleChoicesTabKey(editor, event);
  }

  if (isKeyHotkey(Keys.Enter, event)) {
    return handleChoicesEnterKey(editor, event);
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleChoicesBackspaceKey(editor, event);
  }

  return false;
}
