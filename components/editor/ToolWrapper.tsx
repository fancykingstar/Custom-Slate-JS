import { useSelected, RenderElementProps } from 'slate-react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Drag } from 'components/icons/Icons';
import styles from './ToolWrapper.module.scss';

interface Props {
  attributes: RenderElementProps['attributes'];
  children: React.ReactNode;
  name: string;
  icon: React.ReactNode;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export default function ToolWrapper(props: Props): JSX.Element {
  const selected = useSelected();
  const { attributes, children, name, icon, dragHandleProps } = props;

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''}`}
    >
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
      {children}
      <h2 className={styles.toolName} contentEditable={false}>
        {icon}
        {name}
      </h2>
    </div>
  );
}
