import { ReactEditor, useSlate } from 'slate-react';
import { useEffect, useState, RefObject } from 'react';
import { Range, Editor, Node } from 'slate';
import styles from './Placeholder.module.scss';

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
}

export default function Placeholder(props: Props): JSX.Element {
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [assistantPosY, setAssistantPosY] = useState(0);
  // TODO: When loading data from storage, change initial value to avoid flash of placeholder
  const [titleVisible, setTitleVisible] = useState(true);

  const [bodyVisible, setBodyVisible] = useState(true);
  const [bodyPosY, setBodyPosY] = useState(63);

  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();
  const { wrapperRef } = props;

  useEffect(() => {
    const { selection } = editor;
    const nodes = editor.children;
    const firstBodyNode = nodes[1];
    const firstBodyNodeEmpty = Node.string(firstBodyNode) === '';

    // If editor is blurred or has multi-character selection...
    if (selection == null || !Range.isCollapsed(selection)) {
      // Hide the assistant if it's visible
      if (assistantVisible) {
        setAssistantVisible(false);
      }

      // Show the body placeholder if doc body is empty
      if (nodes.length <= 2 && firstBodyNodeEmpty) {
        setBodyVisible(true);
      }
      return;
    }

    // NOTE: We can directly use `.anchor` as `.anchor` and `.focus` are equivalent for a collapsed selection
    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;
    const [caretNode] = Editor.node(editor, caretPoint);
    const caretNodeEmpty = caretNode.text === '';

    // Show the body placeholder if doc body is empty
    if (nodes.length <= 2 && firstBodyNodeEmpty) {
      setBodyVisible(true);
    }

    if (
      // Hide body placeholder if doc has content
      nodes.length > 2 ||
      (caretLine === 1 && caretNodeEmpty)
    ) {
      setBodyVisible(false);
    }

    // If it's the 1st line, focus on the title placeholder
    if (caretLine === 0) {
      setTitleVisible(caretNodeEmpty);
      // Never show assistant on 1st line
      setAssistantVisible(false);
      return;
    }

    if (caretNodeEmpty) {
      // Get bounds of current cursor
      const selectionDOMRange = ReactEditor.toDOMRange(editor, selection);
      const selectionRect = selectionDOMRange.getBoundingClientRect();

      if (wrapperRef.current != null) {
        // Get bounds of editor wrapper
        const wrapperRect = wrapperRef.current.getBoundingClientRect();

        // TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
        setAssistantPosY(selectionRect.top - wrapperRect.top + 1.0);
        setAssistantVisible(true);
      } else {
        // noop: Hide the assistant if we can't properly place it
      }
      return;
    }

    setAssistantVisible(false);
  }, [editor.selection, wrapperRef]);

  return (
    <>
      {titleVisible ? (
        <div className={styles.placeholderTitle}>Untitled Deca Doc</div>
      ) : null}
      {bodyVisible ? (
        <div
          className={styles.placeholder}
          style={{
            transform: `translate3d(0, ${bodyPosY}px, 0)`,
          }}
        >
          An excellent decision awaits…
        </div>
      ) : null}
      {assistantVisible ? (
        <div
          className={styles.placeholder}
          style={{
            transform: `translate3d(0, ${assistantPosY}px, 0)`,
          }}
        >
          Start typing or press <kbd>/</kbd> to think
        </div>
      ) : null}
    </>
  );
}
