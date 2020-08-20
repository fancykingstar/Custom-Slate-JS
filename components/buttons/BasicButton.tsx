import styles from './BasicButton.module.scss';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export default function BasicButton(props: Props): JSX.Element {
  const { children, className, onClick } = props;
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
