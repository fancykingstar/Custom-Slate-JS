import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleChoicesEnterKey from 'components/elements/Choices/handleChoicesEnterKey';
import handleChoicesBackspaceKey from 'components/elements/Choices/handleChoicesBackspaceKey';
import handleChoicesTabKey from 'components/elements/Choices/handleChoicesTabKey';

export default function onKeyDownChoices(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleChoicesTabKey(editor, event);
  }

  if (isKeyHotkey(Keys.Enter, event) || isKeyHotkey('shift+enter', event)) {
    return handleChoicesEnterKey(editor, event);
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleChoicesBackspaceKey(editor, event);
  }

  return false;
}
