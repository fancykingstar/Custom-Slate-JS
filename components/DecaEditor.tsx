import { useMemo, useState, useEffect, useCallback } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms } from 'slate';
import styles from './DecaEditor.module.scss';
import SlashMenu, { MENU_ITEMS } from './SlashMenu';
import ClientOnlyPortal from './ClientOnlyPortal';

export interface SlashPoint {
  x: number;
  y: number;
}

export default function DecaEditor(): JSX.Element {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [slashRange, setSlashRange] = useState<Range | null>(null);
  const [slashPos, setSlashPos] = useState<SlashPoint | null>(null);
  const [slashIndex, setSlashIndex] = useState(0);

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
          Transforms.select(editor, slashRange);
          Transforms.insertText(editor, '<FIXME: Tool goes here>');
          // TODO: Add insertion of element
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
    <div className={styles.wrapper}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);

          const { selection } = editor;
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
        <Editable
          autoFocus
          onKeyDown={onKeyDown}
          placeholder="Enter some text or press /..."
        />
        {slashRange != null && slashPos != null ? (
          <ClientOnlyPortal>
            <div
              className={styles.slashWrapper}
              style={{
                transform: `translate3d(${slashPos.x}px, ${slashPos.y}px, 0)`,
              }}
            >
              <SlashMenu activeIndex={slashIndex} />
            </div>
          </ClientOnlyPortal>
        ) : null}
      </Slate>
    </div>
  );
}
