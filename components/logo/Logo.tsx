import styles from './Logo.module.scss';

interface Props {
  symbolWidth: number;
}

export default function LogoProps(props: Props): JSX.Element {
  const { symbolWidth } = props;

  return (
    <div className={styles.logo}>
      <img
        src="/img/logo/symbol.svg"
        alt="Deca symbol"
        style={{
          width: `${symbolWidth}rem`,
        }}
      />
      <img
        src="/img/logo/wordmark.svg"
        alt="Deca wordmark"
        style={{
          margin: `0 0 0 ${symbolWidth * 0.3125}rem`,
          width: `${symbolWidth * 1.3125}rem`,
        }}
      />
    </div>
  );
}
