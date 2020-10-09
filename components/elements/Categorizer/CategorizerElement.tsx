import { useContext, useState, useEffect } from 'react';
import { RenderElementProps } from 'slate-react';
import { Context, DecisionCategory } from 'components/context';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolCategorizer } from 'components/icons/IconTool';
import styles from './CategorizerElement.module.scss';

export enum CategorizerElement {
  Wrapper = 'categorizer-wrapper',
}

export enum CategorizerReversibility {
  Reversible,
  NonReversible,
}

export enum CategorizerComplexity {
  Simple,
  Complex,
}

export function CategorizerWrapperElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children } = props;
  // TODO: Move categorizer state to slate doc structure to preserve data on undo
  const [
    reversibility,
    setReversibility,
  ] = useState<CategorizerReversibility | null>(null);
  const [complexity, setComplexity] = useState<CategorizerComplexity | null>(
    null
  );

  const context = useContext(Context);

  useEffect(() => {
    let category = null;

    if (reversibility === CategorizerReversibility.Reversible) {
      if (complexity === CategorizerComplexity.Simple) {
        category = DecisionCategory.ReversibleSimple;
      } else if (complexity === CategorizerComplexity.Complex) {
        category = DecisionCategory.ReversibleComplex;
      }
    } else if (reversibility === CategorizerReversibility.NonReversible) {
      if (complexity === CategorizerComplexity.Simple) {
        category = DecisionCategory.NonreversibleSimple;
      } else if (complexity === CategorizerComplexity.Complex) {
        category = DecisionCategory.NonreversibleComplex;
      }
    }

    if (category == null) {
      return;
    }

    context.categorizer.setDecisionCategory(category);
  }, [reversibility, complexity]);

  useEffect(() => {
    return () => {
      context.categorizer.setDecisionCategory(null);
    };
  }, []);

  return (
    <ToolWrapper
      attributes={attributes}
      name="Categorizer"
      icon={<IconToolCategorizer />}
    >
      <div className={styles.grid} contentEditable={false}>
        <div className={styles.sectionWrapper}>
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
              What’s the complexity of this decision?
            </p>
            <div className={styles.buttons}>
              <label className={styles.button}>
                <input
                  type="radio"
                  name="complexity"
                  value={CategorizerComplexity.Simple}
                  onChange={() => setComplexity(CategorizerComplexity.Simple)}
                />
                <span>Simple</span>
              </label>
              <label className={styles.button}>
                <input
                  type="radio"
                  name="complexity"
                  value={CategorizerComplexity.Complex}
                  onChange={() => setComplexity(CategorizerComplexity.Complex)}
                />
                <span>Complex</span>
              </label>
            </div>
          </div>
        </div>
        <div className={styles.suggestion}>
          <h3 className={styles.suggestionLabel}>Suggestion</h3>
          <Suggestion reversibility={reversibility} complexity={complexity} />
        </div>
      </div>
      {children}
    </ToolWrapper>
  );
}

interface SuggestionProps {
  reversibility: CategorizerReversibility | null;
  complexity: CategorizerComplexity | null;
}

function Suggestion(props: SuggestionProps): JSX.Element | null {
  const { categorizer } = useContext(Context);
  const { reversibility, complexity } = props;

  if (categorizer.decisionCategory == null) {
    let remaining = 0;

    if (reversibility == null) {
      remaining += 1;
    }

    if (complexity == null) {
      remaining += 1;
    }

    let message = null;
    if (remaining === 0) {
      return null;
    }
    if (remaining === 1) {
      message = '1 question left';
    } else {
      message = `${remaining} questions left`;
    }

    return <div className={styles.remainderPill}>{message}</div>;
  }

  const title = `${categorizer.decisionCategory}`;
  let body = null;

  switch (categorizer.decisionCategory) {
    case DecisionCategory.ReversibleSimple:
      body = 'Make a quick decision.';
      break;
    case DecisionCategory.ReversibleComplex:
      body = 'Spend some time but timebox the decision.';
      break;
    case DecisionCategory.NonreversibleSimple:
      body = 'Even if simple, spend the time to make the right decision.';
      break;
    case DecisionCategory.NonreversibleComplex:
      body =
        'This is a hard one. Spend a lot of time to understand the decision.';
      break;
    default:
  }

  return (
    <div className={styles.suggestionOutput}>
      <div
        className={`${styles.suggestionIcon} ${
          styles[`suggestionIcon-${categorizer.decisionCategory}`]
        }`}
      />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
