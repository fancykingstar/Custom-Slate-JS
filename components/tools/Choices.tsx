import { Editor, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import styles from './Choices.module.scss';

export enum Type {
  Tool = 'tool-choices',
  Choice = 'tool-choices-choice',
  Name = 'tool-choices-name',
  Explanation = 'tool-choices-explanation',
}

export function insertChoicesTool(editor: Editor): void {
  const node = {
    type: Type.Tool,
    children: [
      {
        type: Type.Choice,
        children: [
          {
            type: Type.Name,
            children: [{ text: 'Chartreuse' }],
          },
          {
            type: Type.Explanation,
            children: [{ text: 'A color named for a French liqueur' }],
          },
        ],
      },
      {
        type: Type.Choice,
        children: [
          {
            type: Type.Name,
            children: [{ text: 'Falu' }],
          },
          {
            type: Type.Explanation,
            children: [{ text: 'A color named for the Swedish city of Falun' }],
          },
        ],
      },
    ],
  };

  Transforms.insertNodes(editor, node);
}

export function ToolElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <div {...attributes} className={styles.tool}>
      {children}
    </div>
  );
}

export function ChoiceElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return <div {...attributes}>{children}</div>;
}

export function NameElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <p {...attributes} className={styles.name}>
      {children}
    </p>
  );
}

export function ExplanationElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return <p {...attributes}>{children}</p>;
}
