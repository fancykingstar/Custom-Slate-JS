import { ReactEditor } from 'slate-react';
import { Range, Editor, Transforms } from 'slate';
import { BasicElement } from 'components/elements/Element';
import unwrapList from 'components/elements/List/unwrapList';
import toggleList from 'components/editor/transforms';

const MARKDOWN_TRIGGER = ' ';

const preFormat = (editor: Editor) => unwrapList(editor);

const MarkdownTypes: {
  type: BasicElement;
  triggers: string[];
  preFormat?: (editor: Editor) => void;
  format?: (editor: Editor) => void;
}[] = [
  {
    type: BasicElement.ListItem,
    triggers: ['*', '-', '+'],
    preFormat,
    format: (editor) => {
      toggleList(editor, BasicElement.UnorderedList);
    },
  },
  {
    type: BasicElement.ListItem,
    triggers: ['1.', '1)'],
    preFormat,
    format: (editor) => {
      toggleList(editor, BasicElement.OrderedList);
    },
  },
];

const withMarkdown = (editor: ReactEditor): ReactEditor => {
  const { insertText } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertText = (text) => {
    const { selection } = editor;

    // Check if it's appropriate to do a markdown transform
    if (
      text !== MARKDOWN_TRIGGER ||
      selection == null ||
      !Range.isCollapsed(selection)
    ) {
      insertText(text);
      return;
    }

    // No-op for title line
    const caretPoint = selection.anchor;
    const [caretLine] = caretPoint.path;
    if (caretLine === 0) {
      insertText(text);
      return;
    }

    // Get the nearest block ancestor
    const aboveBlock = Editor.above(editor, {
      match: (node) => Editor.isBlock(editor, node),
    });

    // Look for markdown trigger
    const aboveBlockPath = aboveBlock != null ? aboveBlock[1] : [];
    const aboveBlockStart = Editor.start(editor, aboveBlockPath);
    const rangeFromBlockStart = {
      anchor: aboveBlockStart,
      focus: selection.focus,
    };
    const textFromBlockStart = Editor.string(editor, rangeFromBlockStart);

    // Check for to see if the text matches a markdown type's triggers
    const markdownType = MarkdownTypes.find((type) =>
      type.triggers.includes(textFromBlockStart)
    );

    if (markdownType != null) {
      // Delete the markdown trigger
      Transforms.delete(editor, { at: rangeFromBlockStart });

      markdownType.preFormat?.(editor);

      if (!markdownType.format) {
        // eslint-disable-next-line no-console
        console.warn('Markdown type exists with an unimplemented format fn.');
      } else {
        markdownType.format(editor);
      }
      return;
    }

    insertText(text);
  };

  return editor;
};

export default withMarkdown;
