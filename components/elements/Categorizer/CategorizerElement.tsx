import { useContext, useState, useEffect } from 'react';
import { Editor, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps, useEditor } from 'slate-react';

import { dragHandleProps } from 'components/editor/drag';
import { Context, DecisionCategory } from 'components/context';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolCategorizer } from 'components/icons/IconTool';
import styles from './CategorizerElement.module.scss';

export enum CategorizerElement {
  Wrapper = 'categorizer-wrapper',
}

enum Reversibility {
  Reversible = 'reversible',
  Nonreversible = 'nonreversible',
}

enum Complexity {
  Simple = 'simple',
  Complex = 'complex',
}

function setReversibility(
  editor: Editor,
  reversibility: Reversibility,
  path: Path
): void {
  Transforms.setNodes(editor, { reversibility }, { at: path });
}

function setComplexity(
  editor: Editor,
  complexity: Complexity,
  path: Path
): void {
  Transforms.setNodes(editor, { complexity }, { at: path });
}

export function CategorizerWrapperElement(
  props: RenderElementProps & dragHandleProps
): JSX.Element {
  const { attributes, children, element } = props;

  const context = useContext(Context);

  const editor = useEditor();
  const toolPath = ReactEditor.findPath(editor, element);

  useEffect(() => {
    let category = null;

    if (element.reversibility === Reversibility.Reversible) {
      if (element.complexity === Complexity.Simple) {
        category = DecisionCategory.ReversibleSimple;
      } else if (element.complexity === Complexity.Complex) {
        category = DecisionCategory.ReversibleComplex;
      }
    } else if (element.reversibility === Reversibility.Nonreversible) {
      if (element.complexity === Complexity.Simple) {
        category = DecisionCategory.NonreversibleSimple;
      } else if (element.complexity === Complexity.Complex) {
        category = DecisionCategory.NonreversibleComplex;
      }
    }

    if (category == null) {
      return;
    }

    context.categorizer.setDecisionCategory(category);
  }, [element.reversibility, element.complexity]);

  useEffect(() => {
    return () => {
      context.categorizer.setDecisionCategory(null);
    };
  }, []);

  return (
    <ToolWrapper
      {...props}
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
                  value={Reversibility.Reversible}
                  checked={element.reversibility === Reversibility.Reversible}
                  onChange={() =>
                    setReversibility(editor, Reversibility.Reversible, toolPath)
                  }
                />
                <span>Reversible</span>
              </label>
              <label className={styles.button}>
                <input
                  type="radio"
                  name="reversibility"
                  value={Reversibility.Nonreversible}
                  checked={
                    element.reversibility === Reversibility.Nonreversible
                  }
                  onChange={() =>
                    setReversibility(
                      editor,
                      Reversibility.Nonreversible,
                      toolPath
                    )
                  }
                />
                <span>Nonreversible</span>
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
                  value={Complexity.Simple}
                  checked={element.complexity === Complexity.Simple}
                  onChange={() =>
                    setComplexity(editor, Complexity.Simple, toolPath)
                  }
                />
                <span>Simple</span>
              </label>
              <label className={styles.button}>
                <input
                  type="radio"
                  name="complexity"
                  value={Complexity.Complex}
                  checked={element.complexity === Complexity.Complex}
                  onChange={() =>
                    setComplexity(editor, Complexity.Complex, toolPath)
                  }
                />
                <span>Complex</span>
              </label>
            </div>
          </div>
        </div>
        <div className={styles.suggestion}>
          <h3 className={styles.suggestionLabel}>Suggestion</h3>
          <Suggestion
            reversibility={element.reversibility as Reversibility}
            complexity={element.complexity as Complexity}
          />
        </div>
      </div>
      {children}
    </ToolWrapper>
  );
}

interface SuggestionProps {
  reversibility: Reversibility | null;
  complexity: Complexity | null;
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
