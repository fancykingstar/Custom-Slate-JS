/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withPeopleElement from 'components/elements/People/withPeopleElement';

describe('People Tool: Normalizer', () => {
  const spaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Team element not allowed outside of tool',
      {
        input: (
          <editor>
            <peopleTeam>
              <cursor />
            </peopleTeam>
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
      'Team element not allowed nested in non-tool element',
      {
        input: (
          <editor>
            <p>
              <peopleTeam>
                <cursor />
              </peopleTeam>
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
            <peopleItem>
              <cursor />
            </peopleItem>
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
      'People must have first-child choice',
      {
        input: (
          <editor>
            <title>Title</title>
            <people>
              <peopleItem>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <title>Title</title>
            <people>
              <peopleTeam>
                <cursor />
              </peopleTeam>
            </people>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withPeopleElement(withReact(input));
    Editor.normalize(editor, { force: true });
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
