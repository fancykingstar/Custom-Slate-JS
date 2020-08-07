import { ReactEditor } from 'slate-react';
import { CategorizerElement } from 'components/elements/Categorizer/CategorizerElement';

const withVoids = (editor: ReactEditor): ReactEditor => {
  const { isVoid } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.isVoid = (element) => {
    return element.type === CategorizerElement.Wrapper ? true : isVoid(element);
  };

  return editor;
};

export default withVoids;
