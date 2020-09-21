import { Editor, Element, Text } from 'slate';

import { getAllNodesWithType } from 'components/editor/queries';
import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';

export function getAllGoalTitles(editor: Editor): string[] {
  return getAllNodesWithType(editor, GoalsElementType.ItemTitle).map((ne) => {
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
