import { RenderElementProps, useSelected } from 'slate-react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Drag, Eye, EyeSlash } from 'components/icons/Icons';
import styles from './ParagraphElement.module.scss';

interface AdditionalProps {
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export default function ParagraphElement(
  props: RenderElementProps & AdditionalProps
): JSX.Element {
  const { attributes, children, dragHandleProps } = props;
  const selected = useSelected();
  return (
    <div className={styles.paragraphElementContainer}>
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
      <p {...attributes} className={styles.p}>
        {children}
      </p>
    </div>
  );
}
