import { RenderElementProps, useSelected } from 'slate-react';
import styles from './CategorizerElement.module.scss';

export enum CategorizerElement {
  Wrapper = 'categorizer-wrapper',
}

export function CategorizerWrapperElement(
  props: RenderElementProps
): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''}`}
    >
      <h2
        className={styles.toolName}
        contentEditable={false}
        style={{ userSelect: 'none' }}
      >
        Categorizer
      </h2>
      <div contentEditable={false} style={{ userSelect: 'none' }}>
        How easy is it to reverse the impact of this decision?
      </div>
      <div contentEditable={false} style={{ userSelect: 'none' }}>
        <input type="radio" name="reversibility" value="easy" /> Easy
        <br />
        <input type="radio" name="reversibility" value="hard" /> Hard
      </div>
      {children}
    </div>
  );
}
