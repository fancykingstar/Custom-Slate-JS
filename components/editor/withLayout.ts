import { Node, NodeEntry, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { BaseElement } from '../Element';

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
        type: 'title',
        children: [{ text: '' }],
      };
      Transforms.insertNodes(editor, title, { at: path.concat(0) });
    }

    // Enforce: If no 2nd element, add a blank paragraph element
    if (editor.children.length < 2) {
      const paragraph = {
        type: BaseElement.Paragraph,
        children: [{ text: '' }],
      };
      Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
    }

    const children = Node.children(editor, path);
    Array.from(children).forEach(([child, childPath]) => {
      const [childStart] = childPath;

      // Enforce: If 1st element is not title, turn into title
      if (childStart === 0 && child.type !== BaseElement.Title) {
        Transforms.setNodes(
          editor,
          { type: BaseElement.Title },
          { at: childPath }
        );
      }

      // Enforce: No other element can be a title
      if (childStart !== 0 && child.type === BaseElement.Title) {
        Transforms.setNodes(
          editor,
          { type: BaseElement.Paragraph },
          { at: childPath }
        );
      }
    });

    return normalizeNode(entry);
  };

  return editor;
};

export default withLayout;