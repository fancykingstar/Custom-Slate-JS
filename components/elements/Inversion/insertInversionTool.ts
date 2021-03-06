import { Editor, Transforms } from 'slate';

import { InversionElement } from 'components/elements/Inversion/InversionElement';
import { ToolName, trackInsertTool } from 'components/metrics';

/**
 * Converts the node at the current selection into an Inversion tool.
 */
export default function insertInversionTool(editor: Editor): void {
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
    type: InversionElement.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: InversionElement.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      timestamp: Date.now(),
      type: InversionElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );

  trackInsertTool(ToolName.Inversion);
}
