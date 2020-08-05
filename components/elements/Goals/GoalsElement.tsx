import { RenderElementProps, useSelected } from 'slate-react';
import { Node } from 'slate';
import styles from './GoalsElement.module.scss';

export enum GoalsElement {
  Wrapper = 'goals-wrapper',
  Item = 'goals-item',
  ItemTitle = 'goals-item-title',
}

export function GoalsWrapperElement(props: RenderElementProps): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  return (
    <div className={`${styles.wrapper} ${selected ? styles.active : ''}`}>
      <h2 className={styles.toolName} contentEditable={false}>
        Goals
      </h2>
      <ul {...attributes} className={styles.list}>
        {children}
      </ul>
    </div>
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
  const selected = useSelected();
  const { attributes, children, element } = props;
  const showPlaceholder = selected && !Node.string(element).length;

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {showPlaceholder ? (
        <div className={styles.placeholder} contentEditable={false}>
          What's one of your goals?
        </div>
      ) : null}
      {children}
    </h3>
  );
}
