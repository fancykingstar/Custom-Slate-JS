import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';
import { Path } from 'slate';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolGoals } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './GoalsElement.module.scss';

export enum GoalsElement {
  Wrapper = 'goals-wrapper',
  Item = 'goals-item',
  ItemTitle = 'goals-item-title',
}

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

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {children}
      <InlinePlaceholder element={element} blurChildren="Untitled goal…">
        {placeholderText}
      </InlinePlaceholder>
    </h3>
  );
}
