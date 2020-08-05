import { Editor } from 'slate';
import onKeyDownList from 'components/elements/List/List';
import onKeyDownChoices from 'components/elements/Choices/Choices';

export default function onElementKeyDown(
  editor: Editor,
  event: KeyboardEvent
): void {
  if (onKeyDownList(editor, event)) {
    return;
  }
  onKeyDownChoices(editor, event);
}
