import { RenderElementProps, useSelected } from 'slate-react';
import { Node } from 'slate';
import styles from './ChoicesElement.module.scss';

export enum ChoicesElement {
  Wrapper = 'choices-wrapper',
  Item = 'choices-item',
  ItemTitle = 'choices-item-title',
}

export function ChoicesWrapperElement(props: RenderElementProps): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  return (
    <div className={`${styles.wrapper} ${selected ? styles.active : ''}`}>
      <h2 className={styles.toolName} contentEditable={false}>
        Choices
      </h2>
      <ul {...attributes} className={styles.list}>
        {children}
      </ul>
    </div>
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
  const selected = useSelected();
  const { attributes, children, element } = props;
  const showPlaceholder = selected && !Node.string(element).length;

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {showPlaceholder ? (
        <div className={styles.placeholder} contentEditable={false}>
          What's one of your options?
        </div>
      ) : null}
      {children}
    </h3>
  );
}
