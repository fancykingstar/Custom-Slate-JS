import { useSelected, RenderElementProps } from 'slate-react';
import styles from './ToolWrapper.module.scss';

interface Props {
  attributes: RenderElementProps['attributes'];
  children: React.ReactNode;
  name: string;
  icon: React.ReactNode;
}

export default function ToolWrapper(props: Props): JSX.Element {
  const selected = useSelected();
  const { attributes, children, name, icon } = props;

  return (
    <div
      {...attributes}
      className={`${styles.wrapper} ${selected ? styles.active : ''}`}
    >
      {children}
      <h2 className={styles.toolName} contentEditable={false}>
        {icon}
        {name}
      </h2>
    </div>
  );
}
