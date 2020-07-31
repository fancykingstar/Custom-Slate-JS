// @refresh reset

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms } from 'slate';
import SlashMenu, { MENU_ITEMS, MenuItem } from './SlashMenu';
import ClientOnlyPortal from './ClientOnlyPortal';
import Element, { BaseElement } from './Element';
import { insertChoicesTool } from './tools/Choices';
import withLayout from './editor/withLayout';
import Placeholder from './editor/Placeholder';
import styles from './DecaEditor.module.scss';

export interface SlashPoint {
  x: number;
  y: number;
}

export default function DecaEditor(): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(() => withLayout(withReact(createEditor())), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: BaseElement.Title,
      children: [{ text: '' }],
    },
    {
      type: BaseElement.Paragraph,
      children: [
        {
          text: '',
        },
      ],
    },
  ]);
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const [slashRange, setSlashRange] = useState<Range | null>(null);
  const [slashPos, setSlashPos] = useState<SlashPoint | null>(null);
  const [slashIndex, setSlashIndex] = useState(0);

  const onAddTool = useCallback(
    (item: MenuItem) => {
      if (slashRange == null) {
        return;
      }

      // TODO: Add insertion of element
      Transforms.select(editor, slashRange);

      if (item.title === 'Choices') {
        insertChoicesTool(editor);
      } else {
        Transforms.insertText(
          editor,
          `<FIXME: ${item.title} tool gets inserted here>`
        );
      }

      // Return focus to the editor (ex: when clicking on a slash menu item causes blur)
      ReactEditor.focus(editor);
      setSlashRange(null);
    },
    [editor, slashRange]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (slashRange == null) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSlashIndex(
            slashIndex >= MENU_ITEMS.length - 1 ? 0 : slashIndex + 1
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSlashIndex(
            slashIndex <= 0 ? MENU_ITEMS.length - 1 : slashIndex - 1
          );
          break;
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          onAddTool(MENU_ITEMS[slashIndex]);
          setSlashRange(null);
          break;
        case 'Escape':
          event.preventDefault();
          setSlashRange(null);
          break;
        default:
      }
    },
    [slashIndex, slashRange]
  );

  useEffect(() => {
    if (slashRange == null) {
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, slashRange);
    const rect = domRange.getBoundingClientRect();

    // TODO: Move slash menu on window resize
    setSlashPos({
      x: rect.left + window.pageXOffset,
      y: rect.top + window.pageYOffset + 24,
    });
  }, [slashRange]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          const { selection } = editor;
          setValue(newValue);

          // Close slash menu on editor blur
          if (selection == null || !Range.isCollapsed(selection)) {
            setSlashRange(null);
            return;
          }

          const caretPoint = selection.anchor;
          const [caretLine] = caretPoint.path;

          // Determine if slash should be available
          const [selectionStart] = Range.edges(selection);
          const [node] = Editor.node(editor, selectionStart);
          const slashAvailable =
            node.text === '/' && selectionStart.offset === 1;

          // Store selection range to calculate position of menu
          const lineStart = Editor.before(editor, selectionStart, {
            unit: 'line',
          });
          const lineRange =
            lineStart && Editor.range(editor, lineStart, selectionStart);

          // Open the slash menu if slash is the first and only char in a body line
          if (
            slashRange == null &&
            lineRange != null &&
            slashAvailable &&
            caretLine > 0
          ) {
            setSlashRange(lineRange);
            setSlashIndex(0);
            return;
          }

          // Otherwise, close the slash menu if it's open
          if (slashRange != null) {
            setSlashRange(null);
          }
        }}
      >
        <Placeholder wrapperRef={wrapperRef} />
        <Editable
          autoFocus
          onKeyDown={onKeyDown}
          renderElement={renderElement}
        />
        {slashRange != null && slashPos != null ? (
          <ClientOnlyPortal>
            <div
              className={styles.slashWrapper}
              style={{
                transform: `translate3d(${slashPos.x}px, ${slashPos.y}px, 0)`,
              }}
            >
              <SlashMenu activeIndex={slashIndex} onAddTool={onAddTool} />
            </div>
          </ClientOnlyPortal>
        ) : null}
      </Slate>
    </div>
  );
}
