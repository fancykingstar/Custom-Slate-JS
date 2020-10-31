/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';
import Text from 'components/atoms/text/Text';
import Sidebar from 'components/sidebar/Sidebar';
import { usePaneContext } from '../PaneContext';
import styles from './NavPane.module.scss';

interface OnClickProps {
  expandedPanes: string[];
  setExpandedPanes: (newPanes: string[]) => void;
}

const onClick = ({ expandedPanes, setExpandedPanes }: OnClickProps) => {
  if (expandedPanes.includes('navPane')) {
    const newExpandedPanes = expandedPanes.filter(
      (pane: string) => pane !== 'navPane'
    );
    setExpandedPanes(newExpandedPanes);
  } else {
    setExpandedPanes([...expandedPanes, 'navPane']);
  }
};

function NavPane(): JSX.Element {
  const { expandedPanes, setExpandedPanes } = usePaneContext();
  const isExpanded = expandedPanes.includes('navPane');

  return (
    <div
      className={`${styles.navPaneContainer} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
      onClick={() => onClick({ expandedPanes, setExpandedPanes })}
      onKeyDown={() => onClick({ expandedPanes, setExpandedPanes })}
      tabIndex={-1}
      role="button"
    >
      <div className={`${styles.innerContainer}`}>
        <Text>Docs</Text>
        {isExpanded && <Sidebar />}
      </div>
    </div>
  );
}

export default NavPane;
