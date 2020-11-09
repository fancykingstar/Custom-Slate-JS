import { MouseEvent, useContext } from 'react';

import { RenderLeafProps } from 'slate-react';

import { Author } from 'components/editor/author';
import { Zap } from 'components/icons/Icons';
import { Action, Store } from 'store/store';

import styles from './Leaf.module.scss';

export default function Leaf(props: RenderLeafProps): JSX.Element {
  const { attributes, children, leaf } = props;
  const { dispatch } = useContext(Store);
  let className;
  let magicSymbol;
  if (leaf.slashHightlight) {
    className = styles.slashHighlight;
  } else if (leaf.suggestedStar && leaf.text !== '' && !leaf.removedSuggested) {
    className = styles.suggestedStar;
  } else if (leaf.author === Author.Deca) {
    if (leaf.text && leaf.text === leaf.original) {
      magicSymbol = (
        <span className={styles.zap} contentEditable={false}>
          <Zap />
        </span>
      );
    }
    className = styles.generated;
  }
  if (leaf.star && leaf.text.trim() !== '') {
    magicSymbol = null;
    className = styles.starText;
  }

  return (
    <span {...attributes} className={className}>
      {magicSymbol}
      {children}
    </span>
  );
}
