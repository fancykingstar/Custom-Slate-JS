import { useMemo, useState, useEffect } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Node, Range } from 'slate';
import styles from './DecaEditor.module.scss';
import SlashMenu from './SlashMenu';
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
            return;
          }

          // Otherwise, close the slash menu if it's open
          if (slashRange != null) {
            setSlashRange(null);
          }
        }}
      >
        <Editable autoFocus placeholder="Enter some text or press /..." />
        {slashRange != null && slashPos != null ? (
          <ClientOnlyPortal>
            <div
              className={styles.slashWrapper}
              style={{
                transform: `translate3d(${slashPos.x}px, ${slashPos.y}px, 0)`,
              }}
            >
              <SlashMenu />
            </div>
          </ClientOnlyPortal>
        ) : null}
      </Slate>
    </div>
  );
}
