/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Goals Tool: Enter Key', () => {
  const enterCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Enter in title of empty choice item (with no next siblings) exits goals tool',
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
      'Enter in title of empty choice item at end of goals tool exits goals tool',
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
      'Enter in title of empty choice item (with next siblings) creates new choice item',
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
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <text />
                </goalsItemTitle>
              </goalsItem>
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
      },
    ],
    [
      'Enter at start of choice item with content creates empty sibling above',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  Goal 1
                </goalsItemTitle>
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
                  Goal 1
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of choice item with content creates new item below',
      {
        input: (
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
      'Enter in middle of item title splits item in two',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  Cho
                  <cursor />
                  ice 1
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
        output: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>Cho</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
                  ice 1
                </goalsItemTitle>
              </goalsItem>
            </goalsWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in empty sublist item converts node into choice item',
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
      'Enter at end of choice item with sublist moves sublist',
      {
        input: (
          <editor>
            <goalsWrapper>
              <goalsItem>
                <goalsItemTitle>
                  Goal 1<cursor />
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
                <goalsItemTitle>Goal 1</goalsItemTitle>
              </goalsItem>
              <goalsItem>
                <goalsItemTitle>
                  <cursor />
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
  ];

  test.each(enterCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      null,
      new KeyboardEvent('keydown', { key: Keys.Enter })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
