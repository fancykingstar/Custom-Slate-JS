/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Goals Tool: Shift+Tab Key', () => {
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
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                </goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 2</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                </goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 2</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts empty nested first-level list into choice',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 3</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                </goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 3</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts filled nested first-level list into choice',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
                    </p>
                  </li>
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 3</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  Line 2<cursor />
                </goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 3</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab does not convert nested non-first-level list into choice',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
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
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 4</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
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
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 4</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab splits nested list if unindenting from middle',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
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
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 5</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Line 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  Line 3<cursor />
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>Line 5</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
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
