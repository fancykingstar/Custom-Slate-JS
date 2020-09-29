/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Backspace-key', () => {
  const backspaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Backspace-key at start of empty line deletes list item',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ul>
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
      'Backspace-key at start of filled line converts list item to paragraph',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>
                  <cursor />
                  Lorem ipsum
                </p>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <cursor />
              Lorem ipsum
            </p>
          </editor>
        ),
      },
    ],
    [
      'Backspace-key in empty line in middle of multi-line list splits list',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
              <li>
                <p>Line 3</p>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
            </ul>
            <p>
              <cursor />
            </p>
            <ul>
              <li>
                <p>Line 3</p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Backspace-key in filled line in middle of multi-line list splits list',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
              <li>
                <p>
                  <cursor />
                  Lorem ipsum
                </p>
              </li>
              <li>
                <p>Line 3</p>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
            </ul>
            <p>
              <cursor />
              Lorem ipsum
            </p>
            <ul>
              <li>
                <p>Line 3</p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Backspace-key in empty line at end of multi-line list exits list',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
              <li>
                <p>Line 2</p>
              </li>
              <li>
                <p>
                  <cursor />
                </p>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
              <li>
                <p>Line 2</p>
              </li>
            </ul>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Backspace-key on empty nested list item unindents',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
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
      'Backspace-key on filled nested list item unindents',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 2
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
              </li>
              <li>
                <p>
                  <cursor />
                  Line 2
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Backspace-key on empty nested list item with filled siblings unindents',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                  <li>
                    <p>Line 3</p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  <cursor />
                </p>
                <ul>
                  <li>
                    <p>Line 3</p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
  ];

  test.each(backspaceCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      null,
      new KeyboardEvent('keydown', { key: Keys.Backspace })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
