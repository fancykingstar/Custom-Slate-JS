import { MouseEvent, useContext } from 'react';

import { RenderLeafProps } from 'slate-react';

import { Action, Store } from 'store/store';

import styles from './Leaf.module.scss';

export default function Leaf(props: RenderLeafProps): JSX.Element {
  const { attributes, children, leaf } = props;
  const { dispatch } = useContext(Store);

  let className;
  if (leaf.slashHightlight) {
    className = styles.slashHighlight;
  } else if (leaf.suggestedStar && leaf.text !== '') {
    className = styles.suggestedStar;
  }

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  );
}
