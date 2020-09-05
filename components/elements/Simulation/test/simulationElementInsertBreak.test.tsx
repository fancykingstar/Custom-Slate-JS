/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withSimulationElement from '../withSimulationElement';
import { SimulationImportance } from '../SimulationElement';

describe('Simulation Tool: Insert Break', () => {
  const spaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Add new item below for filled choice with no next siblings',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
              </simulationChoice>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Add new item below for filled choice where next sibling is also choice',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
              </simulationChoice>
              <simulationChoice>Choice 2</simulationChoice>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
              <simulationChoice>Choice 2</simulationChoice>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Add new node at end of item with content',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                Item 1<cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                Item 1
              </simulationItem>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Add new choice below for filled choice where next sibling is item',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>
                Choice 1<cursor />
              </simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                Item 1
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationChoice>
                <cursor />
              </simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                Item 1
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Exit simulation tool if at end of last, empty choice',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>
                <cursor />
              </simulationChoice>
            </simulation>
            {/* NOTE: Assume the existence of a trailing paragraph node */}
            <p>
              <text />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>
                <text />
              </simulationChoice>
            </simulation>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Unindent item if at end, empty, and indented',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={1} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Convert item to choice if empty and 0 indentation',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={0} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationChoice>
                <cursor />
              </simulationChoice>
            </simulation>
          </editor>
        ),
      },
    ],
    [
      'Split item retains indent but has no priority',
      {
        input: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={3} importance={SimulationImportance.High}>
                Item 1<cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
        output: (
          <editor>
            <simulation>
              <simulationChoice>Choice 1</simulationChoice>
              <simulationItem indent={3} importance={SimulationImportance.High}>
                Item 1
              </simulationItem>
              <simulationItem indent={3} importance={SimulationImportance.None}>
                <cursor />
              </simulationItem>
            </simulation>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withSimulationElement(withReact(input));
    editor.insertBreak();
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
