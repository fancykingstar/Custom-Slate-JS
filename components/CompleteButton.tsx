import { useContext } from 'react';
import { Store, DocStatus, Action } from 'store/store';
import styles from './CompleteButton.module.scss';

export default function CompleteButton(): JSX.Element {
  const { state, dispatch } = useContext(Store);

  const currentDoc = state.docs.find((doc) => doc.id === state.activeDocId);

  const classes = [styles.completeButton];

  const completed =
    currentDoc != null && currentDoc.status === DocStatus.Complete;

  if (completed) {
    classes.push(styles.complete);
  }

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => {
        if (currentDoc == null) {
          return;
        }

        dispatch({
          type: Action.setDoc,
          docId: currentDoc.id,
          status:
            currentDoc.status === DocStatus.Incomplete
              ? DocStatus.Complete
              : DocStatus.Incomplete,
        });
      }}
    >
      {completed ? (
        <svg
          className={styles.icon}
          fill="none"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33"
          >
            <rect height="12" rx="3" width="12" x="2" y="2" />
            <path d="m10.96 6-4.33 4.33-1.96-1.97" />
          </g>
        </svg>
      ) : (
        <svg
          className={styles.icon}
          fill="none"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            height="12"
            rx="3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33"
            width="12"
            x="2"
            y="2"
          />
        </svg>
      )}
      {completed ? 'Completed' : 'Mark Complete'}
    </button>
  );
}
