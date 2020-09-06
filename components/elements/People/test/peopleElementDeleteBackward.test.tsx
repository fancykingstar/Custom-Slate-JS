/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withPeopleElement from 'components/elements/People/withPeopleElement';
import { PeopleRole } from 'components/elements/People/PeopleElement';

describe('People Tool: Delete Backward', () => {
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
            <people>
              <peopleTeam>
                <cursor />
              </peopleTeam>
            </people>
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
            <people>
              <peopleTeam>
                <cursor />
              </peopleTeam>
              <peopleItem>Item 1</peopleItem>
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
              <peopleItem>Item 1</peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to choice',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>
                <cursor />
                Item 1
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>
                Team 1<cursor />
                Item 1
              </peopleTeam>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to choice',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleTeam>
                <cursor />
                Team 2
              </peopleTeam>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>
                Team 1<cursor />
                Team 2
              </peopleTeam>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to item',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>Item 1</peopleItem>
              <peopleItem>
                <cursor />
                Item 2
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>
                Item 1<cursor />
                Item 2
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to item',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>Item 1</peopleItem>
              <peopleTeam>
                <cursor />
                Team 2
              </peopleTeam>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>
                Item 1<cursor />
                Team 2
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Move from after tool into choice',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
            </people>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>
                Team 1<cursor />
              </peopleTeam>
            </people>
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
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>Item 1</peopleItem>
            </people>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>
                Item 1<cursor />
              </peopleItem>
            </people>
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
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem>
                <cursor />
                Item 1
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>
                Team 1<cursor />
                Item 1
              </peopleTeam>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Merge with previous empty item',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={5} probability={PeopleRole.Responsible}>
                <text />
              </peopleItem>
              <peopleItem indent={3} probability={PeopleRole.None}>
                <cursor />
                Item 1
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={5} probability={PeopleRole.Responsible}>
                <cursor />
                Item 1
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withPeopleElement(withReact(input));
    editor.deleteBackward('character');
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
