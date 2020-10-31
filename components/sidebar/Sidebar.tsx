import BasicButton from 'components/buttons/BasicButton';
import { useContext } from 'react';
import { Store, Action, DocStatus } from 'store/store';
import styles from './Sidebar.module.scss';

export default function Sidebar(): JSX.Element | null {
  const { dispatch } = useContext(Store);

  return (
    <aside className={styles.wrapper}>
      <div className={styles.content}>
        <FileList />
        <BasicButton
          className={styles.newButton}
          onClick={() => {
            dispatch({ type: Action.createNewDoc });
          }}
        >
          <svg
            className={styles.newIcon}
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.33333"
            >
              <path d="m7.99967 14.6667c3.68193 0 6.66663-2.9848 6.66663-6.6667s-2.9847-6.66667-6.66663-6.66667c-3.68189 0-6.66666 2.98477-6.66666 6.66667s2.98477 6.6667 6.66666 6.6667z" />
              <path d="m8 5.33333v5.33337" />
              <path d="m5.33301 8h5.33329" />
            </g>
          </svg>
          New doc
        </BasicButton>
      </div>
    </aside>
  );
}

function FileList(): JSX.Element | null {
  const { state, dispatch } = useContext(Store);
  const { activeDocId: activeDoc, docs } = state;

  if (!docs.length) {
    return null;
  }

  const docsOrderedByDate = docs
    .slice()
    .sort((a, b) => b.creationDate - a.creationDate);

  return (
    <ul className={styles.fileList}>
      {docsOrderedByDate.map((doc) => (
        <File
          key={doc.id}
          active={doc.id === activeDoc}
          complete={doc.status === DocStatus.Complete}
          onClick={(e: React.SyntheticEvent) => {
            e.stopPropagation();
            dispatch({ type: Action.setActiveDocId, docId: doc.id });
          }}
        >
          {doc.title || 'Untitled doc'}
        </File>
      ))}
    </ul>
  );
}

interface FileProps {
  active?: boolean;
  complete: boolean;
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
}

function File(props: FileProps): JSX.Element {
  const { active, complete, children, onClick } = props;
  return (
    <li
      className={`${styles.file} ${active ? styles.active : ''} ${
        complete ? styles.complete : ''
      }`}
    >
      <button type="button" className={styles.fileLink} onClick={onClick}>
        {complete ? (
          <svg
            className={styles.fileIcon}
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
            className={styles.fileIcon}
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
        {children}
      </button>
    </li>
  );
}
