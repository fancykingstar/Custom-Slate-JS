import { useContext, useState, useEffect } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';
import { CategorizerContext, DecisionCategory } from 'components/context';
import styles from './CategorizerElement.module.scss';

export enum CategorizerElement {
  Wrapper = 'categorizer-wrapper',
}

export enum CategorizerReversibility {
  Reversible,
  NonReversible,
}

export enum CategorizerUnderstanding {
  Deep,
  Weak,
}

export function CategorizerWrapperElement(
  props: RenderElementProps
): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  // TODO: Move categorizer state to slate doc structure to preserve data on undo
  const [
    reversibility,
    setReversibility,
  ] = useState<CategorizerReversibility | null>(null);
  const [
    understanding,
    setUnderstanding,
  ] = useState<CategorizerUnderstanding | null>(null);

  const context = useContext(CategorizerContext);

  useEffect(() => {
    let category = null;
    if (reversibility === CategorizerReversibility.Reversible) {
      if (understanding === CategorizerUnderstanding.Deep) {
        category = DecisionCategory.Snap;
      } else if (understanding === CategorizerUnderstanding.Weak) {
        category = DecisionCategory.Timebox;
      }
    } else if (reversibility === CategorizerReversibility.NonReversible) {
      if (understanding === CategorizerUnderstanding.Deep) {
        category = DecisionCategory.Leap;
      } else if (understanding === CategorizerUnderstanding.Weak) {
        category = DecisionCategory.Deliberate;
      }
    }

    if (category == null) {
      return;
    }

    context.setDecisionCategory(category);
  }, [reversibility, understanding]);

  useEffect(() => {
    return () => {
      context.setDecisionCategory(null);
    };
  }, []);

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''}`}
      contentEditable={false}
    >
      <h2 className={styles.toolName}>Categorizer</h2>
      <div className={styles.grid}>
        <div className={styles.section}>
          <p className={styles.question}>
            Is it easy to reverse the consequences of this decision?
          </p>
          <div className={styles.buttons}>
            <label className={styles.button}>
              <input
                type="radio"
                name="reversibility"
                value={CategorizerReversibility.Reversible}
                onChange={() =>
                  setReversibility(CategorizerReversibility.Reversible)
                }
              />
              <span>Easy</span>
            </label>
            <label className={styles.button}>
              <input
                type="radio"
                name="reversibility"
                value={CategorizerReversibility.NonReversible}
                onChange={() =>
                  setReversibility(CategorizerReversibility.NonReversible)
                }
              />
              <span>Hard</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <p className={styles.question}>
            How well do you understand this decision?
          </p>
          <div className={styles.buttons}>
            <label className={styles.button}>
              <input
                type="radio"
                name="understanding"
                value={CategorizerUnderstanding.Deep}
                onChange={() => setUnderstanding(CategorizerUnderstanding.Deep)}
              />
              <span>Deeply</span>
            </label>
            <label className={styles.button}>
              <input
                type="radio"
                name="understanding"
                value={CategorizerUnderstanding.Weak}
                onChange={() => setUnderstanding(CategorizerUnderstanding.Weak)}
              />
              <span>Weakly</span>
            </label>
          </div>
        </div>
        <div className={styles.suggestion}>
          <h3 className={styles.suggestionLabel}>Suggestion</h3>
          <Suggestion
            reversibility={reversibility}
            understanding={understanding}
          />
        </div>
      </div>
      {children}
    </div>
  );
}

interface SuggestionProps {
  reversibility: CategorizerReversibility | null;
  understanding: CategorizerUnderstanding | null;
}

function Suggestion(props: SuggestionProps): JSX.Element | null {
  const { decisionCategory } = useContext(CategorizerContext);
  const { reversibility, understanding } = props;

  if (decisionCategory == null) {
    let remaining = '';

    if (
      (reversibility == null && understanding != null) ||
      (reversibility != null && understanding == null)
    ) {
      remaining = '1 question left';
    } else if (reversibility == null && understanding == null) {
      remaining = '2 questions left';
    } else {
      return null;
    }

    return <div className={styles.remainderPill}>{remaining}</div>;
  }

  let title = null;
  let body = null;

  switch (decisionCategory) {
    case DecisionCategory.Snap:
      title = 'Snap decision';
      body =
        'Make a quick decision based on what you already know. You probably know the answer.';
      break;
    case DecisionCategory.Timebox:
      title = 'Timebox decision';
      body =
        'Spend a bit more time to understand this decision, but timebox it. Then make the decision.';
      break;
    case DecisionCategory.Leap:
      title = 'Leap decision';
      body =
        "You've done the work for this hard decision. Now lay out your thinking, then trust yourself to make the leap.";
      break;
    case DecisionCategory.Deliberate:
      title = 'Deliberate decision';
      body =
        'This is a hard decision. Spend a lot more time to deeply understand this decision.';
      break;
    default:
  }

  return (
    <div className={styles.suggestionOutput}>
      <div
        className={`${styles.suggestionIcon} ${
          styles[`suggestionIcon-${decisionCategory}`]
        }`}
      />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
