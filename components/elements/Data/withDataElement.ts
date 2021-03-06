import { ReactEditor } from 'slate-react';
import { Editor, Transforms, Element, Path, Node } from 'slate';
import {
  DataElement,
  DataConfidence,
} from 'components/elements/Data/DataElement';
import {
  isSelectionAtBlockStart,
  isRangeAtRoot,
} from 'components/editor/queries';
import { BasicElement } from 'components/elements/Element';

function inRootElementOfType(editor: Editor, type: string): boolean {
  const nodeEntry = Editor.above(editor, {
    match: (n) => n.type === type,
  });
  return nodeEntry != null;
}

function unindentItem(editor: Editor, element: Element, path: Path): void {
  const indent = element.indent as number | null;
  if (indent == null || indent <= 0) {
    return;
  }

  Transforms.setNodes(
    editor,
    {
      indent: indent - 1,
    },
    {
      at: path,
    }
  );
}

function convertItemToCategory(editor: Editor, at: Path): void {
  Transforms.setNodes(
    editor,
    {
      type: DataElement.Category,
      children: [],
    },
    {
      at,
    }
  );
  Transforms.unsetNodes(editor, ['probability', 'indent'], {
    at,
  });
}

function convertCategoryToItem(editor: Editor, at: Path): void {
  Transforms.setNodes(
    editor,
    {
      type: DataElement.Item,
      indent: 0,
      probability: DataConfidence.None,
      children: [],
    },
    {
      at,
    }
  );
}

