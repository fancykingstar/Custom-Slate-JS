/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Choices Tool: Backspace Key', () => {
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
      'Backspace at start of empty line (first choice of multiple), exit the tool',
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
            <p>
              <cursor />
            </p>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace at empty line in final choice exits tool',
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
      'Backspace in empty sublist item converts node into choice item',
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
      'Backspace in filled sublist item converts node into choice item',
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
                      Line 1
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
                  Line 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in sublist item with empty choice above converts node into choice item',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <text />
                </choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
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
                <choicesItemTitle>
                  <text />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                  Line 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into filled choice item moves caret to end of choice item',
      {
        input: (
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
        output: (
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
      },
    ],
    [
      'Backspace from root into empty choice item moves',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <text />
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
            <p>
              <cursor />
            </p>
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
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root with text to choice item with text merges the two',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
            <p>
              <cursor />
              Line 1
            </p>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  Choice 1<cursor />
                  Line 1
                </choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into choice item with sublist merges with sublist',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
            <p>
              <cursor />
              Line 2
            </p>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Line 2
                    </p>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from first item with sublist does nothing',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                  Choice 1
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
                <choicesItemTitle>
                  <cursor />
                  Choice 1
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
    [
      'Backspace from non-first item with sublist merges with previous choice item and moves sublist',
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
                  Choice 2
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
                <choicesItemTitle>
                  Choice 1<cursor />
                  Choice 2
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
    [
      'Backspace from non-first item with sublist merges with previous choice item with sublist',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                  Choice 2
                </choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
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
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Choice 2
                    </p>
                  </li>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
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
