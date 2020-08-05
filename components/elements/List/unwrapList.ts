import { Editor, Transforms } from 'slate';
import { BasicElement } from '../Element';
import isList from './isList';

/**
 * Converts the current list item into a paragraph block.
 */
export default function unwrapList(editor: Editor): void {
  Transforms.setNodes(editor, { type: BasicElement.Paragraph });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === BasicElement.ListItem,
  });
  Transforms.unwrapNodes(editor, {
    match: (n) => isList(n),
    split: true,
  });
}
