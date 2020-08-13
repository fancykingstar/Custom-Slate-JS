import styles from './AssistantKeyboardCommand.module.scss';

interface Props {
  children: React.ReactNode;
}

const isMac =
  typeof window !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export default function AssistantKeyboardCommand(props: Props): JSX.Element {
  const { children } = props;
  return (
    <span className={styles.button}>
      {children}
      <kbd>{isMac ? '⌘' : '⌃'}⏎</kbd>
    </span>
  );
}
