import { useEffect, useState } from 'react';
import { useSelected, RenderElementProps } from 'slate-react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Drag, Eye, EyeSlash } from 'components/icons/Icons';
import { useHeaderContext } from 'components/header/HeaderContext';
import Toggle from 'components/atoms/toggle/Toggle';
import styles from './ToolWrapper.module.scss';

interface Props {
  attributes: RenderElementProps['attributes'];
  children: React.ReactNode;
  name: string;
  icon: React.ReactNode;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export default function ToolWrapper(props: Props): JSX.Element {
  const { attributes, children, name, icon, dragHandleProps } = props;
  const selected = useSelected();
  const {
    viewMode,
    viewableElements,
    setViewableElements,
  } = useHeaderContext();
  const [componentViewMode, setComponentViewMode] = useState(
    viewableElements.includes(name)
  );
  const onToggle = (isActive: boolean) => {
    if (isActive) {
      const newViewableElements = [...viewableElements, name];
      setViewableElements(newViewableElements);
    } else {
      const newViewableElements = viewableElements.filter(
        (viewableName) => viewableName !== name
      );
      setViewableElements(newViewableElements);
    }
  };

  useEffect(() => {
    if (viewableElements.includes(name)) {
      setComponentViewMode(true);
    } else {
      setComponentViewMode(false);
    }
  }, [viewableElements]);

  const lowVisibility = viewMode === 'public' && !componentViewMode;

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''} ${
        lowVisibility ? styles.muteBorder : ''
      }`}
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
      {viewMode === 'public' && (
        <div className={styles.elementToggle} contentEditable={false}>
          <div className={styles.elementToggleIcon}>
            {componentViewMode ? <Eye /> : <EyeSlash />}
          </div>
          <Toggle onToggle={onToggle} isActive={componentViewMode} />
        </div>
      )}
      <div className={`${lowVisibility ? styles.lowVisibility : ''}`}>
        {children}
      </div>
      <h2
        className={`${styles.toolName} ${
          lowVisibility ? styles.lowVisibility : ''
        }`}
        contentEditable={false}
      >
        {/* icon */}
        {name}
      </h2>
    </div>
  );
}
