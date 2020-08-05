/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Criteria Tool: Tab Key', () => {
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
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>
                  <cursor />
                </criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Line 2</criteriaItemTitle>
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
                </criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Line 2</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on (non-first) choice item creates new sublist in previous item',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Line 1</criteriaItemTitle>
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
                <criteriaItemTitle>Line 1</criteriaItemTitle>
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
      },
    ],
    [
      'Tab on (non-first) choice item joins existing sublist in previous item',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Line 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
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
                <criteriaItemTitle>Line 1</criteriaItemTitle>
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
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      "Tab on sublist's first item does nothing",
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Line 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
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
                <criteriaItemTitle>Line 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
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
      "Tab on sublist's (non-first) item indents",
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Line 1</criteriaItemTitle>
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
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Line 1</criteriaItemTitle>
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
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on choice item with sublist indents sublist',
      {
        input: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Criterion 1</criteriaItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 1</p>
                  </li>
                </ul>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  Criterion 2<cursor />
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 2</p>
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
                    <p>Sublist Line 1</p>
                  </li>
                  <li>
                    <p>
                      Criterion 2<cursor />
                    </p>
                    <ul>
                      <li>
                        <p>Sublist Line 2</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </criteriaItem>
            </criteriaWrapper>
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
