import { ReactEditor, useSlate } from 'slate-react';
import { useEffect, useState, RefObject } from 'react';
import { Range, Editor, Node } from 'slate';
import styles from './Placeholder.module.scss';
import { BaseElement } from '../Element';

// TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
const PLACEHOLDER_OFFSET = 1.0; // px
const BODY_TOP_DEFAULT = 64 - PLACEHOLDER_OFFSET; // px
const TITLE_HEIGHT = 48; // px

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
}

export default function Placeholder(props: Props): JSX.Element {
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [assistantPosY, setAssistantPosY] = useState(0);
  // TODO: When loading data from storage, change initial value to avoid flash of placeholder
  const [titleVisible, setTitleVisible] = useState(true);

  const [bodyVisible, setBodyVisible] = useState(true);
  const [bodyPosY, setBodyPosY] = useState(BODY_TOP_DEFAULT);

  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();
  const { wrapperRef } = props;

  useEffect(() => {
    const { selection } = editor;
    const nodes = editor.children;
    const firstBodyNode = nodes[1];
    const bodyIsEmpty =
      nodes.length <= 2 &&
      !Node.string(firstBodyNode).length &&
      firstBodyNode.type === BaseElement.Paragraph;

    // TODO: Fix tabbing out of editor leaving assistant placeholder visible instead of body

    // If editor is blurred or has multi-character selection...
    if (selection == null || !Range.isCollapsed(selection)) {
      // Hide the assistant if it's visible
      if (assistantVisible) {
        setAssistantVisible(false);
      }

      // Show the body placeholder if doc body is empty
      if (bodyIsEmpty) {
        setBodyVisible(true);
      }
      return;
    }

    // NOTE: We can directly use `.anchor` as `.anchor` and `.focus` are equivalent for a collapsed selection
    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;
    const [caretNode] = Editor.node(editor, caretPoint);
    const caretNodeEmpty = !Node.string(caretNode).length;

    // Show the body placeholder if doc body is empty
    if (bodyIsEmpty) {
      setBodyVisible(true);
    }

    if (
      // Hide body placeholder if doc has content
      !bodyIsEmpty ||
      (caretLine === 1 && caretNodeEmpty)
    ) {
      setBodyVisible(false);
    }

    // If it's the 1st line, focus on the title placeholder
    if (caretLine === 0) {
      setTitleVisible(caretNodeEmpty);
      // Never show assistant on 1st line
      setAssistantVisible(false);

      // Determine whether to push body placeholder due to text wrap
      const titleElement = ReactEditor.toDOMNode(editor, caretNode)
        .parentElement;
      if (titleElement == null) {
        return;
      }

      const titleBounds = titleElement.getBoundingClientRect();
      const bodyTop = BODY_TOP_DEFAULT + titleBounds.height - TITLE_HEIGHT;
      if (bodyTop !== bodyPosY) {
        setBodyPosY(bodyTop);
      }
      return;
    }

    // Determine whether or not to show the assistant placeholder
    const nearestBlock = Editor.above(editor, {
      match: (node) => Editor.isBlock(editor, node),
    });

    if (
      caretNodeEmpty &&
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
        setAssistantPosY(
          selectionRect.top - wrapperRect.top + PLACEHOLDER_OFFSET
        );
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
      <div
        className={`${styles.placeholderTitle} ${
          !titleVisible ? styles.hidden : ''
        }`}
      >
        What’s your question?
      </div>
      <div
        className={`${styles.placeholder} ${!bodyVisible ? styles.hidden : ''}`}
        style={{
          transform: `translate3d(0, ${bodyPosY / 10}rem, 0)`,
        }}
      >
        An excellent decision awaits…
      </div>
      <div
        className={`${styles.placeholder} ${
          !assistantVisible ? styles.hidden : ''
        }`}
        style={{
          transform: `translate3d(0, ${assistantPosY / 10}rem, 0)`,
        }}
      >
        Start typing or press <kbd>/</kbd> to think
      </div>
    </>
  );
}
