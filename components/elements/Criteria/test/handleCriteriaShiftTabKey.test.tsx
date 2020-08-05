/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Criteria Tool: Shift+Tab Key', () => {
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
      'Shift+Tab converts empty nested first-level list into choice',
      {
        input: (
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
              <criteriaItem>
                <criteriaItemTitle>Line 3</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
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
              <criteriaItem>
                <criteriaItemTitle>Line 3</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts filled nested first-level list into choice',
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
              <criteriaItem>
                <criteriaItemTitle>Line 3</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
        output: (
          <editor>
            <criteriaWrapper>
              <criteriaItem>
                <criteriaItemTitle>Line 1</criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  Line 2<cursor />
                </criteriaItemTitle>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Line 3</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab does not convert nested non-first-level list into choice',
      {
        input: (
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
              <criteriaItem>
                <criteriaItemTitle>Line 4</criteriaItemTitle>
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
                      Line 3<cursor />
                    </p>
                  </li>
                </ul>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Line 4</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab splits nested list if unindenting from middle',
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
                    <ul>
                      <li>
                        <p>Line 4</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Line 5</criteriaItemTitle>
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
                </ul>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>
                  Line 3<cursor />
                </criteriaItemTitle>
                <ul>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </criteriaItem>
              <criteriaItem>
                <criteriaItemTitle>Line 5</criteriaItemTitle>
              </criteriaItem>
            </criteriaWrapper>
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
