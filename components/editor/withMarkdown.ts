import { ReactEditor } from 'slate-react';
import { Range, Editor, Transforms, Point } from 'slate';
import { BaseElement } from '../Element';

const MARKDOWN_MAP: { [key: string]: BaseElement } = {
  '-': BaseElement.ListItem,
};

const withMarkdown = (editor: ReactEditor): ReactEditor => {
  const { deleteBackward, insertText } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertText = (text) => {
    const { selection } = editor;

    // TODO: Add exception noop for title line

    // Look for single empty space insertions (indicative of markdown invokation)
    if (text === ' ' && selection != null && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      // Get the nearest block ancestor
      const block = Editor.above(editor, {
        match: (node) => Editor.isBlock(editor, node),
      });

      // Get the text of the block up until the inputted whitespace
      const path = block != null ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      // See if it's a markdown shortcut
      const type = MARKDOWN_MAP[beforeText];

      if (type != null) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(
          editor,
          { type },
          { match: (node) => Editor.isBlock(editor, node) }
        );

        if (type === BaseElement.ListItem) {
          const list = { type: BaseElement.UnorderedList, children: [] };
          Transforms.wrapNodes(editor, list, {
            match: (node) => node.type === BaseElement.ListItem,
          });
        }

        return;
      }
    }

    insertText(text);
  };

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection != null && Range.isCollapsed(selection)) {
      // Get the nearest block ancestor
      const match = Editor.above(editor, {
        match: (node) => Editor.isBlock(editor, node),
      });

      if (match != null) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== BaseElement.Paragraph &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: BaseElement.Paragraph });

          if (block.type === BaseElement.ListItem) {
            Transforms.unwrapNodes(editor, {
              match: (node) => node.type === BaseElement.UnorderedList,
              split: true,
            });
          }

          return;
        }
      }
    }

    deleteBackward(unit);
  };

  return editor;
};

export default withMarkdown;
