import { Editor, Element, Text } from 'slate';

import { getAllNodesWithType, getTitle } from 'components/editor/queries';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';
import { GoalsElement } from 'components/elements/Goals/GoalsElement';

export function getAllChoiceTitles(editor: Editor): string[] {
  return getAllNodesWithType(editor, ChoicesType.ItemTitle).map((ne) => {
    const [node] = ne;
    if (Element.isElement(node) && node.children.length) {
      const child = node.children[0];
      if (Text.isText(child)) {
        return child.text;
      }
    }

    return '';
  });
}

export function getAllGoalTitles(editor: Editor): string[] {
  return getAllNodesWithType(editor, GoalsElement.ItemTitle).map((ne) => {
    const [node] = ne;
    if (Element.isElement(node) && node.children.length) {
      const child = node.children[0];
      if (Text.isText(child)) {
        return child.text;
      }
    }

    return '';
  });
}
