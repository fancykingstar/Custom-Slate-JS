import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolChoices } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import { Path } from 'slate';
import styles from './ConclusionElement.module.scss';

export enum ConclusionElement {
  Wrapper = 'conclusion-wrapper',
  Item = 'conclusion-item',
  ItemTitle = 'conclusion-item-title',
}

export function ConclusionWrapperElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children } = props;
  return (
    <ToolWrapper
      attributes={attributes}
      name="Conclusion"
      icon={<IconToolChoices />}
    >
      <ul className={styles.list}>{children}</ul>
    </ToolWrapper>
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
