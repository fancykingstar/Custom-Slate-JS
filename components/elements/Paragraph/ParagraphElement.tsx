import { RenderElementProps } from 'slate-react';
import styles from './ParagraphElement.module.scss';

export default function ParagraphElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children } = props;
  return (
    <p {...attributes} className={styles.p}>
      {children}
    </p>
  );
}
