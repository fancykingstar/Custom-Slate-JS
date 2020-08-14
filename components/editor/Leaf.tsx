import { RenderLeafProps } from 'slate-react';
import styles from './Leaf.module.scss';

export default function Leaf(props: RenderLeafProps): JSX.Element {
  const { attributes, children, leaf } = props;
  return (
    <span
      {...attributes}
      className={leaf.slashHighlight ? styles.slashHighlight : undefined}
    >
      {children}
    </span>
  );
}
