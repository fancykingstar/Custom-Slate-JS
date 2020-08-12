import { Range } from 'slate';
import { ReactEditor } from 'slate-react';

/**
 * Automatically scroll the screen as user moves around the text editor.
 *
 * - Via https://github.com/ianstormtaylor/slate/issues/3750#issuecomment-657783206
 * - Modified to change the element that's scrolled into view to ensure it isn't off-screen
 */
export default function handleAutoScroll(editor: ReactEditor): void {
  if (!(window.chrome || typeof InstallTrigger !== 'undefined')) {
    return;
  }

  // Do nothing if there is no selection (or if it's a multi-line selection, which
  // automatically scrolls already)
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return;
  }

  try {
    const domPoint = ReactEditor.toDOMPoint(editor, editor.selection.focus);
    const [node] = domPoint;
    if (node == null) {
      return;
    }

    const element = node.parentElement;
    if (element == null) {
      return;
    }

    // Closest node that's a direct child of the editor (hacky and non-performant?)
    const rootElement = element.closest('#editor > *');
    if (rootElement == null) {
      return;
    }

    rootElement.scrollIntoView({
      block: 'nearest',
      inline: 'start',
    });
  } catch (e) {
    // No-op
  }
}
