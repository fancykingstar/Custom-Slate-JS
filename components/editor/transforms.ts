import { Editor, Transforms } from 'slate';
import { BaseElement, ListElementTypes } from '../Element';
import { nodeIsType, getNodesWithType } from './queries';
import unwrapList from '../elements/List/unwrapList';

/**
 * Toggles whether or not the current block is a list.
 */
export default function toggleList(
  editor: Editor,
  listType: ListElementTypes
): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  const isListAlready = nodeIsType(editor, listType);

  unwrapList(editor);

  // Ensure block is a paragraph
  Transforms.setNodes(editor, {
    type: BaseElement.Paragraph,
  });

  if (!isListAlready) {
    // Wrap paragraph block in unordered list node
    Transforms.wrapNodes(editor, {
      type: listType,
      children: [],
    });

    const paragraphNodes = [...getNodesWithType(editor, BaseElement.Paragraph)];

    paragraphNodes.forEach((node) => {
      const [, path] = node;
      Transforms.wrapNodes(
        editor,
        {
          type: BaseElement.ListItem,
          children: [],
        },
        {
          at: path,
        }
      );
    });
  }
}
