import React, { useContext } from 'react';
import styles from './Header.module.scss';
import Toggle from '../atoms/toggle/Toggle';
import { Eye, EyeSlash } from '../icons/Icons';
import { useHeaderContext } from './HeaderContext';

const HeaderViewToggle = () => {
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
      <div style={{ marginRight: '1.6rem' }}>
        {viewMode === 'public' ? <Eye /> : <EyeSlash />}
      </div>
      <Toggle onToggle={onToggle} />
    </div>
  );
};

export default HeaderViewToggle;
