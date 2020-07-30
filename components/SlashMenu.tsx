import { useState, useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import styles from './SlashMenu.module.scss';
import ClientOnlyPortal from './ClientOnlyPortal';

interface DescendentChild {
  text: string;
}

export default function SlashMenu(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const [open, setOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (el == null || editor.selection == null) {
      return;
    }

    const fragments = Editor.fragment(editor, editor.selection.anchor.path);
    const fragment = fragments[0];
    const { text } = (fragment.children as DescendentChild[])[0];

    if (!text.startsWith('/')) {
      if (open) {
        setOpen(false);
      }
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    if (rect == null) {
      return;
    }

    if (!open) {
      setOpen(true);
      setPos({
        x: rect.left + window.pageXOffset,
        y: rect.top + window.pageYOffset + el.offsetHeight,
      });
    }
  }, [editor.selection]);

  return (
    <>
      <ClientOnlyPortal>
        <div>
          <div
            className={styles.wrapper}
            ref={ref}
            style={{
              opacity: open ? 1 : 0,
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            }}
          >
            Menu
          </div>
        </div>
      </ClientOnlyPortal>
    </>
  );
}
