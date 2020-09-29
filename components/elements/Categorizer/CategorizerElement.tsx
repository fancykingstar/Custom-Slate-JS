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

export enum CategorizerUnderstanding {
  Deep,
  Weak,
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
  const [
    understanding,
    setUnderstanding,
  ] = useState<CategorizerUnderstanding | null>(null);

  const context = useContext(Context);

  useEffect(() => {
    let category = null;

    if (reversibility === CategorizerReversibility.Reversible) {
      if (complexity === CategorizerComplexity.Simple) {
        if (understanding === CategorizerUnderstanding.Deep) {
          category = DecisionCategory.Snap;
        } else if (understanding === CategorizerUnderstanding.Weak) {
          category = DecisionCategory.Dash;
        }
      } else if (complexity === CategorizerComplexity.Complex) {
        if (understanding === CategorizerUnderstanding.Deep) {
          category = DecisionCategory.Capstone;
        } else if (understanding === CategorizerUnderstanding.Weak) {
          category = DecisionCategory.Puzzle;
        }
      }
    } else if (reversibility === CategorizerReversibility.NonReversible) {
      if (complexity === CategorizerComplexity.Simple) {
        if (understanding === CategorizerUnderstanding.Deep) {
          category = DecisionCategory.Leap;
        } else if (understanding === CategorizerUnderstanding.Weak) {
          category = DecisionCategory.Parachute;
        }
      } else if (complexity === CategorizerComplexity.Complex) {
        if (understanding === CategorizerUnderstanding.Deep) {
          category = DecisionCategory.Summit;
        } else if (understanding === CategorizerUnderstanding.Weak) {
          category = DecisionCategory.Mountain;
        }
      }
    }

    if (category == null) {
      return;
    }

    context.categorizer.setDecisionCategory(category);
  }, [reversibility, complexity, understanding]);

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
                  onChange={() =>
                    setUnderstanding(CategorizerUnderstanding.Deep)
                  }
                />
                <span>Deeply</span>
              </label>
              <label className={styles.button}>
                <input
                  type="radio"
                  name="understanding"
                  value={CategorizerUnderstanding.Weak}
                  onChange={() =>
                    setUnderstanding(CategorizerUnderstanding.Weak)
                  }
                />
                <span>Weakly</span>
              </label>
            </div>
          </div>
        </div>
        <div className={styles.suggestion}>
          <h3 className={styles.suggestionLabel}>Suggestion</h3>
          <Suggestion
            reversibility={reversibility}
            complexity={complexity}
            understanding={understanding}
          />
        </div>
      </div>
      {children}
    </ToolWrapper>
  );
}

interface SuggestionProps {
  reversibility: CategorizerReversibility | null;
  complexity: CategorizerComplexity | null;
  understanding: CategorizerUnderstanding | null;
}

function Suggestion(props: SuggestionProps): JSX.Element | null {
  const { categorizer } = useContext(Context);
  const { reversibility, complexity, understanding } = props;

  if (categorizer.decisionCategory == null) {
    let remaining = 0;

    if (reversibility == null) {
      remaining += 1;
    }

    if (complexity == null) {
      remaining += 1;
    }

    if (understanding == null) {
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

  const title = `${categorizer.decisionCategory} decision`;
  let body = null;

  switch (categorizer.decisionCategory) {
    // Reversible, simple
    case DecisionCategory.Snap:
      body = 'Make a quick decision. You may already know the answer.';
      break;
    case DecisionCategory.Dash:
      body =
        'Spend a bit more time to understand this decision, but timebox it. Then you might know the answer.';
      break;

    // Reversible, complex
    case DecisionCategory.Capstone:
      body =
        'Spend a bit more time to check whether you’ve missed anything. Then place the final piece of the puzzle.';
      break;
    case DecisionCategory.Puzzle:
      body =
        'There’s some complexity to this decision. Spend some time to understand it.';
      break;

    // Non-reversible, simple
    case DecisionCategory.Leap:
      body =
        'Double check the details by laying out your thinking. Then make the leap.';
      break;
    case DecisionCategory.Parachute:
      body =
        'It might be simple but not easily reversible. Spend more time to better understand it before the leap.';
      break;

    // Non-reversible, complex
    case DecisionCategory.Summit:
      body =
        'Spend some time to lay out your thinking. Then climb that summit.';
      break;
    case DecisionCategory.Mountain:
      body =
        'This is a hard decision. Spend a lot of time to deeply understand it.';
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
