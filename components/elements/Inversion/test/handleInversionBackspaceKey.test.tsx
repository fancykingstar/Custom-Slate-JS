/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Inversion Tool: Backspace Key', () => {
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
            <p>
              <cursor />
            </p>
          </editor>
        ),
      },
    ],
    [
      'Backspace at start of empty line (first Inversion of multiple), exit the tool',
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
            <p>
              <cursor />
            </p>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in empty sublist item converts node into Inversion item',
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
      'Backspace in filled sublist item merges with item title',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      <cursor />
                      Line 1
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                </inversionSublist>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  Inversion 1<cursor />
                  Line 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace in sublist item with empty Inversion above merges',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <text />
                </inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      <cursor />
                      Line 1
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                </inversionSublist>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                  Line 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into filled Inversion item moves caret to end of Inversion item',
      {
        input: (
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
        output: (
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
      },
    ],
    [
      'Backspace from root into empty Inversion item moves',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <text />
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
            <p>
              <cursor />
            </p>
          </editor>
        ),
        output: (
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
      },
    ],
    [
      'Backspace from root with text to Inversion item with text merges the two',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
            <p>
              <cursor />
              Line 1
            </p>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  Inversion 1<cursor />
                  Line 1
                </inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from root into Inversion item with sublist merges with sublist',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </inversionItem>
            </inversionWrapper>
            <p>
              <cursor />
              Line 2
            </p>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Line 2
                    </p>
                  </li>
                </ul>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Backspace from first item with sublist does nothing',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                  Inversion 1
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
                <inversionItemTitle>
                  <cursor />
                  Inversion 1
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
    [
      'Backspace from non-first item with sublist merges with previous Inversion item and moves sublist',
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
                  Inversion 2
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
                <inversionItemTitle>
                  Inversion 1<cursor />
                  Inversion 2
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
    [
      'Backspace from non-first item with sublist merges with previous Inversion item with sublist',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 1</p>
                  </li>
                </ul>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  <cursor />
                  Inversion 2
                </inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
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
                <ul>
                  <li>
                    <p>
                      Line 1<cursor />
                      Inversion 2
                    </p>
                  </li>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </inversionItem>
            </inversionWrapper>
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
