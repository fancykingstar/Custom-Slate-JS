import BasicButton from 'components/buttons/BasicButton';
import { useContext } from 'react';
import { Store, Action, DocStatus } from 'store/store';
import styles from './InfoPanel.module.scss';

export default function InfoPanel(): JSX.Element {
  const { state, dispatch } = useContext(Store);

  const currentDoc =
    state.activeDocId != null
      ? state.docs.find((doc) => doc.id === state.activeDocId)
      : null;

  const status = currentDoc?.status ?? null;

  return (
    <div className={styles.wrapper}>
      {status != null ? (
        <BasicButton
          className={styles.completeButton}
          onClick={() => {
            const docId = state.activeDocId;
            if (docId == null) {
              return;
            }

            dispatch({
              type: Action.setDoc,
              docId,
              status:
                status === DocStatus.Incomplete
                  ? DocStatus.Complete
                  : DocStatus.Incomplete,
            });
          }}
        >
          {status === DocStatus.Incomplete ? (
            <svg
              className={styles.completeIcon}
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
          ) : (
            <svg
              className={styles.completeIcon}
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
          )}
          {status === DocStatus.Incomplete ? 'Mark Complete' : 'Completed'}
        </BasicButton>
      ) : null}
      <ul className={styles.infoList}>
        <li>
          <span className={styles.infoListIcon}>🐇</span>Snap decision
        </li>
        <li>
          <span className={styles.infoListIcon}>⏳</span>15 min spent
        </li>
        <li>
          <span className={styles.infoListIcon}>⭐️</span>No insights
        </li>
      </ul>
    </div>
  );
}
