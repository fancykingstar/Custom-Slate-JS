import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleChoicesBackspaceKey from 'components/elements/Choices/handleChoicesBackspaceKey';
import handleChoicesCompleteKey from 'components/elements/Choices/handleChoicesCompleteKey';
import handleChoicesEnterKey from 'components/elements/Choices/handleChoicesEnterKey';
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

  if (isKeyHotkey('mod+space', event)) {
    return handleChoicesCompleteKey(editor, event);
  }

  return false;
}
