/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Conclusion Tool: Backspace Key', () => {
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
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
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
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <p>
              <cursor />
            </p>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace at empty line in final choice exits tool',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
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
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in filled sublist item converts node into choice item',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
                    </p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  Line 1
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in sublist item with empty choice above converts node into choice item',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <text />
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                      Line 1
                    </p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <text />
                </conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  Line 1
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into filled choice item moves caret to end of choice item',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  Choice 1<cursor />
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into empty choice item moves',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <text />
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
            <p>
              <cursor />
            </p>
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
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root with text to choice item with text merges the two',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
            <p>
              <cursor />
              Line 1
            </p>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  Choice 1<cursor />
                  Line 1
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into choice item with sublist merges with sublist',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
            <p>
              <cursor />
              Line 2
            </p>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Line 2
                    </p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from first item with sublist does nothing',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  Choice 1
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
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
                  Choice 1
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from non-first item with sublist merges with previous choice item and moves sublist',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  Choice 2
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  Choice 1<cursor />
                  Choice 2
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from non-first item with sublist merges with previous choice item with sublist',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  Choice 2
                </conclusionItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
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
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
  ];

  test.each(backspaceCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      null,
      new KeyboardEvent('keydown', { key: Keys.Backspace })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
