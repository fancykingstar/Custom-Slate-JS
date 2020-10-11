/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withIssueTreeElement from '../withIssueTreeElement';
import { IssueTreeRole } from '../IssueTreeElement';

describe('IssueTree Tool: Insert Break', () => {
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
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Add new item below for filled choice where next sibling is also choice',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
              </issueTreeTeam>
              <issueTreeTeam>Team 2</issueTreeTeam>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
              <issueTreeTeam>Team 2</issueTreeTeam>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Add new node at end of item with content',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                Item 1<cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                Item 1
              </issueTreeItem>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Add new choice below for filled choice where next sibling is item',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                Team 1<cursor />
              </issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                Item 1
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeTeam>
                <cursor />
              </issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                Item 1
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Exit issueTree tool if at end of last, empty choice',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                <cursor />
              </issueTreeTeam>
            </issueTree>
            {/* NOTE: Assume the existence of a trailing paragraph node */}
            <p>
              <text />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>
                <text />
              </issueTreeTeam>
            </issueTree>
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
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={1} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Convert item to choice if empty and 0 indentation',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={0} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeTeam>
                <cursor />
              </issueTreeTeam>
            </issueTree>
          </editor>
        ),
      },
    ],
    [
      'Split item retains indent but has no priority',
      {
        input: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={3} probability={IssueTreeRole.Responsible}>
                Item 1<cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <issueTree>
              <issueTreeTeam>Team 1</issueTreeTeam>
              <issueTreeItem indent={3} probability={IssueTreeRole.Responsible}>
                Item 1
              </issueTreeItem>
              <issueTreeItem indent={3} probability={IssueTreeRole.None}>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withIssueTreeElement(withReact(input));
    editor.insertBreak();
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
