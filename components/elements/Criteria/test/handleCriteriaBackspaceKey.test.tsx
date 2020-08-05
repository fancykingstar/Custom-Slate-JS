/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Criteria Tool: Backspace Key', () => {
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
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
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
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                </criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <cursor />
            </p>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace at empty line in final choice exits tool',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
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
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in filled sublist item converts node into choice item',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
                    </p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Line 1
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in sublist item with empty choice above converts node into choice item',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <text />
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
                    </p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <text />
                </criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Line 1
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into filled choice item moves caret to end of choice item',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  Criterion 1<cursor />
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into empty choice item moves',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <text />
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root with text to choice item with text merges the two',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
            <p>
              <cursor />
              Line 1
            </p>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  Criterion 1<cursor />
                  Line 1
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into choice item with sublist merges with sublist',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
            <p>
              <cursor />
              Line 2
            </p>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Line 2
                    </p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from first item with sublist does nothing',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Criterion 1
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Criterion 1
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from non-first item with sublist merges with previous choice item and moves sublist',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Criterion 2
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  Criterion 1<cursor />
                  Criterion 2
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from non-first item with sublist merges with previous choice item with sublist',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Criterion 2
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Criterion 2
                    </p>
                  </li>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
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
