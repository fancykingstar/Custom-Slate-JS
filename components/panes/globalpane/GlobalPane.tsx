import React from 'react';
import { Gear } from 'components/icons/Icons';
import Sidebar from 'components/sidebar/Sidebar';
import Symbol from '../../logo/Symbol';
import { usePaneContext } from '../PaneContext';
import styles from './GlobalPane.module.scss';

interface OnClickProps {
  expandedPanes: string[];
  setExpandedPanes: (newPanes: string[]) => void;
}

const onClick = ({ expandedPanes, setExpandedPanes }: OnClickProps) => {
  if (expandedPanes.includes('globalPane')) {
    const newExpandedPanes = expandedPanes.filter(
      (pane: string) => pane !== 'globalPane'
    );
    setExpandedPanes(newExpandedPanes);
  } else {
    setExpandedPanes([...expandedPanes, 'globalPane']);
  }
};

function GlobalPane(): JSX.Element {
  const { expandedPanes, setExpandedPanes } = usePaneContext();
  const isExpanded = expandedPanes.includes('globalPane');
  // on click to not do anything yet, until we build this out
  // () => onClick({expandedPanes, setExpandedPanes})

  return (
    <div
      className={`${styles.globalPaneContainer} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
      onClick={() => {}}
      onKeyDown={() => {}}
      tabIndex={-1}
      role="button"
      // temp cursor style, to be changed with onClick handler
      style={{ cursor: 'auto' }}
    >
      <div className={styles.innerContainer}>
        <Symbol symbolWidth={2} />
        <Gear />
      </div>
    </div>
  );
}

export default GlobalPane;
