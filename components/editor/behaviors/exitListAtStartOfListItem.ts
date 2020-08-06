import { Editor } from 'slate';
import { isSelectionAtBlockStart } from 'components/editor/queries';
import unwrapList from 'components/elements/List/unwrapList';

/**
 * If caret is at start of list block (regardless of line content), exit the list
 *
 * ### Before:
 * - |Line 1  # Text is optional
 *
 * ### After:
 * |Line 1    # Text is optional
 *
 * ---
 *
 * If caret is in empty line in middle of multi-line list, split the list
 *
 * ### Before:
 * - Line 1
 * - |Line 2  # Text is optional
 * - Line 3
 *
 * ### After:
 * - Line 1
 * |Line 2    # Text is optional
 * - Line 3
 *
 * ---
 *
 * If caret is in empty line in final item in multi-line list, exit the list
 *
 * ###   Before:
 * - Line 1
 * - |
 *
 * ###   After:
 * - Line 1
 * |
 */
export default function exitListAtStartOfListItem(editor: Editor): boolean {
  if (isSelectionAtBlockStart(editor)) {
    unwrapList(editor);
    return true;
  }

  return false;
}
