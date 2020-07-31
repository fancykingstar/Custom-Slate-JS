import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Node, Range, Transforms, Point } from 'slate';
import styles from './DecaEditor.module.scss';
import SlashMenu, { MENU_ITEMS, MenuItem } from './SlashMenu';
import ClientOnlyPortal from './ClientOnlyPortal';
import { insertChoicesTool } from './tools/Choices';

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

  const [placeholderRange, setPlaceholderRange] = useState<Range | null>();
  const [placeholderPosY, setPlaceholderPosY] = useState(0);

  useEffect(() => {
    if (placeholderRange == null || !Range.isCollapsed(placeholderRange)) {
      return;
    }

    // Get the bounds of the current cursor
    const domRange = ReactEditor.toDOMRange(editor, placeholderRange);
    const rect = domRange.getBoundingClientRect();

    // Get bounds of the editor wrapper
    if (wrapperRef.current == null) {
      return;
    }
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    // TODO: Fix -1px offset due to mismatching of leaf rendering height to the placeholder
    setPlaceholderPosY(rect.top - wrapperRect.top + 1.0);
  }, [placeholderRange, wrapperRef]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);

          const { selection } = editor;
          // Close slash menu on editor blur
          if (selection == null || !Range.isCollapsed(selection)) {
            setSlashRange(null);
            setPlaceholderRange(null);
            return;
          }

          const [start] = Range.edges(selection);
          const lineStart = Editor.before(editor, start, { unit: 'line' });
          const lineRange = lineStart && Editor.range(editor, lineStart, start);
          const [node] = Editor.node(editor, start);

          // If active line has changed (or is unset), update placeholder state
          if (
            placeholderRange == null ||
            !Point.equals(selection.anchor, placeholderRange.anchor)
          ) {
            if (node.text === '') {
              setPlaceholderRange(selection);
            } else {
              setPlaceholderRange(null);
            }
          }

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
            opacity: placeholderRange != null ? 1.0 : 0.0,
            transform: `translate3d(0, ${placeholderPosY}px, 0)`,
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
