/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Conclusion Tool: Shift+Tab Key', () => {
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
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 2</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 2</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts empty nested first-level list into choice',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 3</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 3</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts filled nested first-level list into choice',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
                    </p>
                  </li>
                </ul>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 3</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  Line 2<cursor />
                </conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 3</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab does not convert nested non-first-level list into choice',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
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
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 4</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
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
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 4</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab splits nested list if unindenting from middle',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
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
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 5</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Line 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  Line 3<cursor />
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Line 5</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
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
