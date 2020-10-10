import { Editor, Range, Text } from 'slate';

import { Author } from 'components/editor/author';

/**
 * Do nothing if at the front of nonempty generated text.
 */
export default function nothingOnFrontOfNonemptyGeneratedText(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (
    selection == null ||
    !Range.isCollapsed(selection) ||
    selection.focus == null ||
    selection.focus.offset !== 0
  ) {
    return false;
  }

  const [currentNode] = Editor.node(editor, selection.focus.path);
  if (!Text.isText(currentNode) || currentNode.author !== Author.Deca) {
    return false;
  }

  if (currentNode.text.length > 0) {
    return true;
  }

  return false;
}
