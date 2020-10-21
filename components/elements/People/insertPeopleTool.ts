import { Editor, Transforms, Node } from 'slate';

import {
  PeopleElement,
  PeopleRole,
} from 'components/elements/People/PeopleElement';
import { ToolName, trackInsertTool } from 'components/metrics';

/**
 * Converts the node at the current selection into an People tool.
 *
 * Copies choices from the choices tool if they're available.
 */
export default function insertPeopleTool(editor: Editor): void {
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
    type: PeopleElement.Team,
    children: [{ text: '' }],
  });
  nodes.push({
    type: PeopleElement.Item,
    children: [{ text: '' }],
    indent: 0,
    probability: PeopleRole.None,
  });

  let newSelection = paragraphPath;
  newSelection = newSelection.concat([1, 0]);

  Transforms.insertNodes(
    editor,
    {
      timestamp: Date.now(),
      type: PeopleElement.Tool,
      children: nodes,
    },
    {
      at: paragraphPath,
    }
  );

  Transforms.select(editor, newSelection);

  trackInsertTool(ToolName.People);
}
