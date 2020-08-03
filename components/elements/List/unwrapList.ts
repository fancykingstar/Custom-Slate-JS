import { Editor, Transforms } from 'slate';
import { BaseElement } from '../../Element';
import { isList } from '../../editor/queries';

/**
 * Converts the current list item into a paragraph block.
 */
export default function unwrapList(editor: Editor): void {
  Transforms.setNodes(editor, { type: BaseElement.Paragraph });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === BaseElement.ListItem,
  });
  Transforms.unwrapNodes(editor, {
    match: (n) => isList(n),
    split: true,
  });
}
