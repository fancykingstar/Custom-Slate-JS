import { RenderLeafProps } from 'slate-react';
import styles from './Leaf.module.scss';

export default function Leaf(props: RenderLeafProps): JSX.Element {
  const { attributes, children, leaf } = props;

  let className;
  if (leaf.slashHightlight) {
    className = styles.slashHighlight;
  } else if (leaf.interestingHighlight && leaf.text !== '') {
    className = styles.interestingHighlight;
  }

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  );
}
