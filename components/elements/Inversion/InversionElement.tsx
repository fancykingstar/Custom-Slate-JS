import { RenderElementProps, useSelected } from 'slate-react';
import { Node } from 'slate';
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
  const selected = useSelected();
  const { attributes, children } = props;

  return (
    <div className={`${styles.wrapper} ${selected ? styles.active : ''}`}>
      <h2 className={styles.toolName} contentEditable={false}>
        Inversion
      </h2>
      <ul {...attributes} className={styles.list}>
        {children}
      </ul>
    </div>
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
  const selected = useSelected();
  const { attributes, children, element } = props;
  const showPlaceholder = selected && !Node.string(element).length;

  // TODO: Make placeholder more dynamic based on nesting and index in list

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {showPlaceholder ? (
        <div className={styles.placeholder} contentEditable={false}>
          What’s one of the worst choices you could make?
        </div>
      ) : null}
      {children}
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
  const selected = useSelected();
  const { attributes, children, element } = props;
  const showPlaceholder = selected && !Node.string(element).length;

  // TODO: Make placeholder more dynamic based on nesting and index in list

  return (
    <p {...attributes} className={styles.sublistItemParagraph}>
      {showPlaceholder ? (
        <span className={styles.placeholder} contentEditable={false}>
          Why is this a bad choice?
        </span>
      ) : null}
      {children}
    </p>
  );
}
