import { RenderElementProps, useSelected } from 'slate-react';
import { Node } from 'slate';
import styles from './CriteriaElement.module.scss';

export enum CriteriaElement {
  Wrapper = 'criteria-wrapper',
  Item = 'criteria-item',
  ItemTitle = 'criteria-item-title',
}

export function CriteriaWrapperElement(props: RenderElementProps): JSX.Element {
  const selected = useSelected();
  const { attributes, children } = props;

  return (
    <div className={`${styles.wrapper} ${selected ? styles.active : ''}`}>
      <h2 className={styles.toolName} contentEditable={false}>
        Criteria
      </h2>
      <ul {...attributes} className={styles.list}>
        {children}
      </ul>
    </div>
  );
}

export function CriteriaItemElement(props: RenderElementProps): JSX.Element {
  const { attributes, children } = props;

  return (
    <li {...attributes} className={styles.item}>
      {children}
    </li>
  );
}

export function CriteriaItemTitleElement(
  props: RenderElementProps
): JSX.Element {
  const selected = useSelected();
  const { attributes, children, element } = props;
  const showPlaceholder = selected && !Node.string(element).length;

  return (
    <h3 {...attributes} className={styles.itemTitle}>
      {showPlaceholder ? (
        <div className={styles.placeholder} contentEditable={false}>
          What's one of your criteria?
        </div>
      ) : null}
      {children}
    </h3>
  );
}
