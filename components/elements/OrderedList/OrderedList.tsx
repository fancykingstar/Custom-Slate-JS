import { RenderElementProps, useSelected } from 'slate-react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Drag } from 'components/icons/Icons';
import styles from './OrderedList.module.scss';

interface AdditionalProps {
  dragHandleProps?: DraggableProvidedDragHandleProps;
}
export default function OrderedList(
  props: RenderElementProps & AdditionalProps
): JSX.Element {
  const { attributes, children, dragHandleProps } = props;
  const selected = useSelected();
  return (
    <div className={styles.listContainer}>
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
      <ol {...attributes} className={styles.ol}>
        {children}
      </ol>
    </div>
  );
}
