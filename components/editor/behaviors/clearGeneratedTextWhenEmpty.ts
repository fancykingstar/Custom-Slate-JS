import { Editor, Range, Text, Transforms } from 'slate';

import { Author } from 'components/editor/author';

/**
 * Clear generated text when the deletion will cause an empty text node.
 */
export default function clearGeneratedTextWhenEmpty(editor: Editor): boolean {
  const { selection } = editor;
  if (
    selection == null ||
    !Range.isCollapsed(selection) ||
    selection.focus == null
  ) {
    return false;
  }

  const { path } = selection.focus;
  const [currentNode] = Editor.node(editor, path);
  if (
    !Text.isText(currentNode) ||
    currentNode.text.length !== 1 ||
    currentNode.author !== Author.Deca
  ) {
    return false;
  }

  if (selection.focus.offset !== 1) {
    return false;
  }

  Transforms.setNodes(
    editor,
    { author: undefined, original: undefined },
    { at: path }
  );
  Transforms.insertText(editor, '', { at: path });

  return true;
}
