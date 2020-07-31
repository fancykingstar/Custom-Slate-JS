import { DefaultElement, RenderElementProps } from 'slate-react';
import ChoicesTool, { ChoicesName } from './tools/Choices';

export default function Element(props: RenderElementProps): JSX.Element {
  const { element } = props;

  switch (element.type) {
    case ChoicesName.Type:
      return <ChoicesTool />;
    default:
      return <DefaultElement {...props} />;
  }
}
