import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleInversionEnterKey from 'components/elements/Inversion/handleInversionEnterKey';
import handleInversionBackspaceKey from 'components/elements/Inversion/handleInversionBackspaceKey';
import handleInversionTabKey from 'components/elements/Inversion/handleInversionTabKey';

export default function onKeyDownInversion(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleInversionTabKey(editor, event);
  }

  if (isKeyHotkey(Keys.Enter, event) || isKeyHotkey('shift+enter', event)) {
    return handleInversionEnterKey(editor, event);
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleInversionBackspaceKey(editor, event);
  }

  return false;
}
