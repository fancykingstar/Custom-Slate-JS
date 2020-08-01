import { DefaultElement, RenderElementProps } from 'slate-react';
import ChoicesTool, { ChoicesName } from './tools/Choices';
import styles from './Element.module.scss';

export enum BaseElement {
  Title = 'title',
  Paragraph = 'paragraph',
}

export default function Element(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  switch (element.type) {
    case BaseElement.Title:
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <h1 {...attributes} className={styles.title}>
          {children}
        </h1>
      );
    case ChoicesName.ToolType:
      return <ChoicesTool {...props} />;
    case BaseElement.Paragraph:
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <p {...attributes} className={styles.p}>
          {children}
        </p>
      );
    default:
      return <DefaultElement {...props} />;
  }
}
