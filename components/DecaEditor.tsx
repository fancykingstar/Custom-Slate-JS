import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms } from 'slate';
import styles from './DecaEditor.module.scss';
import SlashMenu, { MENU_ITEMS, MenuItem } from './SlashMenu';
import ClientOnlyPortal from './ClientOnlyPortal';
import { insertChoicesTool } from './tools/Choices';
import usePlaceholder from './editor/usePlaceholder';

export interface SlashPoint {
  x: number;
  y: number;
}

export default function DecaEditor(): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const { phVisible, phPosY, onChangePlaceholder } = usePlaceholder(
    editor,
    wrapperRef
  );

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
          onChangePlaceholder(selection);

          // Close slash menu on editor blur
          if (selection == null || !Range.isCollapsed(selection)) {
            setSlashRange(null);
            return;
          }

          const [start] = Range.edges(selection);
          const lineStart = Editor.before(editor, start, { unit: 'line' });
          const lineRange = lineStart && Editor.range(editor, lineStart, start);
          const [node] = Editor.node(editor, start);

          // Open the slash menu if slash is the first and only char
          if (slashRange == null && lineRange != null && node.text === '/') {
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
        <div
          className={styles.placeholder}
          style={{
            opacity: phVisible ? 1.0 : 0.0,
            transform: `translate3d(0, ${phPosY}px, 0)`,
          }}
        >
          Start typing or press <kbd>/</kbd>
        </div>
        <Editable autoFocus onKeyDown={onKeyDown} />
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
