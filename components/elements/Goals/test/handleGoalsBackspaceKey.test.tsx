/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Goals Tool: Backspace Key', () => {
  const backspaceCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Backspace at start of empty line exits tool',
      {
        input: (
          <editor>
            <goalsWrapper>
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
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Backspace at start of empty line (first choice of multiple), exit the tool',
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
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <cursor />
            </p>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace at empty line in final choice exits tool',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
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
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Backspace in empty sublist item converts node into choice item',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
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
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in filled sublist item converts node into choice item',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
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
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  Line 1
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in sublist item with empty choice above converts node into choice item',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <text />
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
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
                <goalsItemTitle>
                  <text />
                </goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  Line 1
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into filled choice item moves caret to end of choice item',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  Goal 1<cursor />
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into empty choice item moves',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <text />
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
            <p>
              <cursor />
            </p>
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
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root with text to choice item with text merges the two',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
            <p>
              <cursor />
              Line 1
            </p>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  Goal 1<cursor />
                  Line 1
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into choice item with sublist merges with sublist',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
            <p>
              <cursor />
              Line 2
            </p>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Line 2
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
      'Backspace from first item with sublist does nothing',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  Goal 1
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
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
                <goalsItemTitle>
                  <cursor />
                  Goal 1
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from non-first item with sublist merges with previous choice item and moves sublist',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  Goal 2
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
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
                <goalsItemTitle>
                  Goal 1<cursor />
                  Goal 2
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from non-first item with sublist merges with previous choice item with sublist',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Goal 1</goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  Goal 2
                </goalsItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
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
                    <p>
                      Line 1<cursor />
                      Goal 2
                    </p>
                  </li>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
  ];

  test.each(backspaceCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      new KeyboardEvent('keydown', { key: Keys.Backspace })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