const withDataElement = (editor: ReactEditor): ReactEditor => {
  const { insertBreak, deleteBackward, normalizeNode } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertBreak = (): void => {
    const { selection } = editor;
    if (selection == null) {
      insertBreak();
      return;
    }

    // Do nothing if we're not in the data tool
    if (!inRootElementOfType(editor, DataElement.Tool)) {
      insertBreak();
      return;
    }

    const [, textPath] = Editor.node(editor, selection);
    const [node, nodePath] = Editor.parent(editor, textPath);
    const [parentNode, parentPath] = Editor.parent(editor, nodePath);
    const nodeIsEmpty = Editor.isEmpty(editor, node);
    const nodeIsFirstChild = Path.equals(nodePath, parentPath.concat(0));
    const nodeIsLastChild = Path.equals(
      nodePath,
      parentPath.concat(parentNode.children.length - 1)
    );

    if (node.type === DataElement.Category) {
      const nextNode = Editor.next(editor, {
        at: nodePath,
      });
      const nextNodeIsCategory =
        nextNode != null && nextNode[0].type === DataElement.Category;

      // Create new sibling list item if there's nothing after, or no list items after
      if (!nodeIsEmpty && (nodeIsLastChild || nextNodeIsCategory)) {
        const nextNodePath = Path.next(nodePath);
        insertBreak();
        convertCategoryToItem(editor, nextNodePath);
        return;
      }

      // Exit the tool if list item is empty, at end, and unindented
      if (nodeIsEmpty && nodeIsLastChild) {
        Transforms.select(editor, Path.next(parentPath));

        // Remove the node if it's not the first child
        if (!nodeIsFirstChild) {
          Transforms.removeNodes(editor, { at: nodePath });
        }
        return;
      }
    }

    if (node.type === DataElement.Item) {
      const indent = node.indent as number | null;

      // Unindent nested list item if it's at the end and empty
      if (nodeIsEmpty && nodeIsLastChild && indent != null && indent > 0) {
        unindentItem(editor, node, nodePath);
        return;
      }

      // Convert list item to choice if it's empty, at end, and unindented
      if (nodeIsEmpty && nodeIsLastChild && indent != null && indent <= 0) {
        convertItemToCategory(editor, nodePath);
        return;
      }

      // Ensure the newly created item has no priority
      Transforms.splitNodes(editor, {
        always: true,
      });

      Transforms.setNodes(editor, {
        probability: DataConfidence.None,
      });
      return;
    }

    insertBreak();
  };

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (selection == null) {
      deleteBackward(unit);
      return;
    }

    // If cursor is immediately after the tool, move cursor into the last node of the tool
    const atRoot = isRangeAtRoot(selection);
    if (atRoot) {
      const { path } = selection.focus;
      const parentPath = Path.parent(path);

      if (
        Editor.isStart(editor, selection.focus, parentPath) &&
        parentPath[0] > 0
      ) {
        const prevParentPath = Path.previous(parentPath);
        const [prevParentNode] = Editor.node(editor, prevParentPath);
        if (prevParentNode.type === DataElement.Tool) {
          const [, lastPath] = Editor.last(editor, prevParentPath);
          const endOfLastNode = Editor.end(editor, lastPath);
          Transforms.select(editor, endOfLastNode);
          return;
        }
      }
    }

    // Do nothing if we're not in the data tool
    if (!inRootElementOfType(editor, DataElement.Tool)) {
      deleteBackward(unit);
      return;
    }

    const [, textPath] = Editor.node(editor, selection);
    const [, nodePath] = Editor.parent(editor, textPath);
    const [parentNode, parentPath] = Editor.parent(editor, nodePath);
    const nodeIsFirstChild = Path.equals(nodePath, parentPath.concat(0));
    const selectionAtBlockStart = isSelectionAtBlockStart(editor);

    // Exit tool if at first element and at start
    if (nodeIsFirstChild && selectionAtBlockStart) {
      if (parentNode.children.length <= 1) {
        Transforms.unwrapNodes(editor, {
          match: (n) => n.type === DataElement.Tool,
          split: true,
        });
        Transforms.setNodes(editor, { type: BasicElement.Paragraph });
      }

      return;
    }

    // Merge with previous node if the previous node is empty
    if (!nodeIsFirstChild && selectionAtBlockStart) {
      const prevPath = Path.previous(nodePath);
      const [prevNode] = Editor.node(editor, prevPath);

      if (Editor.isEmpty(editor, prevNode as Element)) {
        Transforms.setNodes(
          editor,
          {
            ...prevNode,
          },
          {
            at: nodePath,
          }
        );

        Transforms.mergeNodes(editor, {
          at: nodePath,
        });

        return;
      }
    }

    deleteBackward(unit);
  };

  // eslint-disable-next-line no-param-reassign
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    const children = node.children as Node[] | null;

    if (
      Editor.isBlock(editor, node) &&
      path.length > 0 &&
      (node.type === DataElement.Category || node.type === DataElement.Item)
    ) {
      const parentPath = Path.parent(path);
      const [parentNode] = Editor.node(editor, parentPath);

      // Rule: If the choice or item tool is at root, convert to paragraph
      if (Editor.isEditor(parentNode)) {
        Transforms.setNodes(
          editor,
          {
            type: BasicElement.Paragraph,
          },
          {
            at: path,
          }
        );
        return;
      }

      // Rule: If a parent exists and it's not the data tool, convert to paragraph
      if (
        !Editor.isEditor(parentNode) &&
        parentNode.type !== DataElement.Tool
      ) {
        Transforms.setNodes(
          editor,
          {
            type: BasicElement.Paragraph,
          },
          {
            at: path,
          }
        );
        return;
      }

      // TODO: Disallow non-text nodes in choice/item elements
    }

    if (
      Editor.isBlock(editor, node) &&
      node.type === DataElement.Tool &&
      children != null
    ) {
      // Rule: Tool must always have a first-child choice element
      const firstChild = children[0];
      if (firstChild.type !== DataElement.Category) {
        if (Editor.isBlock(editor, firstChild)) {
          Transforms.setNodes(
            editor,
            {
              type: DataElement.Category,
            },
            {
              at: path.concat(0),
            }
          );
        } else {
          Transforms.wrapNodes(
            editor,
            {
              type: DataElement.Category,
              children: [],
            },
            {
              at: path.concat(0),
            }
          );
        }
        return;
      }

      let modifiedChildren = false;

      // Rule: Tool can only have choice and item children
      children.forEach((childNode, index) => {
        if (
          childNode.type !== DataElement.Category &&
          childNode.type !== DataElement.Item
        ) {
          if (Editor.isBlock(editor, childNode)) {
            Transforms.setNodes(
              editor,
              {
                type: DataElement.Category,
              },
              {
                at: path.concat(index),
              }
            );
          } else {
            Transforms.wrapNodes(
              editor,
              {
                type: DataElement.Category,
                children: [],
              },
              {
                at: path.concat(index),
              }
            );
          }

          modifiedChildren = true;
        }
      });

      if (modifiedChildren) {
        return;
      }
    }

    normalizeNode(entry);
  };

  return editor;
};

export default withDataElement;
