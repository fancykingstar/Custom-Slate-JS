import { useContext } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';
import {
  CategorizerContext,
  CategorizerDataCompleteness,
  CategorizerEasyToCompare,
  CategorizerEasyToReverse,
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
              name="reversible"
              value="easy"
              onChange={() =>
                context.setEasyToReverse(CategorizerEasyToReverse.Easy)
              }
            />{' '}
            Easy
          </label>
          <label>
            <input
              type="radio"
              name="reversible"
              value="hard"
              onChange={() =>
                context.setEasyToReverse(CategorizerEasyToReverse.Hard)
              }
            />{' '}
            Hard
          </label>
        </div>
      </div>
      <div className={styles.text}>
        Is it easy compare the choices?
        <div className={styles.buttons}>
          <label>
            <input
              type="radio"
              name="comparable"
              value="easy"
              onChange={() =>
                context.setEasyToCompare(CategorizerEasyToCompare.Easy)
              }
            />{' '}
            Easy
          </label>
          <label>
            <input
              type="radio"
              name="comparable"
              value="hard"
              onChange={() =>
                context.setEasyToCompare(CategorizerEasyToCompare.Hard)
              }
            />{' '}
            Hard
          </label>
        </div>
      </div>
      <div className={styles.text}>
        How much of the relevant data do you have?
        <div className={styles.buttons}>
          <label>
            <input
              type="radio"
              name="data"
              value="most"
              onChange={() =>
                context.setDataCompleteness(CategorizerDataCompleteness.Most)
              }
            />{' '}
            Most
          </label>
          <label>
            <input
              type="radio"
              name="data"
              value="some"
              onChange={() =>
                context.setDataCompleteness(CategorizerDataCompleteness.Some)
              }
            />{' '}
            Some
          </label>
        </div>
      </div>
      {children}
    </div>
  );
}
