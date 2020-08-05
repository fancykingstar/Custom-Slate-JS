import { ReactEditor, useSlate } from 'slate-react';
import { useEffect, useState } from 'react';
import { Range, Editor, Node } from 'slate';
import { BasicElement } from 'components/elements/Element';
import styles from './Placeholder.module.scss';

// TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
const PLACEHOLDER_OFFSET = 1.0; // px
const BODY_TOP_DEFAULT = 64 - PLACEHOLDER_OFFSET; // px
const TITLE_HEIGHT = 56; // px

export default function Placeholder(): JSX.Element {
  // Add `useSlate` to listen to every `onChange` event (unlike `useEditor`)
  const editor = useSlate();
  // TODO: When loading data from storage, change initial value to avoid flash of placeholder
  const [titleVisible, setTitleVisible] = useState(true);
  const [bodyVisible, setBodyVisible] = useState(true);
  const [bodyPosY, setBodyPosY] = useState(BODY_TOP_DEFAULT);

  // Handle title and body placeholder visibility
  useEffect(() => {
    const { selection } = editor;
    const nodes = editor.children;
    const firstBodyNode = nodes[1];
    const bodyIsEmpty =
      nodes.length <= 2 &&
      firstBodyNode != null &&
      !Node.string(firstBodyNode).length &&
      firstBodyNode.type === BasicElement.Paragraph;

    // TODO: Fix tabbing out of editor leaving assistant placeholder visible instead of body

    // If editor is blurred or has multi-character selection...
    if (selection == null || !Range.isCollapsed(selection)) {
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

    // We only care about the title line
    if (caretLine !== 0) {
      return;
    }

    setTitleVisible(caretNodeEmpty);
    // Determine whether to push body placeholder due to text wrap
    const titleElement = ReactEditor.toDOMNode(editor, caretNode).parentElement;
    if (titleElement == null) {
      return;
    }

    const titleBounds = titleElement.getBoundingClientRect();
    const bodyTop = BODY_TOP_DEFAULT + titleBounds.height - TITLE_HEIGHT;
    if (bodyTop !== bodyPosY) {
      setBodyPosY(bodyTop);
    }
  }, [editor.selection]);

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
        An excellent decision awaits
      </div>
    </>
  );
}
