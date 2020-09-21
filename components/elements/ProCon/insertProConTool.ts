import { Editor, Transforms, Node } from 'slate';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { BasicElement } from 'components/elements/Element';

export default function insertProConTool(editor: Editor): void {
  const { selection } = editor;
  if (selection == null) {
    return;
  }

  const entry = Editor.parent(editor, selection);
  if (entry == null) {
    return;
  }
  const [, paragraphPath] = entry;

  Transforms.delete(editor);

  const choices = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) => n.type === ChoicesType.Item,
    })
  );

  if (!choices.length) {
    editor.insertText(
      '<Note: Use the Choices tool first to use the Pros / Cons tool>'
    );
    return;
  }

  const nodes: Node[] = choices
    // Ignore empty choices
    .filter((choice) => {
      const [choiceNode] = choice;
      return Node.string(choiceNode).length;
    })
    .map((choice) => {
      const [choiceNode] = choice;
      const content = Node.string(choiceNode);
      return {
        type: BasicElement.ListItem,
        children: [
          {
            type: BasicElement.Paragraph,
            children: [{ text: content }],
          },
          {
            type: BasicElement.UnorderedList,
            children: [
              {
                type: BasicElement.ListItem,
                children: [
                  {
                    type: BasicElement.Paragraph,
                    children: [{ text: 'Pros' }],
                  },
                  {
                    type: BasicElement.UnorderedList,
                    children: [
                      {
                        type: BasicElement.ListItem,
                        children: [
                          {
                            type: BasicElement.Paragraph,
                            children: [{ text: '' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: BasicElement.ListItem,
                children: [
                  {
                    type: BasicElement.Paragraph,
                    children: [{ text: 'Cons' }],
                  },
                  {
                    type: BasicElement.UnorderedList,
                    children: [
                      {
                        type: BasicElement.ListItem,
                        children: [
                          {
                            type: BasicElement.Paragraph,
                            children: [{ text: '' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
    });

  if (!nodes.length) {
    editor.insertText(
      '<Note: Fill in a choice in the Choices tool first to use the Pros / Cons tool>'
    );
    return;
  }

  Transforms.insertNodes(
    editor,
    {
      type: BasicElement.UnorderedList,
      children: nodes,
    },
    {
      at: paragraphPath,
    }
  );

  Transforms.select(editor, paragraphPath.concat([0, 1, 0, 1, 0, 0]));
}
