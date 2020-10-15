import { Element, NodeEntry, Path } from 'slate';
import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';

import ToolWrapper from 'components/editor/ToolWrapper';
import { dragHandleProps } from 'components/editor/drag';
import { Magic, isMagical } from 'components/editor/Magic';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import { reduceDisabled } from 'components/editor/Sensitivity';
import {
  getFirstTextString,
  getTitleEntry,
  stringifyTitleEntry,
} from 'components/editor/queries';
import { getAllGoalEntries } from 'components/elements/Goals/queries';
import { IconToolGoals } from 'components/icons/IconTool';
import { readyToGenerateGoal } from 'components/intelligence/generator';

import styles from './GoalsElement.module.scss';

export function GoalsWrapperElement(
  props: RenderElementProps & dragHandleProps
): JSX.Element {
  const { attributes, children } = props;

  return (
    <ToolWrapper
      {...props}
      attributes={attributes}
      name="Goals"
      icon={<IconToolGoals />}
    >
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

  const goalEntries: NodeEntry<Element>[] = getAllGoalEntries(editor);
  const goals = goalEntries.map(getFirstTextString);
  const titleEntry: NodeEntry<Element> | null = getTitleEntry(editor);
  let magic = null;
  if (titleEntry != null) {
    magic = isMagical(
      element,
      [titleEntry, ...goalEntries],
      readyToGenerateGoal.bind(null, {
        goals,
        title: stringifyTitleEntry(titleEntry),
      })
    );
  }

  let placeholderText: string | null =
    nodeIndex === 0
      ? 'What’s one of your goals?'
      : 'What’s another goal for this decision?';

  if (magic === Magic.Started) {
    placeholderText = null;
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
