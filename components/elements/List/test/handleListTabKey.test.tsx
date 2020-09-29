/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Tab-key', () => {
  const tabCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Tab at root level does nothing',
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
      'Tab on first list child does nothing',
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
      'Tab on non-list node does nothing',
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
      'Tab on list item with previous sibling without sublist creates new sublist',
      {
        input: (
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
        output: (
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
      },
    ],
    [
      'Tab on list item with previous sibling with sublist appends to sublist',
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
                </ul>
              </li>
              <li>
                <p>
                  Line 3<cursor />
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
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                  <li>
                    <p>
                      Line 3<cursor />
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </editor>
        ),
      },
    ],
    [
      'Tab indents nested list items',
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
                    <ul>
                      <li>
                        <p>Line 4</p>
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
                <ul>
                  <li>
                    <p>Line 2</p>
                    <ul>
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
      null,
      new KeyboardEvent('keydown', { key: Keys.Tab })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
