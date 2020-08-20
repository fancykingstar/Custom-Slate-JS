import BasicButton from 'components/buttons/BasicButton';
import { useContext } from 'react';
import { Store, Action } from 'store/store';
import styles from './SidebarToggle.module.scss';

export default function SidebarToggle(): JSX.Element {
  const { state, dispatch } = useContext(Store);
  const { sidebarVisible } = state;

  return (
    <BasicButton
      className={sidebarVisible ? styles.visible : ''}
      onClick={() =>
        dispatch({
          type: Action.setSidebarVisible,
          visible: !sidebarVisible,
        })
      }
    >
      <svg
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
          <path d="m12.6667 2h-9.33337c-.73638 0-1.33333.59695-1.33333 1.33333v9.33337c0 .7363.59695 1.3333 1.33333 1.3333h9.33337c.7363 0 1.3333-.597 1.3333-1.3333v-9.33337c0-.73638-.597-1.33333-1.3333-1.33333z" />
          <path d="m6 2v12" />
        </g>
      </svg>
    </BasicButton>
  );
}
