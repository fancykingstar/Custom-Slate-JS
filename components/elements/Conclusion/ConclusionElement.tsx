import { useCallback, useState } from 'react';
import { Editor, Node, Path } from 'slate';
import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';
import { dragHandleProps } from 'components/editor/drag';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolConclusion } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';

import styles from './ConclusionElement.module.scss';

export enum ConclusionElement {
  Wrapper = 'conclusion-wrapper',
  Choices = 'conclusion-choices',
  Explanation = 'conclusion-explanation',
  Item = 'conclusion-item',
  ItemTitle = 'conclusion-item-title',
}

export function ConclusionWrapperElement(
  props: RenderElementProps & dragHandleProps
): JSX.Element {
  const { attributes, children } = props;
  return (
    <ToolWrapper
      {...props}
      attributes={attributes}
      name="Conclusion"
      icon={<IconToolConclusion />}
    >
      {children}
    </ToolWrapper>
  );
}

function getChoiceTitles(editor: Editor): string[] {
  const choices = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) => n.type === ChoicesType.ItemTitle,
    })
  );

  if (!choices.length) {
    return [];
  }

  const choiceTitles = choices.map((choice) => {
    const [choiceNode] = choice;
    return Node.string(choiceNode);
  });

  return choiceTitles;
}

export function ConclusionChoicesElement(
  props: RenderElementProps
): JSX.Element {
  const editor = useEditor();
  const { attributes, children } = props;

  const choiceTitles = getChoiceTitles(editor);

  const [selected, setSelected] = useState<boolean[]>([]);
  const toggle = useCallback(
    (i: number) => {
      const copy = selected.slice();
      copy[i] = !copy[i];
      setSelected(copy);
    },
    [selected]
  );

  return (
    <div {...attributes} className={styles.choices}>
      <ul contentEditable={false} className={styles.list}>
        {choiceTitles.map((title, i) => {
          return (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={styles.item}
              style={selected[i] ? { opacity: 1 } : { opacity: 0.5 }}
            >
              <label className={styles.button}>
                <input
                  className={styles.input}
                  type="checkbox"
                  name="choices"
                  value={i}
                  onChange={() => {
                    toggle(i);
                  }}
                />
                <span>
                  <h3
                    className={
                      selected[i] ? styles.itemTitleSelected : styles.itemTitle
                    }
                  >
                    {title || ' '}
                  </h3>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}

export function ConclusionExplanationElement(
  props: RenderElementProps
): JSX.Element {
  const editor = useEditor();
  const { attributes, children, element } = props;

  let nodeIndex = 0;
  const nodePath = ReactEditor.findPath(editor, element);
  if (nodePath.length > 0) {
    nodeIndex = nodePath[nodePath.length - 1];
  }

  let placeholder = null;
  if (nodeIndex === 1) {
    const choiceTitles = getChoiceTitles(editor);
    const placeholderText = choiceTitles.length
      ? 'Choose from the choice(s) above, then explain why'
      : 'Use the Choice tool first to define your choices';
    const blur = choiceTitles.length
      ? 'Why you chose these choice(s)'
      : 'Use the Choice tool first to define your choices';

    placeholder = (
      <InlinePlaceholder element={element} blurChildren={blur}>
        {placeholderText}
      </InlinePlaceholder>
    );
  }

  return (
    <div {...attributes} className={styles.explanation}>
      {children}
      {placeholder}
    </div>
  );
}

export function ConclusionItemElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <li {...attributes} className={styles.item}>
      {children}
    </li>
  );
}

export function ConclusionItemTitleElement(
  props: RenderElementProps
): JSX.Element {
  const editor = useEditor();
  const { attributes, children, element } = props;

  let nodeIndex = 0;

  const nodePath = ReactEditor.findPath(editor, element);
  if (nodePath.length > 0) {
    const parentPath = Path.parent(nodePath);
    nodeIndex = parentPath[parentPath.length - 1];
  }

  const placeholderText =
    nodeIndex === 0
      ? 'What’s one of your options?'
      : 'What’s another option you could take?';

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {children}
      <InlinePlaceholder element={element} blurChildren="Untitled choice…">
        {placeholderText}
      </InlinePlaceholder>
    </h3>
  );
}
