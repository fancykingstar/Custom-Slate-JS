import { Editor, Element, Transforms } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Keys from 'components/editor/keys';

const minIndent = 0;
const maxIndent = 10;

function indentSelection(
  editor: Editor,
  event: KeyboardEvent,
  amount: number
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  // Get nodes in selection that have indent property
  const selectedNodes = Array.from(
    Editor.nodes(editor, {
      at: selection,
      match: (n) =>
        Element.isElement(n) && Editor.isBlock(editor, n) && n.indent != null,
    })
  );

  if (selectedNodes.length) {
    selectedNodes.forEach(([node, path]) => {
      const { indent } = node;
      if (indent == null || typeof indent !== 'number') {
        return;
      }

      const newIndent = Math.min(
        Math.max(indent + amount, minIndent),
        maxIndent
      );

      Transforms.setNodes(
        editor,
        {
          indent: newIndent,
        },
        {
          at: path,
        }
      );
    });

    event.preventDefault();
    return true;
  }

  return false;
}

export default function onKeyDownIssueTree(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  if (isKeyHotkey(Keys.Tab, event)) {
    return indentSelection(editor, event, 1);
  }

  if (isKeyHotkey(Keys.ShiftTab, event)) {
    return indentSelection(editor, event, -1);
  }

  return false;
}
