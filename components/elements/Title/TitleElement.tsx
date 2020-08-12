import { RenderElementProps } from 'slate-react';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './TitleElement.module.scss';

export default function TitleElement(props: RenderElementProps): JSX.Element {
  const { attributes, children, element } = props;

  const placeholder = (
    <span className={styles.placeholder}>What’s your question?</span>
  );

  return (
    <h1 {...attributes} className={styles.title}>
      {children}
      <InlinePlaceholder element={element} blurChildren={placeholder}>
        {placeholder}
      </InlinePlaceholder>
    </h1>
  );
}
