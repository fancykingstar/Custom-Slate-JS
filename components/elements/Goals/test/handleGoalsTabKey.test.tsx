/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Goals Tool: Tab Key', () => {
  const tabCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Tab in first choice does nothing',
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
      'Tab on (non-first) choice item creates new sublist in previous item',
      {
        input: (
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
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on (non-first) choice item joins existing sublist in previous item',
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
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                </goalsItemTitle>
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
                      <cursor />
                    </p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      "Tab on sublist's first item does nothing",
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
                    <p>
                      Line 2<cursor />
                    </p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      "Tab on sublist's (non-first) item indents",
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
                  </li>
                </ul>
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
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on choice item with sublist indents sublist',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 1</p>
                  </li>
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  Goal 2<cursor />
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 2</p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 1</p>
                  </li>
                  <li>
                    <p>
                      Goal 2<cursor />
                    </p>
                    <ul>
                      <li>
                        <p>Sublist Line 2</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
  ];

  test.each(tabCases)('%s', (_, { input, output }) => {
    onElementKeyDown(input, new KeyboardEvent('keydown', { key: Keys.Tab }));
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
