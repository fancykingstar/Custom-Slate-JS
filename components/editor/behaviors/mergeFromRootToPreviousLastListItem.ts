import { Editor, Path, Transforms } from 'slate';
import {
  isSelectionAtBlockStart,
  isRangeAtRoot,
} from 'components/editor/queries';

/**
 * If we're pressing backspace on a root element, merge it with the last node in the previous root element
 *
 * ### Before:
 * - Choice 1
 *
 * |Line 1
 *
 * ### After:
 * - Choice 1|Line 1
 *
 * ---
 *
 * If we're pressing backspace on a root element, merge it with the last item in the previous root element
 *
 * ### Before:
 * - Choice 1
 *   - Line 1
 *
 * |Line 2
 *
 * ### After:
 * - Choice 1
 *   - Line 1|Line 2
 */
export default function mergeFromRootToPreviousLastListItem(
  editor: Editor,
  rootElementType: string[]
): boolean {
  const { selection } = editor;
  if (selection == null) {
    return false;
  }

  const caretAtStartOfBlock = isSelectionAtBlockStart(editor);
  const [, path] = Editor.node(editor, selection);
  const [, parentPath] = Editor.parent(editor, path);

  if (
    caretAtStartOfBlock &&
    isRangeAtRoot(selection) &&
    parentPath[parentPath.length - 1] > 0
  ) {
    const previousParentPath = Path.previous(parentPath);
    const [previousParentNode] = Editor.node(editor, previousParentPath);

    if (!rootElementType.includes(previousParentNode.type as string)) {
      return false;
    }

    const [, lastNodePath] = Editor.last(editor, previousParentPath);
    const [lastNodeParentNode, lastNodeParentPath] = Editor.parent(
      editor,
      lastNodePath
    );

    Transforms.setNodes(
      editor,
      {
        type: lastNodeParentNode.type,
      },
      {
        at: parentPath,
      }
    );

    const newPath = Path.next(lastNodeParentPath);
    Transforms.moveNodes(editor, {
      at: parentPath,
      to: newPath,
    });

    Transforms.mergeNodes(editor, {
      at: newPath,
    });

    return true;
  }

  return false;
}
