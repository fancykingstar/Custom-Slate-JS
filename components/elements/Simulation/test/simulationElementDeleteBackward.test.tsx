/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withSimulationElement from 'components/elements/Simulation/withSimulationElement';
import { SimulationImportance } from 'components/elements/Simulation/SimulationElement';

describe('Simulation Tool: Delete Backward', () => {
  const spaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Delete at start of first line',
      {
        input: (
          <editor>
            <title>Title</title>
            <simulation>
              <simulationChoice>
                <cursor />
              </simulationChoice>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <title>Title</title>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Cannot delete at start of first line if there are siblings',
      {
        input: (
          <editor>
            <title>Title</title>
            <simulation>
              <simulationChoice>
                <cursor />
              </simulationChoice>
              <simulationItem>Item 1</simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <title>Title</title>
            <simulation>
              <simulationChoice>
                <cursor />
              </simulationChoice>
              <simulationItem>Item 1</simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to choice',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>
                <cursor />
                Item 1
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
                Item 1
              </simulationChoice>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to choice',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationChoice>
                <cursor />
                Choice 2
              </simulationChoice>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
                Choice 2
              </simulationChoice>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to item',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>Item 1</simulationItem>
              <simulationItem>
                <cursor />
                Item 2
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>
                Item 1<cursor />
                Item 2
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to item',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>Item 1</simulationItem>
              <simulationChoice>
                <cursor />
                Choice 2
              </simulationChoice>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>
                Item 1<cursor />
                Choice 2
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Move from after tool into choice',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
            </simulation>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
              </simulationChoice>
            </simulation>
            <p>
              <text />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Move from after tool into item',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>Item 1</simulationItem>
            </simulation>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>
                Item 1<cursor />
              </simulationItem>
            </simulation>
            <p>
              <text />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Merge with previous empty choice',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem>
                <cursor />
                Item 1
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
                Item 1
              </simulationChoice>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Merge with previous empty item',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={5} importance={SimulationImportance.High}>
                <text />
              </simulationItem>
              <simulationItem indent={3} importance={SimulationImportance.None}>
                <cursor />
                Item 1
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={5} importance={SimulationImportance.High}>
                <cursor />
                Item 1
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withSimulationElement(withReact(input));
    editor.deleteBackward('character');
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
