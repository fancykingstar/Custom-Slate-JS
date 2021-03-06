import { Node, NodeEntry, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { BasicElement } from 'components/elements/Element';
import { ReservedElement } from 'components/elements/ReservedElement';

const withLayout = (editor: ReactEditor): ReactEditor => {
  const { normalizeNode } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.normalizeNode = (entry: NodeEntry<Node>) => {
    const [, path] = entry;
    if (path.length) {
      return normalizeNode(entry);
    }

    // Enforce: If doc is empty, add a blank title element
    if (editor.children.length < 1) {
      const title = {
        type: ReservedElement.Title,
        children: [{ text: '' }],
      };
      Transforms.insertNodes(editor, title, { at: path.concat(0) });
    }

    // TODO: In future, we should create the trailing paragraph on the fly to avoid
    // the issue of unexpected paragraphs existing

    // Enforce: If we're missing a body paragraph, add it
    // Enforce: If last element is not a paragraph, add a blank paragraph element
    const lastElement = editor.children[editor.children.length - 1];
    if (
      editor.children.length < 2 ||
      lastElement.type !== BasicElement.Paragraph
    ) {
      const paragraph = {
        type: BasicElement.Paragraph,
        children: [{ text: '' }],
      };
      Transforms.insertNodes(editor, paragraph, {
        at: path.concat(editor.children.length),
      });
    }

    const children = Node.children(editor, path);
    Array.from(children).forEach(([child, childPath]) => {
      const [childStart] = childPath;

      // Enforce: If 1st element is not title, turn into title
      if (childStart === 0 && child.type !== ReservedElement.Title) {
        Transforms.setNodes(
          editor,
          { type: ReservedElement.Title },
          { at: childPath }
        );

        // Hack: Move cursor to start of doc b/c Slate is out-of-sync (?)
        // - Fixes `Select-All+Delete` leaving first two lines selected, even though
        //   Slate's selection object says nothing should be selected.
        // - https://developer.mozilla.org/en-US/docs/Web/API/Selection/collapse
        if (editor.selection != null && typeof window !== 'undefined') {
          const windowSelection = window.getSelection();
          if (windowSelection != null && windowSelection.type === 'Range') {
            windowSelection.collapse(windowSelection.anchorNode, 0);
          }
        }
      }

      // Enforce: No other element can be a title
      if (childStart !== 0 && child.type === ReservedElement.Title) {
        Transforms.setNodes(
          editor,
          { type: BasicElement.Paragraph },
          { at: childPath }
        );
      }
    });

    // TODO: Enforce title line is flat and only h1

    return normalizeNode(entry);
  };

  return editor;
};

export default withLayout;
