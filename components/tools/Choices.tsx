import { Editor, Transforms } from 'slate';

export function insertChoicesTool(editor: Editor): void {
  const text = { text: '' };
  const node = { type: 'tool-choices', children: [text] };

  Transforms.insertNodes(editor, node);
}

export default function ChoicesTool(): JSX.Element {
  return <></>;
}
