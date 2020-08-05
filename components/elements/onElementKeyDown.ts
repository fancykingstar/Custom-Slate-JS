import { Editor } from 'slate';
import onKeyDownList from './List/List';
import onKeyDownChoices from './Choices/Choices';

export default function onElementKeyDown(
  editor: Editor,
  event: KeyboardEvent
): void {
  if (onKeyDownList(editor, event)) {
    return;
  }
  onKeyDownChoices(editor, event);
}
