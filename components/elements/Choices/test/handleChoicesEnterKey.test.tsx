/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Choices Tool: Enter Key', () => {
  const enterCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Enter in title of empty choice item (with no next siblings) exits choices tool',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
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
      'Enter in title of empty choice item at end of choices tool exits choices tool',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
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
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <text />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at start of choice item with content creates empty sibling above',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                  Choice 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <text />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                  Choice 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of choice item with content creates new item below',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  Choice 1<cursor />
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in middle of item title splits item in two',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  Cho
                  <cursor />
                  ice 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Cho</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                  ice 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in empty sublist item converts node into choice item',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of choice item with sublist moves sublist',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  Choice 1<cursor />
                </choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
  ];

  test.each(enterCases)('%s', (_, { input, output }) => {
    onElementKeyDown(input, new KeyboardEvent('keydown', { key: Keys.Enter }));
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
