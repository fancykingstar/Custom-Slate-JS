/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Inversion Tool: Tab Key', () => {
  const tabCases: [
    string,
    {
      input: Editor;
      output: Editor;
    }
  ][] = [
    [
      'Tab in first Inversion does nothing',
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
                <inversionItemTitle>Line 2</inversionItemTitle>
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
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 2</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on (non-first) Inversion item creates new sublist in previous item',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
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
                <inversionItemTitle>Line 1</inversionItemTitle>
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
      'Tab on (non-first) Inversion item joins existing sublist in previous item',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 2
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                </inversionSublist>
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
                <inversionItemTitle>Line 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 2
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
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
      "Tab on sublist's first item does nothing",
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 2<cursor />
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
                <inversionItemTitle>Line 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 2<cursor />
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
      "Tab on sublist's (non-first) item indents",
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 2
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 3<cursor />
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
                <inversionItemTitle>Line 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Line 2
                    </inversionSublistItemParagraph>
                    <inversionSublist>
                      <inversionSublistItem>
                        <inversionSublistItemParagraph>
                          Line 3<cursor />
                        </inversionSublistItemParagraph>
                      </inversionSublistItem>
                    </inversionSublist>
                  </inversionSublistItem>
                </inversionSublist>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Tab on Inversion item with sublist indents sublist',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Sublist Line 1
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                </inversionSublist>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  Inversion 2<cursor />
                </inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Sublist Line 2
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
                <inversionItemTitle>Inversion 1</inversionItemTitle>
                <inversionSublist>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Sublist Line 1
                    </inversionSublistItemParagraph>
                  </inversionSublistItem>
                  <inversionSublistItem>
                    <inversionSublistItemParagraph>
                      Inversion 2<cursor />
                    </inversionSublistItemParagraph>
                    <inversionSublist>
                      <inversionSublistItem>
                        <inversionSublistItemParagraph>
                          Sublist Line 2
                        </inversionSublistItemParagraph>
                      </inversionSublistItem>
                    </inversionSublist>
                  </inversionSublistItem>
                </inversionSublist>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
  ];

  test.each(tabCases)('%s', (_, { input, output }) => {
    onElementKeyDown(
      input,
      null,
      new KeyboardEvent('keydown', { key: Keys.Tab })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
