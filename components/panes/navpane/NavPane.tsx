/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';
import Text from 'components/atoms/text/Text';
import Sidebar from 'components/sidebar/Sidebar';
import { PaneState, usePaneContext } from 'components/panes/PaneContext';
import styles from './NavPane.module.scss';

interface OnClickProps {
  navPaneState: PaneState;
  setNavPaneState: (newState: PaneState) => void;
}

const onClick = ({ navPaneState, setNavPaneState }: OnClickProps) => {
  if (navPaneState === PaneState.Collapsed) {
    setNavPaneState(PaneState.Expanded);
  } else if (navPaneState === PaneState.Expanded) {
    setNavPaneState(PaneState.Wide);
  } else {
    setNavPaneState(PaneState.Collapsed);
  }
};

function NavPane(): JSX.Element {
  const { navPaneState, setNavPaneState } = usePaneContext();
  let stateStyle = styles.collapsed;
  if (navPaneState === PaneState.Expanded) {
    stateStyle = styles.expanded;
  } else if (navPaneState === PaneState.Wide) {
    stateStyle = styles.wide;
  }

  return (
    <div
      className={`${styles.navPaneContainer} ${stateStyle}`}
      onClick={() => onClick({ navPaneState, setNavPaneState })}
      onKeyDown={() => onClick({ navPaneState, setNavPaneState })}
      tabIndex={-1}
      role="button"
    >
      <div className={`${styles.innerContainer}`}>
        <Text>Docs</Text>
        {navPaneState !== PaneState.Collapsed && <Sidebar />}
      </div>
    </div>
  );
}

export default NavPane;
