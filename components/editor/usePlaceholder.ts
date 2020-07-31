import { useState, useEffect, RefObject, useCallback } from 'react';
import { ReactEditor } from 'slate-react';
import { Range, Editor } from 'slate';

export default function usePlaceholder(
  editor: ReactEditor,
  wrapperRef: RefObject<HTMLDivElement>
): {
  phInlinePosY: number | null;
  phInlineVisible: boolean;
  phTitleVisible: boolean;
  onChangePlaceholder: (newSelection: Range | null) => void;
} {
  const [inlineVisible, setInlineVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);
  const [selection, setSelection] = useState<Range | null>(null);
  const [inlinePosY, setInlinePosY] = useState<number | null>(null);

  useEffect(() => {
    if (selection == null || !Range.isCollapsed(selection)) {
      return;
    }

    // Get the bounds of the current cursor
    const selectionDOMRange = ReactEditor.toDOMRange(editor, selection);
    const selectionRect = selectionDOMRange.getBoundingClientRect();

    // Get bounds of the editor wrapper
    if (wrapperRef.current == null) {
      return;
    }
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    // TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
    setInlinePosY(selectionRect.top - wrapperRect.top + 1.0);
  }, [selection, wrapperRef]);

  const onChange = useCallback(
    (newSelection: Range | null) => {
      // Hide the placeholder on blur
      if (newSelection == null || !Range.isCollapsed(newSelection)) {
        setInlineVisible(false);
        setSelection(null);
        return;
      }

      // NOTE: We can directly use `.anchor` as `.anchor` and `.focus` are equivalent
      const caretPoint = newSelection.anchor;
      const [node] = Editor.node(editor, caretPoint);

      // If it's the 1st line, determine whether to show title placeholder
      if (newSelection.anchor.path[0] === 0) {
        setTitleVisible(node.text === '');

        // Never show the inline assistant in the title
        setInlineVisible(false);
        return;
      }

      // Show inline placeholder if line is empty
      if (node.text === '') {
        setSelection(newSelection);
        setInlineVisible(true);
        return;
      }

      // Hide the assistant
      setInlineVisible(false);
    },
    [selection]
  );

  return {
    phInlinePosY: inlinePosY,
    phInlineVisible: inlineVisible && inlinePosY != null,
    phTitleVisible: titleVisible,
    onChangePlaceholder: onChange,
  };
}
