import { DefaultElement, RenderElementProps } from 'slate-react';
import ChoicesTool, { ChoicesName } from './tools/Choices';

export enum BaseElement {
  Title = 'title',
  Paragraph = 'paragraph',
}

export default function Element(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  switch (element.type) {
    case BaseElement.Title:
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <h1 {...attributes}>{children}</h1>;
    case ChoicesName.Type:
      return <ChoicesTool />;
    case BaseElement.Paragraph:
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <p {...attributes}>{children}</p>;
    default:
      return <DefaultElement {...props} />;
  }
}
