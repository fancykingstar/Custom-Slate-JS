import { DefaultElement, RenderElementProps } from 'slate-react';
import ChoicesTool from './tools/Choices';

export default function Element(props: RenderElementProps): JSX.Element {
  const { element } = props;

  switch (element.type) {
    case 'tool-choices':
      return <ChoicesTool />;
    default:
      return <DefaultElement {...props} />;
  }
}
