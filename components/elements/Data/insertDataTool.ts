import { Editor, Transforms, Node } from 'slate';
import {
  DataElement,
  DataConfidence,
} from 'components/elements/Data/DataElement';

/**
 * Converts the node at the current selection into an Data tool.
 *
 * Copies choices from the choices tool if they're available.
 */
export default function insertDataTool(editor: Editor): void {
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
    type: DataElement.Category,
    children: [{ text: '' }],
  });
  nodes.push({
    type: DataElement.Item,
    children: [{ text: '' }],
    indent: 0,
    probability: DataConfidence.None,
  });
  nodes.push({
    type: DataElement.Legend,
    children: [],
  });

  let newSelection = paragraphPath;
  newSelection = newSelection.concat([1, 0]);

  Transforms.insertNodes(
    editor,
    {
      timestamp: Date.now(),
      type: DataElement.Tool,
      children: nodes,
    },
    {
      at: paragraphPath,
    }
  );

  Transforms.select(editor, newSelection);
}
