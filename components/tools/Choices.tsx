import { Editor, Transforms } from 'slate';

export enum ChoicesName {
  Type = 'tool-choices',
}

export function insertChoicesTool(editor: Editor): void {
  const text = { text: '' };
  const node = { type: ChoicesName.Type, children: [text] };

  Transforms.insertNodes(editor, node);
}

export default function ChoicesTool(): JSX.Element {
  return <></>;
}
