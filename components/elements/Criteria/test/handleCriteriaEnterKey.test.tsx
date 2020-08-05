/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Criteria Tool: Enter Key', () => {
  const enterCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Enter in title of empty choice item (with no next siblings) exits criteria tool',
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
      'Enter in title of empty choice item at end of criteria tool exits criteria tool',
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
      'Enter in title of empty choice item (with next siblings) creates new choice item',
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
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <text />
                </criteriaItemTitle>
              </criteriaItem>
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
      },
    ],
    [
      'Enter at start of choice item with content creates empty sibling above',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  Criterion 1
                </criteriaItemTitle>
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
                  Criterion 1
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of choice item with content creates new item below',
      {
        input: (
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
      'Enter in middle of item title splits item in two',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  Cho
                  <cursor />
                  ice 1
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Cho</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                  ice 1
                </criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in empty sublist item converts node into choice item',
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
      'Enter at end of choice item with sublist moves sublist',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  Criterion 1<cursor />
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
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
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
  ];

  test.each(enterCases)('%s', (_, { input, output }) => {
    onElementKeyDown(input, new KeyboardEvent('keydown', { key: Keys.Enter }));
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
