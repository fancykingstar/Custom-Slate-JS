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

export function Wisdom(): JSX.Element | null {
  const { reversibility, understanding } = useContext(CategorizerContext);

  if (reversibility == null || understanding == null) {
    return null;
  }

  let wisdom = null;
  if (reversibility === CategorizerReversibility.Reversible) {
    if (understanding === CategorizerUnderstanding.Deep) {
      wisdom = 'Timebox this decision. You likely already know the answer.';
    } else if (understanding === CategorizerUnderstanding.Weak) {
      wisdom =
        'Spend a bit more time to understand things. Then make the decision.';
    }
  } else if (reversibility === CategorizerReversibility.NonReversible) {
    if (understanding === CategorizerUnderstanding.Deep) {
      wisdom =
        'This is a hard decision. But you’re close to making the decision.';
    } else if (understanding === CategorizerUnderstanding.Weak) {
      wisdom = 'Spend a lot more time to deeply understand this decision.';
    }
  }

  return <div>{wisdom}</div>;
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
      <div className={styles.section}>
        <Wisdom />
      </div>
      <div className={styles.section}>
        Is it easy to reverse the consequences of this decision?
        <div className={styles.buttons}>
          <label className={styles.button}>
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
          <label className={styles.button}>
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
      <div className={styles.section}>
        How well do you understand this decision?
        <div className={styles.buttons}>
          <label className={styles.button}>
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
          <label className={styles.button}>
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
