/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withDataElement from 'components/elements/Data/withDataElement';
import { DataConfidence } from 'components/elements/Data/DataElement';

describe('Data Tool: Delete Backward', () => {
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
            <data>
              <dataCategory>
                <cursor />
              </dataCategory>
            </data>
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
            <data>
              <dataCategory>
                <cursor />
              </dataCategory>
              <dataItem>Item 1</dataItem>
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
              <dataItem>Item 1</dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to choice',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>
                <cursor />
                Item 1
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>
                Category 1<cursor />
                Item 1
              </dataCategory>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to choice',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataCategory>
                <cursor />
                Category 2
              </dataCategory>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>
                Category 1<cursor />
                Category 2
              </dataCategory>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to item',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>Item 1</dataItem>
              <dataItem>
                <cursor />
                Item 2
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>
                Item 1<cursor />
                Item 2
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to item',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>Item 1</dataItem>
              <dataCategory>
                <cursor />
                Category 2
              </dataCategory>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>
                Item 1<cursor />
                Category 2
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Move from after tool into choice',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
            </data>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>
                Category 1<cursor />
              </dataCategory>
            </data>
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
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>Item 1</dataItem>
            </data>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>
                Item 1<cursor />
              </dataItem>
            </data>
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
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem>
                <cursor />
                Item 1
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>
                Category 1<cursor />
                Item 1
              </dataCategory>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Merge with previous empty item',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={5} probability={DataConfidence.High}>
                <text />
              </dataItem>
              <dataItem indent={3} probability={DataConfidence.None}>
                <cursor />
                Item 1
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={5} probability={DataConfidence.High}>
                <cursor />
                Item 1
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withDataElement(withReact(input));
    editor.deleteBackward('character');
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
