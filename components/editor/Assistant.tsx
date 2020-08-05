import { ReactEditor, useSlate } from 'slate-react';
import { useEffect, useRef, useState, RefObject } from 'react';
import { Range, Editor, Node } from 'slate';
// import { isKeyHotkey } from 'is-hotkey';
import styles from './Assistant.module.scss';
import { BasicElement } from '../elements/Element';
import { isRangeAtRoot } from './queries';

// TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
const PLACEHOLDER_OFFSET = 1.0; // px

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
  content: Array<JSX.Element>;
  pushContent: (newContent: JSX.Element) => void;
  shiftContent: () => void;
}

export const AssistantContent = {
  Default: (
    <>
      Start typing or press <kbd>/</kbd> to think
    </>
  ),
  Eliminate: <>Can you cross out some choices now?</>,
  Nudge: <>Could it be you’ve already made up your mind?</>,
};

export default function Assistant(props: Props): JSX.Element {
  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();

  const [visible, setVisible] = useState(false);
  const [posY, setPosY] = useState(0);

  const { wrapperRef, content, pushContent, shiftContent } = props;

  // Handle assistant placeholder visibility
  useEffect(() => {
    const { selection } = editor;

    // If editor is blurred or has multi-character selection...
    if (selection == null || !Range.isCollapsed(selection)) {
      // Hide the assistant if it's visible
      if (visible) {
        setVisible(false);
        shiftContent();
      }
      return;
    }

    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;

    // Never show assistant on 1st line
    if (caretLine === 0) {
      setVisible(false);
      shiftContent();
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
      nearestBlock[0].type === BasicElement.Paragraph
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
    shiftContent();
  }, [editor.selection, wrapperRef]);

  const timeoutId = useRef<number | null>(null);

  // Handle assistant content
  useEffect(() => {
    if (visible && timeoutId.current == null) {
      timeoutId.current = window.setTimeout(() => {
        pushContent(AssistantContent.Nudge);
      }, 5000);
    }
  }, [visible]);

  return (
    <div
      className={`${styles.placeholder} ${!visible ? styles.hidden : ''}`}
      style={{
        transform: `translate3d(0, ${posY / 10}rem, 0)`,
      }}
    >
      {content[0]}
    </div>
  );
}
