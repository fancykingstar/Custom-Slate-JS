/** @jsx jsx */

import { Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import withMarkdown from '../../../editor/withMarkdown';
import jsx from '../../../test/jsx';
import removeMeta from '../../../test/removeMeta';

describe('Space-key', () => {
  const spaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Space key creates ul',
      {
        input: (
          <editor>
            <p>Question</p>
            <p>
              -<cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <p>Question</p>
            <ul>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Space key creates ol',
      {
        input: (
          <editor>
            <p>Question</p>
            <p>
              1.
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <p>Question</p>
            <ol>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ol>
          </editor>
        ),
      },
    ],
    [
      'Space key creates separate ul from existing ul above',
      {
        input: (
          <editor>
            <p>Question</p>
            <ul>
              <li>
                <p>Item 1</p>
              </li>
            </ul>
            <p>
              -<cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <p>Question</p>
            <ul>
              <li>
                <p>Item 1</p>
              </li>
            </ul>
            <ul>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Space key converts ul to ol',
      {
        input: (
          <editor>
            <p>Question</p>
            <ul>
              <li>
                <p>
                  1.
                  <cursor />
                </p>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <p>Question</p>
            <ol>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ol>
          </editor>
        ),
      },
    ],
    [
      'Space key converts ol to ul',
      {
        input: (
          <editor>
            <p>Question</p>
            <ol>
              <li>
                <p>
                  -<cursor />
                </p>
              </li>
            </ol>
          </editor>
        ),
        output: (
          <editor>
            <p>Question</p>
            <ul>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
  ];

  test.each(spaceCases)('%s', (_, { input, output }) => {
    const editor: ReactEditor = withMarkdown(withReact(input));
    editor.insertText(' ');
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
