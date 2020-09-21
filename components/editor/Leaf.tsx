import { MouseEvent, useContext } from 'react';

import levenshtein from 'fast-levenshtein';
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
  } else if (leaf.suggestedStar && leaf.text !== '') {
    className = styles.suggestedStar;
  } else if (leaf.author && leaf.author === Author.Deca) {
    const original = leaf.original as string;
    const distance = levenshtein.get(leaf.text, original);
    if (original.length && distance / original.length <= 0.5) {
      magicSymbol = (
        <span className={styles.zap} contentEditable={false}>
          <Zap />
        </span>
      );
      className = styles.generated;
    }
  }

  return (
    <span {...attributes} className={className}>
      {magicSymbol}
      {children}
    </span>
  );
}
