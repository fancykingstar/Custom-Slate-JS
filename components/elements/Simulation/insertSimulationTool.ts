import { Editor, Transforms, Node } from 'slate';
import {
  SimulationElement,
  SimulationProbability,
} from 'components/elements/Simulation/SimulationElement';
import { ChoicesElement } from 'components/elements/Choices/ChoicesElement';

/**
 * Converts the node at the current selection into an Simulation tool.
 *
 * Copies choices from the choices tool if they're available.
 */
export default function insertSimulationTool(editor: Editor): void {
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

  const nodes: Node[] = [];
  let newSelection = paragraphPath;
  const choices = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) => n.type === ChoicesElement.ItemTitle,
    })
  );

  const filledChoices = choices.filter((choice) => {
    const [choiceNode] = choice;
    return Node.string(choiceNode).length;
  });

  if (filledChoices.length) {
    filledChoices.forEach((choice) => {
      const [choiceNode] = choice;
      const content = Node.string(choiceNode);

      nodes.push({
        type: SimulationElement.Choice,
        children: [{ text: `Choice: ${content}` }],
      });
      nodes.push({
        type: SimulationElement.Item,
        children: [{ text: '' }],
        indent: 0,
        probability: SimulationProbability.None,
      });
    });

    newSelection = newSelection.concat([1, 0]);
  } else {
    nodes.push({
      type: SimulationElement.Choice,
      children: [{ text: '' }],
    });
    newSelection = newSelection.concat([0, 0]);
  }

  Transforms.insertNodes(
    editor,
    {
      timestamp: Date.now(),
      type: SimulationElement.Tool,
      children: nodes,
    },
    {
      at: paragraphPath,
    }
  );

  Transforms.select(editor, newSelection);
}
