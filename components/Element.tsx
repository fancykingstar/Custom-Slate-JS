import { DefaultElement, RenderElementProps } from 'slate-react';
import * as Choices from './tools/Choices';
import styles from './Element.module.scss';

export enum BaseElement {
  Title = 'title',
  Paragraph = 'paragraph',
  UnorderedList = 'unordered-list',
  ListItem = 'list-item',
}

export default function Element(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  switch (element.type) {
    case BaseElement.Title:
      return (
        <h1 {...attributes} className={styles.title}>
          {children}
        </h1>
      );
    case BaseElement.Paragraph:
      return (
        <p {...attributes} className={styles.p}>
          {children}
        </p>
      );
    case BaseElement.UnorderedList:
      return (
        <ul {...attributes} className={styles.ul}>
          {children}
        </ul>
      );
    case BaseElement.ListItem:
      return <li {...attributes}>{children}</li>;
    case Choices.Type.Tool:
      return <Choices.ToolElement {...props} />;
    case Choices.Type.Choice:
      return <Choices.ChoiceElement {...props} />;
    case Choices.Type.Name:
      return <Choices.NameElement {...props} />;
    case Choices.Type.Explanation:
      return <Choices.ExplanationElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}
