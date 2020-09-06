/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withDataElement from 'components/elements/Data/withDataElement';

describe('Data Tool: Normalizer', () => {
  const spaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Category element not allowed outside of tool',
      {
        input: (
          <editor>
            <dataCategory>
              <cursor />
            </dataCategory>
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
      'Category element not allowed nested in non-tool element',
      {
        input: (
          <editor>
            <p>
              <dataCategory>
                <cursor />
              </dataCategory>
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
            <dataItem>
              <cursor />
            </dataItem>
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
      'Data must have first-child choice',
      {
        input: (
          <editor>
            <title>Title</title>
            <data>
              <dataItem>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <title>Title</title>
            <data>
              <dataCategory>
                <cursor />
              </dataCategory>
            </data>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withDataElement(withReact(input));
    Editor.normalize(editor, { force: true });
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
