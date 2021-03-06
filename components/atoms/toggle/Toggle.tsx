import React, { useContext, useState } from 'react';
import styles from './Toggle.module.scss';

interface Props {
  isActive?: boolean;
  onToggle: (newState: boolean) => void;
  containerStyle?: React.CSSProperties;
}

function Toggle({
  containerStyle,
  onToggle,
  isActive = false,
}: Props): JSX.Element {
  const [active, setIsActive] = useState(isActive);
  const onClick = () => {
    const newState = !active;
    setIsActive(newState);
    onToggle(newState);
  };

  return (
    <div className={styles.toggleAtom} style={containerStyle}>
      <label className={styles.toggleLabel}>
        <input type="checkbox" onClick={onClick} defaultChecked={active} />
        <span
          className={`${styles.toggleSpan} ${styles.toggleSpanContainer}`}
        />
      </label>
    </div>
  );
}

export default Toggle;
