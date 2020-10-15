/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import withIssueTreeElement from 'components/elements/IssueTree/withIssueTreeElement';

describe('IssueTree Tool: Normalizer', () => {
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
            <issueTreeQuestion>
              <cursor />
            </issueTreeQuestion>
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
              <issueTreeQuestion>
                <cursor />
              </issueTreeQuestion>
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
            <issueTreeItem>
              <cursor />
            </issueTreeItem>
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
      'IssueTree must have first-child choice',
      {
        input: (
          <editor>
            <title>Title</title>
            <issueTree>
              <issueTreeItem>
                <cursor />
              </issueTreeItem>
            </issueTree>
          </editor>
        ),
        output: (
          <editor>
            <title>Title</title>
            <issueTree>
              <issueTreeQuestion>
                <cursor />
              </issueTreeQuestion>
            </issueTree>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withIssueTreeElement(withReact(input));
    Editor.normalize(editor, { force: true });
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
