import { useState, useEffect, RefObject, useCallback } from 'react';
import { ReactEditor } from 'slate-react';
import { Point, Range, Editor } from 'slate';

export default function usePlaceholder(
  editor: ReactEditor,
  wrapperRef: RefObject<HTMLDivElement>
): {
  phVisible: boolean;
  phPosY: number;
  onChangePlaceholder: (newSelection: Range | null) => void;
} {
  const [selection, setSelection] = useState<Range | null>(null);
  const [posY, setPosY] = useState(0);

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
    setPosY(selectionRect.top - wrapperRect.top + 1.0);
  }, [selection, wrapperRef]);

  const onChange = useCallback(
    (newSelection: Range | null) => {
      // Hide the placeholder on blur
      if (newSelection == null || !Range.isCollapsed(newSelection)) {
        setSelection(null);
        return;
      }

      // Do nothing if the active line has not changed
      if (
        selection != null &&
        Point.equals(newSelection.anchor, selection.anchor)
      ) {
        return;
      }

      const [node] = Editor.node(editor, newSelection.anchor);
      setSelection(node.text === '' ? newSelection : null);
    },
    [selection]
  );

  return {
    phVisible: selection != null,
    phPosY: posY,
    onChangePlaceholder: onChange,
  };
}
