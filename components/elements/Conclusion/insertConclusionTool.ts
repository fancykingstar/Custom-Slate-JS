import { Editor, Node, Transforms } from 'slate';

import { ConclusionElement } from 'components/elements/Conclusion/ConclusionElement';
import { ToolName, trackInsertTool } from 'components/metrics';

/**
 * Converts the node at the current selection into a Choice tool.
 */
export default function insertConclusionTool(editor: Editor): void {
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

  const nodes: Node[] = [];

  nodes.push({
    type: ConclusionElement.Choices,
    children: [{ text: '' }],
  });

  nodes.push({
    type: ConclusionElement.Explanation,
    children: [{ text: '' }],
  });

  Transforms.insertNodes(
    editor,
    {
      timestamp: Date.now(),
      type: ConclusionElement.Wrapper,
      children: nodes,
    },
    {
      at: paragraphPath,
    }
  );

  let newSelection = paragraphPath;
  newSelection = newSelection.concat([1, 0]);
  Transforms.select(editor, newSelection);

  trackInsertTool(ToolName.Conclusion);
}
