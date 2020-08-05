import { DefaultElement, RenderElementProps } from 'slate-react';
import {
  ChoicesElement,
  ChoicesWrapperElement,
  ChoicesItemElement,
  ChoicesItemTitleElement,
} from 'components/elements/Choices/ChoicesElement';
import styles from './Element.module.scss';

/**
 * Elements that users should not be able to manually add.
 */
export enum ReservedElement {
  Title = 'h1',
}

export enum BasicElement {
  Paragraph = 'p',
  OrderedList = 'ol',
  UnorderedList = 'ul',
  ListItem = 'li',
}

export type ListElementTypes =
  | BasicElement.OrderedList
  | BasicElement.UnorderedList;

export const ListElements = [
  BasicElement.OrderedList,
  BasicElement.UnorderedList,
];

export default function Element(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  switch (element.type) {
    case ReservedElement.Title:
      return (
        <h1 {...attributes} className={styles.title}>
          {children}
        </h1>
      );
    case BasicElement.Paragraph:
      return (
        <p {...attributes} className={styles.p}>
          {children}
        </p>
      );
    case BasicElement.UnorderedList:
      return (
        <ul {...attributes} className={styles.ul}>
          {children}
        </ul>
      );
    case BasicElement.OrderedList:
      return (
        <ol {...attributes} className={styles.ol}>
          {children}
        </ol>
      );
    case BasicElement.ListItem:
      return <li {...attributes}>{children}</li>;
    case ChoicesElement.Wrapper:
      return <ChoicesWrapperElement {...props} />;
    case ChoicesElement.Item:
      return <ChoicesItemElement {...props} />;
    case ChoicesElement.ItemTitle:
      return <ChoicesItemTitleElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}
