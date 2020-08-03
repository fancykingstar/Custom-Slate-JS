/** @jsx jsx */

import { Editor } from 'slate';
import jsx from '../../../test/jsx';
import onKeyDownList from '../List';
import removeMeta from '../../../test/removeMeta';
import Keys from '../../../editor/keys';

describe('Enter-key', () => {
  const enterCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Enter-key in empty single-item list destroys list',
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
      'Enter-key in empty line in middle of multi-line list splits list',
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
      'Enter-key in empty line at end of multi-line list exits list',
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
      'Enter-key on start of line creates node before current list item',
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
            <ul>
              <li>
                <p>
                  <text />
                </p>
              </li>
              <li>
                <p>
                  <cursor />
                  Lorem ipsum
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Enter-key on end of line creates node after current list item',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>
                  Lorem ipsum
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
                <p>Lorem ipsum</p>
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
      'Enter-key in middle of line splits node',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>
                  Lor
                  <cursor />
                  em ipsum
                </p>
              </li>
            </ul>
          </editor>
        ),
        output: (
          <editor>
            <ul>
              <li>
                <p>Lor</p>
              </li>
              <li>
                <p>
                  <cursor />
                  em ipsum
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Enter-key at end of parent of nested node moves nested node to new node',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>
                  Line 1<cursor />
                </p>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
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
              <li>
                <p>
                  <cursor />
                </p>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </li>
              <li>
                <p>Line 3</p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Enter-key on empty nested list item unindents',
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
      'Enter-key on empty nested list item with filled siblings unindents',
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

  test.each(enterCases)('%s', (_, { input, output }) => {
    onKeyDownList(input, new KeyboardEvent('keydown', { key: Keys.Enter }));
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
