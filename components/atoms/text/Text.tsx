import React from 'react';
import styles from './Text.module.scss';

interface Props {
  children: string;
  style?: React.CSSProperties;
}

function Text({ children, style }: Props): JSX.Element {
  return (
    <p className={styles.textContainer} style={style}>
      {children}
    </p>
  );
}

export default Text;
