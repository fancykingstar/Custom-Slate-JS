import { Editor, Transforms } from 'slate';
import { BasicElement, ListElementTypes } from 'components/elements/Element';
import { nodeIsType, getNodesWithType } from 'components/editor/queries';
import unwrapList from 'components/elements/List/unwrapList';

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
    type: BasicElement.Paragraph,
  });

  if (!isListAlready) {
    // Wrap paragraph block in unordered list node
    Transforms.wrapNodes(editor, {
      type: listType,
      children: [],
    });

    const paragraphNodes = [
      ...getNodesWithType(editor, BasicElement.Paragraph),
    ];

    paragraphNodes.forEach((node) => {
      const [, path] = node;
      Transforms.wrapNodes(
        editor,
        {
          type: BasicElement.ListItem,
          children: [],
        },
        {
          at: path,
        }
      );
    });
  }
}
