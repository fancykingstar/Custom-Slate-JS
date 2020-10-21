import { Editor, Transforms } from 'slate';

import { EmotionElement } from 'components/elements/Emotion/EmotionElement';
import { ToolName, trackInsertTool } from 'components/metrics';

/**
 * Converts the node at the current selection into an Categorizer tool.
 */
export default function insertEmotionTool(editor: Editor): void {
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

  Transforms.insertNodes(
    editor,
    {
      type: EmotionElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );

  trackInsertTool(ToolName.Emotion);
}
