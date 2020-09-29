/** @jsx jsx */

import { Editor } from 'slate';
import jsx from 'components/test/jsx';
import removeMeta from 'components/test/removeMeta';
import Keys from 'components/editor/keys';
import onElementKeyDown from 'components/elements/onElementKeyDown';

describe('Inversion Tool: Shift+Tab Key', () => {
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
      'Shift+Tab converts empty nested first-level list into Inversion',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>
                      <cursor />
                    </p>
                  </li>
                </ul>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 3</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
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
              <inversionItem>
                <inversionItemTitle>Line 3</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab converts filled nested first-level list into Inversion',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>
                      Line 2<cursor />
                    </p>
                  </li>
                </ul>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 3</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  Line 2<cursor />
                </inversionItemTitle>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 3</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab does not convert nested non-first-level list into Inversion',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
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
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 4</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
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
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 4</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
      },
    ],
    [
      'Shift+Tab splits nested list if unindenting from middle',
      {
        input: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
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
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 5</inversionItemTitle>
              </inversionItem>
            </inversionWrapper>
          </editor>
        ),
        output: (
          <editor>
            <inversionWrapper>
              <inversionItem>
                <inversionItemTitle>Line 1</inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 2</p>
                  </li>
                </ul>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>
                  Line 3<cursor />
                </inversionItemTitle>
                <ul>
                  <li>
                    <p>Line 4</p>
                  </li>
                </ul>
              </inversionItem>
              <inversionItem>
                <inversionItemTitle>Line 5</inversionItemTitle>
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
      new KeyboardEvent('keydown', { key: Keys.Tab, shiftKey: true })
    );
    const formattedInput = removeMeta(input);
    const formattedOutput = removeMeta(output);
    expect(formattedInput.children).toEqual(formattedOutput.children);
    expect(formattedInput.selection).toEqual(formattedOutput.selection);
  });
});
