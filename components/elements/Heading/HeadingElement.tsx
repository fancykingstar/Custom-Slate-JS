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
  const { attributes, children, dragHandleProps, element } = props;
  const selected = useSelected();
  const { type } = element;

  const getHeading = () => {
    if (type === 'h1') {
      return <h1 {...attributes}>{children}</h1>;
    }
    if (type === 'h2') {
      return <h2 {...attributes}>{children}</h2>;
    }
    if (type === 'h3') {
      return <h3 {...attributes}>{children}</h3>;
    }
    if (type === 'h4') {
      return <h4 {...attributes}>{children}</h4>;
    }
    if (type === 'h5') {
      return <h5 {...attributes}>{children}</h5>;
    }
    return <h6 {...attributes}>{children}</h6>;
  };

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
      {getHeading()}
    </div>
  );
}
