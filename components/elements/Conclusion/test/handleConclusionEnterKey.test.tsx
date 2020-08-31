/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Conclusion Tool: Enter Key', () => {
  const enterCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Enter in title of empty choice item (with no next siblings) exits conclusion tool',
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
      'Enter in title of empty choice item at end of conclusion tool exits conclusion tool',
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
      'Enter in title of empty choice item (with next siblings) creates new choice item',
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
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <text />
                </conclusionItemTitle>
              </conclusionItem>
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
      },
    ],
    [
      'Enter at start of choice item with content creates empty sibling above',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  Choice 1
                </conclusionItemTitle>
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
                  Choice 1
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of choice item with content creates new item below',
      {
        input: (
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
      'Enter in middle of item title splits item in two',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  Cho
                  <cursor />
                  ice 1
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>Cho</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
                  ice 1
                </conclusionItemTitle>
              </conclusionItem>
            </conclusionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in empty sublist item converts node into choice item',
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
      'Enter at end of choice item with sublist moves sublist',
      {
        input: (
          <editor>
            <conclusionWrapper>
              <conclusionItem>
                <conclusionItemTitle>
                  Choice 1<cursor />
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
                <conclusionItemTitle>Choice 1</conclusionItemTitle>
              </conclusionItem>
              <conclusionItem>
                <conclusionItemTitle>
                  <cursor />
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
  ];

  test.each(enterCases)('%s', (_, { input, output }) => {
    onElementKeyDown(input, new KeyboardEvent('keydown', { key: Keys.Enter }));
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
