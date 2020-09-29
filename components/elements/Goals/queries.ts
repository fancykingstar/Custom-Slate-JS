import { Editor, Element, NodeEntry, Text } from 'slate';

import {
  getAllNodesWithType,
  getFirstTextChild,
} from 'components/editor/queries';
import { GoalsElementType } from 'components/elements/Goals/GoalsElementType';

export function getAllGoalEntries(editor: Editor): NodeEntry<Element>[] {
  return getAllNodesWithType(editor, GoalsElementType.ItemTitle).map((ne) => {
    return ne as NodeEntry<Element>;
  });
}
