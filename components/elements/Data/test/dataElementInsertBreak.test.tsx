/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withDataElement from '../withDataElement';
import { DataConfidence } from '../DataElement';

describe('Data Tool: Insert Break', () => {
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
            <data>
              <dataCategory>
                Category 1<cursor />
              </dataCategory>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Add new item below for filled choice where next sibling is also choice',
      {
        input: (
          <editor>
            <data>
              <dataCategory>
                Category 1<cursor />
              </dataCategory>
              <dataCategory>Category 2</dataCategory>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
              <dataCategory>Category 2</dataCategory>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Add new node at end of item with content',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                Item 1<cursor />
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                Item 1
              </dataItem>
              <dataItem indent={0} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Add new choice below for filled choice where next sibling is item',
      {
        input: (
          <editor>
            <data>
              <dataCategory>
                Category 1<cursor />
              </dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                Item 1
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataCategory>
                <cursor />
              </dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                Item 1
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Exit data tool if at end of last, empty choice',
      {
        input: (
          <editor>
            <data>
              <dataCategory>
                <cursor />
              </dataCategory>
            </data>
            {/* NOTE: Assume the existence of a trailing paragraph node */}
            <p>
              <text />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>
                <text />
              </dataCategory>
            </data>
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
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={1} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Convert item to choice if empty and 0 indentation',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={0} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataCategory>
                <cursor />
              </dataCategory>
            </data>
          </editor>
        ),
      },
    ],
    [
      'Split item retains indent but has no priority',
      {
        input: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={3} probability={DataConfidence.High}>
                Item 1<cursor />
              </dataItem>
            </data>
          </editor>
        ),
        output: (
          <editor>
            <data>
              <dataCategory>Category 1</dataCategory>
              <dataItem indent={3} probability={DataConfidence.High}>
                Item 1
              </dataItem>
              <dataItem indent={3} probability={DataConfidence.None}>
                <cursor />
              </dataItem>
            </data>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withDataElement(withReact(input));
    editor.insertBreak();
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
