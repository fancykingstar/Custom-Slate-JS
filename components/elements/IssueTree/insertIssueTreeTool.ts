import { Editor, Transforms, Node } from 'slate';

import {
  IssueTreeElement,
  IssueTreeKind,
  IssueTreeRole,
} from 'components/elements/IssueTree/IssueTreeElement';
import { ToolName, trackInsertTool } from 'components/metrics';

/**
 * Converts the node at the current selection into an IssueTree tool.
 *
 * Copies choices from the choices tool if they're available.
 */
export default function insertIssueTreeTool(editor: Editor): void {
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
    type: IssueTreeElement.Question,
    children: [{ text: '' }],
  });
  nodes.push({
    type: IssueTreeElement.Item,
    children: [{ text: '' }],
    indent: 0,
    probability: IssueTreeRole.None,
  });

  let newSelection = paragraphPath;
  newSelection = newSelection.concat([0, 0]);

  Transforms.insertNodes(
    editor,
    {
      timestamp: Date.now(),
      type: IssueTreeElement.Tool,
      children: nodes,
      kind: IssueTreeKind.Problem,
    },
    {
      at: paragraphPath,
    }
  );

  Transforms.select(editor, newSelection);

  trackInsertTool(ToolName.IssueTree);
}
