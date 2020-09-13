import { useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { Editor, Node, NodeEntry, Range, Text } from 'slate';
import { ReactEditor, useEditor } from 'slate-react';

import { CloseX, Star } from 'components/icons/Icons';
import Indexer, {
  indexState,
  isInterestingSentence,
} from 'components/intelligence/Indexer';
import { Store } from 'store/store';

import styles from './StarBar.module.scss';

function getMiddleTop(nodeEl: HTMLElement, menuEl: HTMLElement): number[] {
  const nodeRect = nodeEl.getBoundingClientRect();
  const menuRect = menuEl.getBoundingClientRect();

  const middle = window.pageXOffset + nodeRect.x - menuRect.width - 8;
  const top = window.pageYOffset + nodeRect.y;

  return [middle, top];
}

function Menu(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useEditor();

  useEffect(() => {
    const menuEl = ref.current;
    const { selection } = editor;

    if (!menuEl) {
      return;
    }

    if (
      selection &&
      ReactEditor.isFocused(editor) &&
      Range.isCollapsed(selection)
    ) {
      const { path, offset } = selection.focus;
      if (path) {
        const pathString = path.toString();

        // TODO: make more performant.
        if (pathString in indexState.sentenceScores) {
          const sentences = indexState.sentenceScores[pathString];
          for (let i = 0; i < sentences.length; i += 1) {
            const sentence = sentences[i];
            if (isInterestingSentence(sentence)) {
              if (
                pathString === sentence.range.anchor.path.toString() &&
                pathString === sentence.range.focus.path.toString()
              ) {
                if (
                  sentence.range.anchor.offset <= offset &&
                  offset <= sentence.range.focus.offset
                ) {
                  const [node] = Editor.node(editor, selection.focus);
                  if (Text.isText(node)) {
                    const nodeEl = ReactEditor.toDOMNode(editor, node);
                    const [x, y] = getMiddleTop(nodeEl, menuEl);

                    menuEl.style.display = 'inline-block';
                    menuEl.style.left = `${x}px`;
                    menuEl.style.top = `${y}px`;
                    menuEl.style.visibility = 'visible';

                    return;
                  }
                }
              }
            }
          }
        }
      }
    }

    menuEl.style.visibility = 'hidden';
  });

  return (
    <div ref={ref} className={styles.menu}>
      <button type="button" className={styles.button}>
        <span className={styles.wrapper}>
          <img className={styles.image} src="/img/star.svg" alt="Star" />
        </span>
      </button>
      <button type="button" className={styles.button}>
        <span className={styles.wrapper}>
          <img
            className={styles.image}
            src="/img/x.svg"
            alt="Remove suggestion"
          />
        </span>
      </button>
    </div>
  );
}

export default function StarBar(): JSX.Element | null {
  const { state } = useContext(Store);

  return ReactDOM.createPortal(<Menu />, document.body);
}
