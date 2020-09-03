import { Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';
import handleConclusionEnterKey from 'components/elements/Conclusion/handleConclusionEnterKey';
import handleConclusionBackspaceKey from 'components/elements/Conclusion/handleConclusionBackspaceKey';
import handleConclusionTabKey from 'components/elements/Conclusion/handleConclusionTabKey';

export default function onKeyDownConclusion(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event) || isKeyHotkey(Keys.ShiftTab, event)) {
    return handleConclusionTabKey(editor, event);
  }

  // if (isKeyHotkey(Keys.Enter, event) || isKeyHotkey('shift+enter', event)) {
  //   return handleConclusionEnterKey(editor, event);
  // }

  if (isKeyHotkey(Keys.Backspace, event)) {
    return handleConclusionBackspaceKey(editor, event);
  }

  return false;
}
