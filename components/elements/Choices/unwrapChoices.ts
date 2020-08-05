import { Editor, Transforms } from 'slate';
import { BasicElement } from 'components/elements/Element';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';

export default function unwrapChoices(editor: Editor): void {
  Transforms.setNodes(editor, { type: BasicElement.Paragraph });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === ChoicesElement.Item,
  });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === ChoicesElement.Wrapper,
    split: true,
  });
}
