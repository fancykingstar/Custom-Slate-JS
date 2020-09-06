/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withPeopleElement from '../withPeopleElement';
import { PeopleRole } from '../PeopleElement';

describe('People Tool: Insert Break', () => {
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
            <people>
              <peopleTeam>
                Team 1<cursor />
              </peopleTeam>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Add new item below for filled choice where next sibling is also choice',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>
                Team 1<cursor />
              </peopleTeam>
              <peopleTeam>Team 2</peopleTeam>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
              <peopleTeam>Team 2</peopleTeam>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Add new node at end of item with content',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                Item 1<cursor />
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                Item 1
              </peopleItem>
              <peopleItem indent={0} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Add new choice below for filled choice where next sibling is item',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>
                Team 1<cursor />
              </peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                Item 1
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleTeam>
                <cursor />
              </peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                Item 1
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Exit people tool if at end of last, empty choice',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>
                <cursor />
              </peopleTeam>
            </people>
            {/* NOTE: Assume the existence of a trailing paragraph node */}
            <p>
              <text />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>
                <text />
              </peopleTeam>
            </people>
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
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={1} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Convert item to choice if empty and 0 indentation',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={0} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleTeam>
                <cursor />
              </peopleTeam>
            </people>
          </editor>
        ),
      },
    ],
    [
      'Split item retains indent but has no priority',
      {
        input: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={3} probability={PeopleRole.Responsible}>
                Item 1<cursor />
              </peopleItem>
            </people>
          </editor>
        ),
        output: (
          <editor>
            <people>
              <peopleTeam>Team 1</peopleTeam>
              <peopleItem indent={3} probability={PeopleRole.Responsible}>
                Item 1
              </peopleItem>
              <peopleItem indent={3} probability={PeopleRole.None}>
                <cursor />
              </peopleItem>
            </people>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withPeopleElement(withReact(input));
    editor.insertBreak();
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
