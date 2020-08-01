import { Editor, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';

export enum ChoicesName {
  ToolType = 'tool-choices',
  ItemType = 'tool-choice',
}

export function insertChoicesTool(editor: Editor): void {
  const node = {
    type: ChoicesName.ToolType,
    children: [
      {
        type: ChoicesName.ItemType,
        name: { text: 'Chartreuse' },
        children: [{ text: 'A color named for a French liqueur' }],
      },
      {
        type: ChoicesName.ItemType,
        name: { text: 'Falu' },
        children: [{ text: 'A color named for the Swedish city of Falun' }],
      },
    ],
  };

  Transforms.insertNodes(editor, node);
}

export default function ChoicesTool(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return <div {...attributes}>{children}</div>;
}
