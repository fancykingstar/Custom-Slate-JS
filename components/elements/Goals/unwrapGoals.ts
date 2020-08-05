import { Editor, Transforms } from 'slate';
import { BasicElement } from 'components/elements/Element';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';

export default function unwrapGoals(editor: Editor): void {
  Transforms.setNodes(editor, { type: BasicElement.Paragraph });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === GoalsElement.Item,
  });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === GoalsElement.Wrapper,
    split: true,
  });
}
