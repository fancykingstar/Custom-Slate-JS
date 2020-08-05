/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Choices Tool: Tab Key', () => {
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
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>
                  <cursor />
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 2</choicesItemTitle>
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
                </choicesItemTitle>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>Line 2</choicesItemTitle>
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on (non-first) choice item creates new sublist in previous item',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
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
                <choicesItemTitle>Line 1</choicesItemTitle>
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
      },
    ],
    [
      'Tab on (non-first) choice item joins existing sublist in previous item',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
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
                <choicesItemTitle>Line 1</choicesItemTitle>
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
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      "Tab on sublist's first item does nothing",
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
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
                <choicesItemTitle>Line 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
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
      "Tab on sublist's (non-first) item indents",
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
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
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
        output: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Line 1</choicesItemTitle>
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
              </choicesItem>
            </choicesWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on choice item with sublist indents sublist',
      {
        input: (
          <editor>
            <choicesWrapper>
              <choicesItem>
                <choicesItemTitle>Choice 1</choicesItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 1</p>
                  </li>
                </ul>
              </choicesItem>
              <choicesItem>
                <choicesItemTitle>
                  Choice 2<cursor />
                </choicesItemTitle>
                <ul>
                  <li>
                    <p>Sublist Line 2</p>
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
                    <p>Sublist Line 1</p>
                  </li>
                  <li>
                    <p>
                      Choice 2<cursor />
                    </p>
                    <ul>
                      <li>
                        <p>Sublist Line 2</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </choicesItem>
            </choicesWrapper>
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
