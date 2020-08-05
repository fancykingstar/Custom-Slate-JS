import { Editor, Transforms } from 'slate';
import { BasicElement } from 'components/elements/Element';
import { CriteriaElement } from 'components/elements/Criteria/CriteriaElement';

export default function unwrapCriteria(editor: Editor): void {
  Transforms.setNodes(editor, { type: BasicElement.Paragraph });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === CriteriaElement.Item,
  });
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === CriteriaElement.Wrapper,
    split: true,
  });
}
