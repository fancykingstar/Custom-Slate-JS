import React, { useContext } from 'react';
import styles from './Header.module.scss';
import Toggle from '../atoms/toggle/Toggle';
import { Eye, EyeSlash } from '../icons/Icons';
import { useHeaderContext } from './HeaderContext';

function HeaderViewToggle(): JSX.Element {
  const { viewMode, setViewMode } = useHeaderContext();
  const onToggle = (toggleState: boolean) => {
    if (toggleState) {
      setViewMode('public');
    } else {
      setViewMode('private');
    }
  };
  return (
    <div className={styles.headerViewToggleContainer}>
      <div className={styles.headerViewToggleIcon}>
        {viewMode === 'public' ? <Eye /> : <EyeSlash />}
      </div>
      <Toggle onToggle={onToggle} />
    </div>
  );
}

export default HeaderViewToggle;
