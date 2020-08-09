import { useContext } from 'react';
import Link from 'next/link';
import {
  CategorizerContext,
  CategorizerReversibility,
  CategorizerUnderstanding,
} from 'components/context';
import styles from './Header.module.scss';

export function Reversibility(): JSX.Element | null {
  const { reversibility } = useContext(CategorizerContext);

  let symbol = null;
  if (reversibility === CategorizerReversibility.Reversible) {
    symbol = '↩️';
  } else if (reversibility === CategorizerReversibility.NonReversible) {
    symbol = '➡️';
  }

  if (symbol == null) {
    return null;
  }

  return (
    <div className={styles.symbolBox}>
      <div className={styles.symbol}>{symbol}</div>
    </div>
  );
}

export function Understanding(): JSX.Element | null {
  const { understanding } = useContext(CategorizerContext);

  let symbol = null;
  if (understanding === CategorizerUnderstanding.Deep) {
    symbol = '🌲';
  } else if (understanding === CategorizerUnderstanding.Weak) {
    symbol = '🌱';
  }

  if (symbol == null) {
    return null;
  }

  return (
    <div className={styles.symbolBox}>
      <div className={styles.symbol}>{symbol}</div>
    </div>
  );
}

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <a className={styles.logo}>Deca</a>
        </Link>
        <span className={styles.beta}>β</span>
      </div>
      <Reversibility />
      <Understanding />
    </header>
  );
}
