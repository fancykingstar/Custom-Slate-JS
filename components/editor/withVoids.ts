import { ReactEditor } from 'slate-react';
import { CategorizerElement } from 'components/elements/Categorizer/CategorizerElement';
import { ConclusionElement } from 'components/elements/Conclusion/ConclusionElement';
import { EmotionElement } from 'components/elements/Emotion/EmotionElement';

const withVoids = (editor: ReactEditor): ReactEditor => {
  const { isVoid } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.isVoid = (element) => {
    return element.type === CategorizerElement.Wrapper ||
      element.type === ConclusionElement.Choices ||
      element.type === EmotionElement.Wrapper
      ? true
      : isVoid(element);
  };

  return editor;
};

export default withVoids;
