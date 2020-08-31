import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleGoalsEnterKey from 'components/elements/Goals/handleGoalsEnterKey';
import handleGoalsBackspaceKey from 'components/elements/Goals/handleGoalsBackspaceKey';
import handleGoalsTabKey from 'components/elements/Goals/handleGoalsTabKey';

export default function onKeyDownGoals(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleGoalsTabKey(editor, event);
  }

  if (isKeyHotkey(Keys.Enter, event) || isKeyHotkey('shift+enter', event)) {
    return handleGoalsEnterKey(editor, event);
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleGoalsBackspaceKey(editor, event);
  }

  return false;
}
