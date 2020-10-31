import styles from './Logo.module.scss';

interface Props {
  symbolWidth: number;
}

export default function Symbol({ symbolWidth = 4 }: Props): JSX.Element {
  return (
    <div className={styles.logo}>
      <img
        src="/img/logo/symbol.svg"
        alt="Deca symbol"
        style={{
          width: `${symbolWidth}rem`,
        }}
      />
    </div>
  );
}
