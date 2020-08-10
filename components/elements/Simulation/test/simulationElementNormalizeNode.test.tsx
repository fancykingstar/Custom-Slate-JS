/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withSimulationElement from 'components/elements/Simulation/withSimulationElement';

describe('Simulation Tool: Normalizer', () => {
  const spaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Choice element not allowed outside of tool',
      {
        input: (
          <editor>
            <simulationChoice>
              <cursor />
            </simulationChoice>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Choice element not allowed nested in non-tool element',
      {
        input: (
          <editor>
            <p>
              <simulationChoice>
                <cursor />
              </simulationChoice>
            </p>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <p>
                <cursor />
              </p>
            </p>
          </editor>
        ),
      },
    ],
    [
      'Item element not allowed outside of tool',
      {
        input: (
          <editor>
            <simulationItem>
              <cursor />
            </simulationItem>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Simulation must have first-child choice',
      {
        input: (
          <editor>
            <title>Title</title>
            <simulation>
              <simulationItem>
                <cursor />
              </simulationItem>
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
            </simulation>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withSimulationElement(withReact(input));
    Editor.normalize(editor, { force: true });
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
