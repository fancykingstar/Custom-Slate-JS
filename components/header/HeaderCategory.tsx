import React, { useContext } from 'react';

import { Context } from 'components/context';
import styles from './Header.module.scss';

function HeaderDecisionCategory(): JSX.Element | null {
  const { categorizer } = useContext(Context);

  if (categorizer.decisionCategory == null) {
    return null;
  }

  return (
    <div
      className={`${styles.categoryPill} ${
        styles[categorizer.decisionCategory]
      }`}
    >
      <span>{`${categorizer.decisionCategory}`}</span>
    </div>
  );
}

export default HeaderDecisionCategory;
