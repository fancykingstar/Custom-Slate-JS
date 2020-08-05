/** @jsx jsx */

import { Editor } from 'slate';
import jsx from '../../../test/jsx';
import removeMeta from '../../../test/removeMeta';
import Keys from '../../../editor/keys';
import onElementKeyDown from '../../onElementKeyDown';

describe('Shift+Tab', () => {
  const tabCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Shift+Tab does nothing at root level',
      {
        input: (
          <editor>
            <p>
              <cursor />
            </p>
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
      'Shift+Tab unindents a basic nested list',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
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
                  Line 2<cursor />
                </p>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab moves siblings after a given node into a new sublist inside the moved node',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
                    </p>
                  </li>
                  <li>
                    <p>Line 3</p>
                  </li>
                  <li>
                    <p>Line 4</p>
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
                  Line 2<cursor />
                </p>
                <ul>
                  <li>
                    <p>Line 3</p>
                  </li>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab splits a list if the unindented node is in the middle',
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
                      Line 3<cursor />
                    </p>
                  </li>
                  <li>
                    <p>Line 4</p>
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
                  Line 3<cursor />
                </p>
                <ul>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab un-indents nested items',
      {
        input: (
          <editor>
            <ul>
              <li>
                <p>Line 1</p>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
                    </p>
                    <ul>
                      <li>
                        <p>Line 3</p>
                      </li>
                    </ul>
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
                  Line 2<cursor />
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

  test.each(tabCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      new KeyboardEvent('keydown', { key: Keys.Tab, shiftKey: true })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
