import { RenderElementProps } from 'slate-react';
import styles from './TitleElement.module.scss';

export default function TitleElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <h1 {...attributes} className={styles.title}>
      {children}
    </h1>
  );
}
