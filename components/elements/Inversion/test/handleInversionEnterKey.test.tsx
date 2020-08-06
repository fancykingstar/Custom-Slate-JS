/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Inversion Tool: Enter Key', () => {
  const enterCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Enter in title of empty Inversion item (with no next siblings) adds new list item',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <text />
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in title of empty Inversion item at end of Inversion tool exits Inversion tool',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Enter in title of empty Inversion item (with next siblings) creates new Inversion item',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <text />
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at start of Inversion item with content creates empty sibling above',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                  Inversion 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <text />
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                  Inversion 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of first Inversion item with content creates new sublist below',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  Inversion 1<cursor />
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      <cursor />
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                </inversionSublist>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in middle of item title splits item in two',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  Cho
                  <cursor />
                  ice 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Cho</inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                  ice 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter in empty sublist item converts node into Inversion item',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Enter at end of Inversion item with sublist moves sublist',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  Inversion 1<cursor />
                </inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                </inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </inversionItem>
            </inversionWrapper>
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
