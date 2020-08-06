import { Editor } from 'slate';
import { isBlockAboveEmpty } from 'components/editor/queries';
import unindentListItem from 'components/editor/transforms/unindentListItem';

/**
 * If selection is in a nested empty sublist block, unindent.
 *
 * ### Before:
 * - Line 1
 *  - |
 *
 * ### After:
 * - Line 1
 * - |
 */
export default function unindentEmptyNestedListItem(editor: Editor): boolean {
  if (isBlockAboveEmpty(editor)) {
    return unindentListItem(editor);
  }

  return false;
}
