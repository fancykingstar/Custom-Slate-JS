import { ReactEditor, useSlate } from 'slate-react';
import { useEffect, useRef, useState, RefObject } from 'react';
import { Range, Editor, Node } from 'slate';
import styles from './Assistant.module.scss';
import { BaseElement } from '../Element';
import { isRangeAtRoot } from './queries';

// TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
const PLACEHOLDER_OFFSET = 1.0; // px

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
}

export default function Assistant(props: Props): JSX.Element {
  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();

  const [visible, setVisible] = useState(false);
  const [posY, setPosY] = useState(0);

  const { wrapperRef } = props;

  // Handle assistant placeholder visibility
  useEffect(() => {
    const { selection } = editor;

    // If editor is blurred or has multi-character selection...
    if (selection == null || !Range.isCollapsed(selection)) {
      // Hide the assistant if it's visible
      if (visible) {
        setVisible(false);
      }
      return;
    }

    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;

    // Never show assistant on 1st line
    if (caretLine === 0) {
      setVisible(false);
      return;
    }

    const [caretNode] = Editor.node(editor, caretPoint);
    const nearestBlock = Editor.above(editor, {
      match: (node) => Editor.isBlock(editor, node),
    });

    // Determine whether or not to show the assistant placeholder
    if (
      !Node.string(caretNode).length &&
      isRangeAtRoot(selection) &&
      nearestBlock != null &&
      nearestBlock[0].type === BaseElement.Paragraph
    ) {
      // Get bounds of current cursor
      const selectionDOMRange = ReactEditor.toDOMRange(editor, selection);
      const selectionRect = selectionDOMRange.getBoundingClientRect();

      if (wrapperRef.current != null) {
        // Get bounds of editor wrapper
        const wrapperRect = wrapperRef.current.getBoundingClientRect();

        // TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
        setPosY(selectionRect.top - wrapperRect.top + PLACEHOLDER_OFFSET);
        setVisible(true);
      } else {
        // noop: Hide the assistant if we can't properly place it
      }
      return;
    }

    setVisible(false);
  }, [editor.selection, wrapperRef]);

  const [content, setContent] = useState(
    <>
      Start typing or press <kbd>/</kbd> to think
    </>
  );
  const timeoutId = useRef<number | null>(null);

  // Handle assistant content
  useEffect(() => {
    if (visible && timeoutId.current == null) {
      // TODO: function is not called when the assistant is not visible
      timeoutId.current = window.setTimeout(() => {
        setContent(<>Have you already made your decision?</>);
      }, 5000);
    }

    return () => {
      if (timeoutId.current != null) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, [visible]);

  return (
    <div
      className={`${styles.placeholder} ${!visible ? styles.hidden : ''}`}
      style={{
        transform: `translate3d(0, ${posY / 10}rem, 0)`,
      }}
    >
      {content}
    </div>
  );
}
