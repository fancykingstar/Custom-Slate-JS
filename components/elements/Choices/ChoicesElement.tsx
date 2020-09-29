import { Element, NodeEntry, Path } from 'slate';
import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';

import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import { Magic, isMagical } from 'components/editor/Magic';
import ToolWrapper from 'components/editor/ToolWrapper';
import {
  getFirstTextString,
  getTitleEntry,
  stringifyTitleEntry,
} from 'components/editor/queries';
import { getAllChoiceEntries } from 'components/elements/Choices/queries';
import { getAllGoalEntries } from 'components/elements/Goals/queries';
import { IconToolChoices } from 'components/icons/IconTool';
import { readyToGenerateChoice } from 'components/intelligence/generator';

import styles from './ChoicesElement.module.scss';

export function ChoicesWrapperElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <ToolWrapper
      attributes={attributes}
      name="Choices"
      icon={<IconToolChoices />}
    >
      <ul className={styles.list}>{children}</ul>
    </ToolWrapper>
  );
}

export function ChoicesItemElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;
  return (
    <li {...attributes} className={styles.item}>
      {children}
    </li>
  );
}

export function ChoicesItemTitleElement(
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

  const choiceEntries: NodeEntry<Element>[] = getAllChoiceEntries(editor);
  const choices = choiceEntries.map(getFirstTextString);
  const goalEntries: NodeEntry<Element>[] = getAllGoalEntries(editor);
  const goals = goalEntries.map(getFirstTextString);
  const titleEntry: NodeEntry<Element> | null = getTitleEntry(editor);
  let magic = null;
  if (titleEntry != null) {
    magic = isMagical(
      element,
      [titleEntry, ...choiceEntries, ...goalEntries],
      readyToGenerateChoice.bind(null, {
        choices,
        goals,
        title: stringifyTitleEntry(titleEntry),
      })
    );
  }

  const placeholderText =
    nodeIndex === 0
      ? 'What’s one of your options?'
      : 'What’s another option you could take?';

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {children}
      <InlinePlaceholder
        element={element}
        blurChildren="Untitled choice…"
        magic={magic}
      >
        {placeholderText}
      </InlinePlaceholder>
    </h3>
  );
}
