import { Editor, Element, NodeEntry, Text } from 'slate';

import { getAllNodesWithType } from 'components/editor/queries';
import { ChoicesType } from 'components/elements/Choices/ChoicesType';

export function getAllChoiceEntries(editor: Editor): NodeEntry<Element>[] {
  return getAllNodesWithType(editor, ChoicesType.ItemTitle).map((ne) => {
    return ne as NodeEntry<Element>;
  });
}
