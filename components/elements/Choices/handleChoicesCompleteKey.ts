import { Editor, Element, Text, Transforms } from 'slate';

import { Author } from 'components/editor/author';
import {
  isRangeAtRoot,
  getAllNodesWithType,
  getTitle,
} from 'components/editor/queries';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';
import { generateChoice } from 'components/intelligence/generator';

export default function handleChoicesCompleteKey(
  editor: Editor,
  event: KeyboardEvent
): boolean {
  const { selection } = editor;
  if (selection == null || isRangeAtRoot(selection)) {
    return false;
  }

  // Do nothing if we're not in the Choices tool
  const wrapperEntry = Editor.above(editor, {
    match: (n) => n.type === ChoicesElement.Wrapper,
  });
  if (wrapperEntry == null) {
    return false;
  }

  const path = selection.focus?.path;
  if (!path || !path.length) {
    return false;
  }

  const [currentNode] = Editor.node(editor, path);

  if (!currentNode || !Text.isText(currentNode) || currentNode.text !== '') {
    return false;
  }

  const parentPath = path.slice(0, path.length - 1);
  const [parentNode] = Editor.node(editor, parentPath);

  if (!parentNode || parentNode.type !== ChoicesElement.ItemTitle) {
    return false;
  }

  const title = getTitle(editor);
  const choiceTitles = getAllNodesWithType(
    editor,
    ChoicesElement.ItemTitle
  ).map((ne) => {
    const [node] = ne;
    if (Element.isElement(node) && node.children.length) {
      const child = node.children[0];
      if (Text.isText(child)) {
        return child.text;
      }
    }

    return '';
  });
  const goalTitles = getAllNodesWithType(editor, GoalsElement.ItemTitle).map(
    (ne) => {
      const [node] = ne;
      if (Element.isElement(node) && node.children.length) {
        const child = node.children[0];
        if (Text.isText(child)) {
          return child.text;
        }
      }

      return '';
    }
  );

  const generatedChoice = generateChoice({
    choices: choiceTitles,
    goals: goalTitles,
    title,
  });

  generatedChoice.then((choice) => {
    const trimmedChoice = choice.trim();
    Transforms.setNodes(
      editor,
      { text: '', author: Author.Deca },
      { at: path }
    );
    Transforms.insertText(editor, trimmedChoice, { at: path });
  });

  return true;
}
