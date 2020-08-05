import { Editor, Transforms } from 'slate';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';

/**
 * Converts the node at the current selection into a Choice tool.
 */
export default function insertCriteriaTool(editor: Editor): void {
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
    type: CriteriaElement.ItemTitle,
  });

  Transforms.wrapNodes(editor, {
    type: CriteriaElement.Item,
    children: [],
  });

  Transforms.wrapNodes(
    editor,
    {
      type: CriteriaElement.Wrapper,
      children: [],
    },
    {
      at: paragraphPath,
    }
  );
}
