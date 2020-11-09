import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { Editor, Range, Text, Transforms } from 'slate';
import { ReactEditor, useEditor } from 'slate-react';

import {
  indexState,
  isInterestingSentence,
} from 'components/intelligence/Indexer';
import { Store } from 'store/store';

import { v4 as uuidv4 } from 'uuid';
import { WidgetContext, WidgetType } from 'components/widgets/WidgetContext';
import { Star, CloseX } from 'components/icons/Icons';
import styles from './StarBar.module.scss';

function getMiddleTop(
  nodeEl: HTMLElement | globalThis.Range,
  menuEl: HTMLElement
): number[] {
  const nodeRect = nodeEl.getBoundingClientRect();
  const middle =
    nodeRect.left +
    window.pageXOffset -
    menuEl.offsetWidth / 2 +
    nodeRect.width / 2;
  const top = nodeRect.top + window.pageYOffset - menuEl.offsetHeight - 3;
  return [middle, top];
}

interface Focus {
  offset: number;
  path: number[];
}

function checkInterestingNode(focus: Focus): boolean {
  const { path, offset } = focus;
  if (path) {
    const pathString = path.toString();
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
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function Menu(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { addWidget } = useContext(WidgetContext);
  const [interestingSelected, setInterestingNode] = useState<boolean>(false);
  const [stroke, setStroke] = useState<string>('#C8C8D0');

  const editor = useEditor();
  const menuEl = ref.current;
  const { selection } = editor;

  const changeMenuStyle = useCallback(
    (x: number, y: number): void => {
      if (menuEl) {
        menuEl.style.display = 'inline-block';
        menuEl.style.left = `${x}px`;
        menuEl.style.top = `${y}px`;
        menuEl.style.visibility = 'visible';
      }
    },
    [menuEl]
  );

  useEffect(() => {
    if (!menuEl) {
      return;
    }
    if (selection && ReactEditor.isFocused(editor)) {
      const { focus, anchor } = selection;
      const [node] = Editor.node(editor, focus);
      if (Text.isText(node)) {
        if (node.star) {
          setStroke('#717284');
        } else {
          setStroke('#C8C8D0');
        }
        if (Range.isCollapsed(selection)) {
          if (checkInterestingNode(focus)) {
            setInterestingNode(true);
            const nodeEl = ReactEditor.toDOMNode(editor, node);
            const [x, y] = getMiddleTop(nodeEl, menuEl);
            changeMenuStyle(x, y);
            return;
          }
          if (node.star) {
            const nodeEl = ReactEditor.toDOMNode(editor, node);
            const [x, y] = getMiddleTop(nodeEl, menuEl);
            changeMenuStyle(x, y);
            return;
          }
        } else if (anchor.path.toString() === focus.path.toString()) {
          if (!checkInterestingNode(focus)) {
            setInterestingNode(false);
            const textSelection = window.getSelection();
            if (textSelection) {
              const range = textSelection.getRangeAt(0);
              const selectedText = Range.isBackward(selection)
                ? node.text.slice(focus.offset, anchor.offset)
                : node.text.slice(anchor.offset, focus.offset);
              if (selectedText.trim() !== '') {
                const [x, y] = getMiddleTop(range, menuEl);
                changeMenuStyle(x, y);
                return;
              }
            }
          }
        }
      }
    }
    menuEl.style.visibility = 'hidden';
  });

  const closeStarBar = () => {
    if (selection && (interestingSelected || Range.isCollapsed(selection))) {
      const { anchor, focus } = selection;
      const [node] = Editor.node(editor, focus);
      if (Text.isText(node) && selection) {
        Transforms.select(editor, {
          anchor: { path: anchor.path, offset: 0 },
          focus: {
            path: focus.path,
            offset: interestingSelected
              ? node.text.length - 1
              : node.text.length,
          },
        });
      }
    }
    Editor.addMark(editor, 'removedSuggested', true);
    Editor.removeMark(editor, 'star');
    if (menuEl) {
      menuEl.style.visibility = 'hidden';
    }
  };

  const addToInsights = useCallback((): void => {
    if (interestingSelected) {
      if (selection) {
        const { anchor, focus } = selection;
        const [node] = Editor.node(editor, focus);
        if (Text.isText(node)) {
          Transforms.select(editor, {
            anchor: { path: anchor.path, offset: 0 },
            focus: { path: focus.path, offset: node.text.length - 1 },
          });
        }
      }
    }
    Editor.addMark(editor, 'star', true);
    addWidget({
      id: uuidv4().toString(),
      type: WidgetType.Insights,
      title: '⭐️',
    });
    ReactEditor.focus(editor);
  }, [addWidget, interestingSelected]);

  return (
    <div ref={ref} className={styles.menu}>
      <div className={styles.wrapper}>
        <button type="button" className={styles.button} onClick={addToInsights}>
          <Star size="18" fill="none" stroke={stroke} />
        </button>
        <button type="button" className={styles.button} onClick={closeStarBar}>
          <span className={styles.wrapper}>
            <CloseX size="18" fill="none" stroke="#C8C8D0" />
          </span>
        </button>
      </div>
    </div>
  );
}

export default function StarBar(): JSX.Element | null {
  const { state } = useContext(Store);

  return ReactDOM.createPortal(<Menu />, document.body);
}
