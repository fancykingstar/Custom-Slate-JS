import { useContext } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';
import {
  CategorizerContext,
  CategorizerReversibility,
  CategorizerUnderstanding,
} from 'components/context';
import styles from './CategorizerElement.module.scss';

export enum CategorizerElement {
  Wrapper = 'categorizer-wrapper',
}

export function CategorizerWrapperElement(
  props: RenderElementProps
): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  const context = useContext(CategorizerContext);

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''}`}
      contentEditable={false}
    >
      <h2 className={styles.toolName}>Categorizer</h2>
      <div className={styles.text}>
        Is it easy to reverse the consequences of this decision?
        <div className={styles.buttons}>
          <label>
            <input
              type="radio"
              name="reversibility"
              value="CategorizerReversibility.Reversible"
              onChange={() =>
                context.setReversibility(CategorizerReversibility.Reversible)
              }
            />{' '}
            Easy
          </label>
          <label>
            <input
              type="radio"
              name="reversibility"
              value="CategorizerReversibility.NonReversible"
              onChange={() =>
                context.setReversibility(CategorizerReversibility.NonReversible)
              }
            />{' '}
            Hard
          </label>
        </div>
      </div>
      <div className={styles.text}>
        How well do you understand this decision?
        <div className={styles.buttons}>
          <label>
            <input
              type="radio"
              name="understanding"
              value="CategorizerUnderstanding.Deep"
              onChange={() =>
                context.setUnderstanding(CategorizerUnderstanding.Deep)
              }
            />{' '}
            Deeply
          </label>
          <label>
            <input
              type="radio"
              name="understanding"
              value="CategorizerUnderstanding.Weak"
              onChange={() =>
                context.setUnderstanding(CategorizerUnderstanding.Weak)
              }
            />{' '}
            Weakly
          </label>
        </div>
      </div>
      {children}
    </div>
  );
}
