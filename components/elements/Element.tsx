import { DefaultElement, RenderElementProps } from 'slate-react';
import {
  CategorizerElement,
  CategorizerWrapperElement,
} from 'components/elements/Categorizer/CategorizerElement';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import {
  ChoicesWrapperElement,
  ChoicesItemElement,
  ChoicesItemTitleElement,
} from 'components/elements/Choices/ChoicesElement';
import {
  ConclusionElement,
  ConclusionWrapperElement,
  ConclusionChoicesElement,
  ConclusionExplanationElement,
  ConclusionItemElement,
  ConclusionItemTitleElement,
} from 'components/elements/Conclusion/ConclusionElement';
import {
  DataElement,
  DataToolElement,
  DataCategoryElement,
  DataItemElement,
} from 'components/elements/Data/DataElement';
import {
  EmotionElement,
  EmotionWrapperElement,
} from 'components/elements/Emotion/EmotionElement';
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
  PeopleElement,
  PeopleToolElement,
  PeopleTeamElement,
  PeopleItemElement,
} from 'components/elements/People/PeopleElement';
import { ReservedElement } from 'components/elements/ReservedElement';
import {
  SimulationElement,
  SimulationToolElement,
  SimulationChoiceElement,
  SimulationItemElement,
} from 'components/elements/Simulation/SimulationElement';
import ParagraphElement from 'components/elements/Paragraph/ParagraphElement';
import TitleElement from 'components/elements/Title/TitleElement';
import styles from './Element.module.scss';

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
    case ChoicesType.Wrapper:
      return <ChoicesWrapperElement {...props} />;
    case ChoicesType.Item:
      return <ChoicesItemElement {...props} />;
    case ChoicesType.ItemTitle:
      return <ChoicesItemTitleElement {...props} />;
    case ConclusionElement.Wrapper:
      return <ConclusionWrapperElement {...props} />;
    case ConclusionElement.Choices:
      return <ConclusionChoicesElement {...props} />;
    case ConclusionElement.Explanation:
      return <ConclusionExplanationElement {...props} />;
    case ConclusionElement.Item:
      return <ConclusionItemElement {...props} />;
    case ConclusionElement.ItemTitle:
      return <ConclusionItemTitleElement {...props} />;
    case DataElement.Tool:
      return <DataToolElement {...props} />;
    case DataElement.Category:
      return <DataCategoryElement {...props} />;
    case DataElement.Item:
      return <DataItemElement {...props} />;
    case EmotionElement.Wrapper:
      return <EmotionWrapperElement {...props} />;
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
    case PeopleElement.Tool:
      return <PeopleToolElement {...props} />;
    case PeopleElement.Team:
      return <PeopleTeamElement {...props} />;
    case PeopleElement.Item:
      return <PeopleItemElement {...props} />;
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
