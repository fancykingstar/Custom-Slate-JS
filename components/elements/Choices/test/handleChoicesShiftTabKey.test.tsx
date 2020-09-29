/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Choices Tool: Shift+Tab Key', () => {
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
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 2</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 2</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts empty nested first-level list into choice',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 3</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 3</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts filled nested first-level list into choice',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
                    </p>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 3</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  Line 2<cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 3</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab does not convert nested non-first-level list into choice',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                    <ul>
                      <li>
                        <p>
                          Line 3<cursor />
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 4</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
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
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 4</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab splits nested list if unindenting from middle',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
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
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 5</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  Line 3<cursor />
                </choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 5</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
  ];

  test.each(tabCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      null,
      new KeyboardEvent('keydown', { key: Keys.Tab, shiftKey: true })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
