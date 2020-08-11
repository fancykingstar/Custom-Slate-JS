import { useState } from 'react';
import styles from './CompleteButton.module.scss';

export default function CompleteButton(): JSX.Element {
  const [completed, setCompleted] = useState(false);

  const classes = [styles.completeButton];

  if (completed) {
    classes.push(styles.complete);
  }

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => {
        setCompleted(!completed);
      }}
    >
      {completed ? 'Completed' : 'Mark complete'}
    </button>
  );
}
