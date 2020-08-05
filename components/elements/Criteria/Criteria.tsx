import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleCriteriaEnterKey from 'components/elements/Criteria/handleCriteriaEnterKey';
import handleCriteriaBackspaceKey from 'components/elements/Criteria/handleCriteriaBackspaceKey';
import handleCriteriaTabKey from 'components/elements/Criteria/handleCriteriaTabKey';

export default function onKeyDownCriteria(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleCriteriaTabKey(editor, event);
  }

  if (isKeyHotkey(Keys.Enter, event)) {
    return handleCriteriaEnterKey(editor, event);
  }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleCriteriaBackspaceKey(editor, event);
  }

  return false;
}
