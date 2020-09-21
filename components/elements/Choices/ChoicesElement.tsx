import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';
import { Path } from 'slate';

import InlinePlaceholder, { Magic } from 'components/editor/InlinePlaceholder';
import ToolWrapper from 'components/editor/ToolWrapper';
import { getTitle } from 'components/editor/queries';
import { getAllChoiceTitles } from 'components/elements/Choices/queries';
import { getAllGoalTitles } from 'components/elements/Goals/queries';
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

  const placeholderText =
    nodeIndex === 0
      ? 'What’s one of your options?'
      : 'What’s another option you could take?';

  let magic = null;
  const [magicReady] = readyToGenerateChoice({
    choices: getAllChoiceTitles(editor),
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
        blurChildren="Untitled choice…"
        magic={magic}
      >
        {placeholderText}
      </InlinePlaceholder>
    </h3>
  );
}
