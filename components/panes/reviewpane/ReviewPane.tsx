import React from 'react';
import Text from 'components/atoms/text/Text';
import { usePaneContext } from '../PaneContext';
import styles from './ReviewPane.module.scss';

interface OnClickProps {
  expandedPanes: string[];
  setExpandedPanes: (newPanes: string[]) => void;
}

const onClick = ({ expandedPanes, setExpandedPanes }: OnClickProps) => {
  if (expandedPanes.includes('reviewPane')) {
    const newExpandedPanes = expandedPanes.filter(
      (pane: string) => pane !== 'reviewPane'
    );
    setExpandedPanes(newExpandedPanes);
  } else {
    setExpandedPanes([...expandedPanes, 'reviewPane']);
  }
};

function ReviewPane(): JSX.Element {
  const { expandedPanes, setExpandedPanes } = usePaneContext();
  const isExpanded = expandedPanes.includes('reviewPane');

  return (
    <div
      className={`${styles.reviewPaneContainer} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
      onClick={() => onClick({ expandedPanes, setExpandedPanes })}
      onKeyDown={() => onClick({ expandedPanes, setExpandedPanes })}
      tabIndex={-1}
      role="button"
    >
      <div className={`${styles.innerContainer}`}>
        <Text>Timeline</Text>
      </div>
    </div>
  );
}

export default ReviewPane;
