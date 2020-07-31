import { ReactEditor, useSlate } from 'slate-react';
import { useEffect, useState, RefObject } from 'react';
import { Range, Editor } from 'slate';
import styles from './Placeholder.module.scss';

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
}

export default function Placeholder(props: Props): JSX.Element {
  const [inlineVisible, setInlineVisible] = useState(false);
  const [inlinePosY, setInlinePosY] = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);

  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();
  const { wrapperRef } = props;

  useEffect(() => {
    const { selection } = editor;
    if (selection == null || !Range.isCollapsed(selection)) {
      if (inlineVisible) {
        setInlineVisible(false);
      }
      return;
    }

    // NOTE: We can directly use `.anchor` as `.anchor` and `.focus` are equivalent for a collapsed selection
    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;
    const [node] = Editor.node(editor, caretPoint);
    const nodeIsEmpty = node.text === '';

    // If it's the 1st line, focus on the title placeholder
    if (caretLine === 0) {
      setTitleVisible(nodeIsEmpty);
      // Never show inline assistant on 1st line
      setInlineVisible(false);
      return;
    }

    if (nodeIsEmpty) {
      // Get bounds of current cursor
      const selectionDOMRange = ReactEditor.toDOMRange(editor, selection);
      const selectionRect = selectionDOMRange.getBoundingClientRect();

      if (wrapperRef.current != null) {
        // Get bounds of editor wrapper
        const wrapperRect = wrapperRef.current.getBoundingClientRect();

        // TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
        setInlinePosY(selectionRect.top - wrapperRect.top + 1.0);
        setInlineVisible(true);
      } else {
        // noop: Hide the assistant if we can't properly place it
      }

      return;
    }

    setInlineVisible(false);
  }, [editor.selection, wrapperRef]);

  return (
    <>
      {titleVisible ? (
        <div className={styles.placeholderTitle}>Untitled Deca Doc</div>
      ) : null}
      {/* <div className={styles.placeholderFirstLine}>Your decision awaits...</div> */}
      {inlineVisible ? (
        <div
          className={styles.placeholder}
          style={{
            transform: `translate3d(0, ${inlinePosY}px, 0)`,
          }}
        >
          Start typing or press <kbd>/</kbd> to think
        </div>
      ) : null}
    </>
  );
}
