/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withIssueTreeElement from 'components/elements/IssueTree/withIssueTreeElement';
import { IssueTreeRole } from 'components/elements/IssueTree/IssueTreeElement';

describe('IssueTree Tool: Delete Backward', () => {
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
            <issueTree>
              <issueTreeTeam>
                <cursor />
              </issueTreeTeam>
            </issueTree>
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
            <issueTree>
              <issueTreeTeam>
                <cursor />
              </issueTreeTeam>
              <issueTreeItem>Item 1</issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <title>Title</title>
            <issueTree>
              <issueTreeTeam>
                <cursor />
              </issueTreeTeam>
              <issueTreeItem>Item 1</issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to choice',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>
                <cursor />
                Item 1
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
                Item 1
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to choice',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeTeam>
                <cursor />
                Team 2
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
                Team 2
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Move from start of item to item',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>Item 1</issueTreeItem>
              <issueTreeItem>
                <cursor />
                Item 2
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>
                Item 1<cursor />
                Item 2
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Move from start of choice to item',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>Item 1</issueTreeItem>
              <issueTreeTeam>
                <cursor />
                Team 2
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>
                Item 1<cursor />
                Team 2
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Move from after tool into choice',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
            </issueTree>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
              </issueTreeTeam>
            </issueTree>
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
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>Item 1</issueTreeItem>
            </issueTree>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>
                Item 1<cursor />
              </issueTreeItem>
            </issueTree>
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
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem>
                <cursor />
                Item 1
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
                Item 1
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Merge with previous empty item',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={5} probability={IssueTreeRole.Responsible}>
                <text />
              </issueTreeItem>
              <issueTreeItem indent={3} probability={IssueTreeRole.None}>
                <cursor />
                Item 1
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={5} probability={IssueTreeRole.Responsible}>
                <cursor />
                Item 1
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withIssueTreeElement(withReact(input));
    editor.deleteBackward('character');
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
