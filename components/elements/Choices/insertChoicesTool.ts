import { Editor, Transforms } from 'slate';

import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { ToolName, trackInsertTool } from 'components/metrics';

/**
 * Converts the node at the current selection into a Choice tool.
 */
export default function insertChoicesTool(editor: Editor): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  const entry = Editor.parent(editor, selection);
  if (entry == null) {
    return;
  }
  const [, paragraphPath] = entry;

  Transforms.delete(editor);

  Transforms.setNodes(editor, {
    type: ChoicesType.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: ChoicesType.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      timestamp: Date.now(),
      type: ChoicesType.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );

  trackInsertTool(ToolName.Choices);
}
