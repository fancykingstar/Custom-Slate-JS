import { DefaultElement, RenderElementProps } from 'slate-react';
import {
  CategorizerElement,
  CategorizerWrapperElement,
} from 'components/elements/Categorizer/CategorizerElement';
import {
  ChoicesElement,
  ChoicesWrapperElement,
  ChoicesItemElement,
  ChoicesItemTitleElement,
} from 'components/elements/Choices/ChoicesElement';
import {
  GoalsElement,
  GoalsWrapperElement,
  GoalsItemElement,
  GoalsItemTitleElement,
} from 'components/elements/Goals/GoalsElement';
import {
  InversionElement,
  InversionWrapperElement,
  InversionItemElement,
  InversionItemTitleElement,
  InversionSublistElement,
  InversionSublistItemElement,
  InversionSublistItemParagraphElement,
} from 'components/elements/Inversion/InversionElement';
import {
  SimulationElement,
  SimulationToolElement,
  SimulationChoiceElement,
  SimulationItemElement,
} from 'components/elements/Simulation/SimulationElement';
import ParagraphElement from 'components/elements/Paragraph/ParagraphElement';
import TitleElement from 'components/elements/Title/TitleElement';
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
      return <TitleElement {...props} />;
    case BasicElement.Paragraph:
      return <ParagraphElement {...props} />;
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
    case CategorizerElement.Wrapper:
      return <CategorizerWrapperElement {...props} />;
    case ChoicesElement.Wrapper:
      return <ChoicesWrapperElement {...props} />;
    case ChoicesElement.Item:
      return <ChoicesItemElement {...props} />;
    case ChoicesElement.ItemTitle:
      return <ChoicesItemTitleElement {...props} />;
    case GoalsElement.Wrapper:
      return <GoalsWrapperElement {...props} />;
    case GoalsElement.Item:
      return <GoalsItemElement {...props} />;
    case GoalsElement.ItemTitle:
      return <GoalsItemTitleElement {...props} />;
    case InversionElement.Wrapper:
      return <InversionWrapperElement {...props} />;
    case InversionElement.Item:
      return <InversionItemElement {...props} />;
    case InversionElement.ItemTitle:
      return <InversionItemTitleElement {...props} />;
    case InversionElement.ItemSublist:
      return <InversionSublistElement {...props} />;
    case InversionElement.ItemSublistItem:
      return <InversionSublistItemElement {...props} />;
    case InversionElement.ItemSublistItemParagraph:
      return <InversionSublistItemParagraphElement {...props} />;
    case SimulationElement.Tool:
      return <SimulationToolElement {...props} />;
    case SimulationElement.Choice:
      return <SimulationChoiceElement {...props} />;
    case SimulationElement.Item:
      return <SimulationItemElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}
