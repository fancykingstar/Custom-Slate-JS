import { Editor, Path, Range, Text, Transforms } from 'slate';

import { Author } from 'components/editor/author';

/**
 * Clear generated text when selection's intersects with it.
 */
export default function clearGeneratedTextWhenIntersects(
  editor: Editor
): boolean {
  const { selection } = editor;
  if (
    selection == null ||
    Range.isCollapsed(selection) ||
    selection.anchor == null ||
    selection.focus == null
  ) {
    return false;
  }

  const comparison = Path.compare(selection.anchor.path, selection.focus.path);
  let path;
  if (comparison < 0) {
    path = selection.focus.path;
  } else if (comparison > 0) {
    path = selection.anchor.path;
  } else {
    return false;
  }

  const [currentNode] = Editor.node(editor, path);
  if (!Text.isText(currentNode) || currentNode.author !== Author.Deca) {
    return false;
  }

  Transforms.setNodes(
    editor,
    { author: undefined, original: undefined },
    { at: path }
  );

  return false;
}
