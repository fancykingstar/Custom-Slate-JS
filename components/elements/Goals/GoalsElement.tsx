import { Path } from 'slate';
import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';

import ToolWrapper from 'components/editor/ToolWrapper';
import InlinePlaceholder, { Magic } from 'components/editor/InlinePlaceholder';
import { getTitle } from 'components/editor/queries';
import { getAllChoiceTitles } from 'components/elements/Choices/queries';
import { getAllGoalTitles } from 'components/elements/Goals/queries';
import { IconToolGoals } from 'components/icons/IconTool';
import { readyToGenerateGoal } from 'components/intelligence/generator';

import styles from './GoalsElement.module.scss';

export function GoalsWrapperElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <ToolWrapper attributes={attributes} name="Goals" icon={<IconToolGoals />}>
      <ul className={styles.list}>{children}</ul>
    </ToolWrapper>
  );
}

export function GoalsItemElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <li {...attributes} className={styles.item}>
      {children}
    </li>
  );
}

export function GoalsItemTitleElement(props: RenderElementProps): JSX.Element {
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
      ? 'What’s one of your goals?'
      : 'What’s another goal for this decision?';

  let magic = null;
  const [magicReady] = readyToGenerateGoal({
    goals: getAllGoalTitles(editor),
    title: getTitle(editor),
  });
  if (magicReady) {
    magic = Magic.Ready;
  }

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {children}
      <InlinePlaceholder
        element={element}
        blurChildren="Untitled goal…"
        magic={magic}
      >
        {placeholderText}
      </InlinePlaceholder>
    </h3>
  );
}
