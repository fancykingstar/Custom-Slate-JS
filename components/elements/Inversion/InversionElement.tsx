import { RenderElementProps, useEditor, ReactEditor } from 'slate-react';
import { Path } from 'slate';
import ToolWrapper from 'components/editor/ToolWrapper';
import { IconToolInversion } from 'components/icons/IconTool';
import InlinePlaceholder from 'components/editor/InlinePlaceholder';
import styles from './InversionElement.module.scss';

export enum InversionElement {
  Wrapper = 'inversion-wrapper',
  Item = 'inversion-item',
  ItemTitle = 'inversion-item-title',
  ItemSublist = 'inversion-item-sublist',
  ItemSublistItem = 'inversion-item-sublist-item',
  ItemSublistItemParagraph = 'inversion-item-sublist-item-p',
}

export function InversionWrapperElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children } = props;

  return (
    <ToolWrapper
      attributes={attributes}
      name="Inversion"
      icon={<IconToolInversion />}
    >
      <ul className={styles.list}>{children}</ul>
    </ToolWrapper>
  );
}

export function InversionItemElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <li {...attributes} className={styles.item}>
      {children}
    </li>
  );
}

export function InversionItemTitleElement(
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
      ? 'What’s one of the worst choices you could make?'
      : 'What’s another bad choice for this decision?';

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {children}
      <InlinePlaceholder element={element} blurChildren="Untitled bad choice…">
        {placeholderText}
      </InlinePlaceholder>
    </h3>
  );
}

export function InversionSublistElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children } = props;

  return (
    <ul {...attributes} className={styles.sublist}>
      {children}
    </ul>
  );
}

export function InversionSublistItemElement(
  props: RenderElementProps
): JSX.Element {
  const { attributes, children } = props;

  return (
    <li {...attributes} className={styles.sublistItem}>
      {children}
    </li>
  );
}

export function InversionSublistItemParagraphElement(
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
      ? 'Why is this a bad choice?'
      : 'What’s another reason this is a bad choice?';

  return (
    <p {...attributes} className={styles.sublistItemParagraph}>
      {children}
      <InlinePlaceholder element={element}>{placeholderText}</InlinePlaceholder>
    </p>
  );
}
