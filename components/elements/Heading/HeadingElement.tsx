import { RenderElementProps, useSelected } from 'slate-react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Drag, Eye, EyeSlash } from 'components/icons/Icons';
import styles from './HeadingElement.module.scss';

interface AdditionalProps {
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export default function HeadingElement(
  props: RenderElementProps & AdditionalProps
): JSX.Element {
  const { attributes, children, dragHandleProps } = props;
  const selected = useSelected();
  return (
    <div className={styles.headingElementContainer}>
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          contentEditable={false}
          className={`${styles.dragHandle} ${selected ? styles.active : ''}`}
          tabIndex={-1}
        >
          <Drag />
        </div>
      )}
      <h1 {...attributes} className={styles.h1}>
        {children}
      </h1>
    </div>
  );
}
